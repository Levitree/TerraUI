<template>
  <div ref="containerRef" class="relative" :class="{ 'w-full': fullWidth }">
    <button
      :id="field.inputId.value"
      type="button"
      :disabled="disabled"
      :class="triggerClasses"
      @click.stop="toggle"
      @keydown="onTriggerKeydown"
      @focus="(e) => emit('focus', e)"
    >
      <TIcon name="calendar" size="sm" class="text-ink-muted shrink-0" />
      <span
        class="flex-1 truncate text-left"
        :class="hasValue ? 'text-ink' : 'text-ink-placeholder'"
      >
        {{ displayLabel }}
      </span>
      <button
        v-if="clearable && hasValue && !disabled"
        type="button"
        class="text-ink-muted hover:text-ink cursor-pointer shrink-0"
        aria-label="Clear range"
        @click.stop="clear"
      >
        <TIcon name="x" size="xs" />
      </button>
      <TIcon name="chevron-down" size="xs" class="text-ink-muted shrink-0" />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="popupRef"
        role="dialog"
        :style="floatingStyles"
        class="z-100000 bg-elevated border border-line rounded-sm shadow-xl shadow-overlay overflow-hidden"
      >
        <!-- Quick ranges -->
        <div v-if="view === 'presets'" class="w-60 p-1.5">
          <div class="max-h-72 overflow-y-auto flex flex-col">
            <button
              v-for="preset in resolvedPresets"
              :key="preset.value"
              type="button"
              :class="rowClasses(activePreset === preset.value)"
              @click.stop="selectPreset(preset)"
            >
              <span class="truncate">{{ preset.label }}</span>
              <TIcon v-if="activePreset === preset.value" name="check" size="xs" class="shrink-0" />
            </button>
          </div>

          <div v-if="allowCustom || (clearable && hasValue)" class="my-1 h-px bg-line-subtle" />

          <button
            v-if="allowCustom"
            type="button"
            :class="rowClasses(false)"
            @click.stop="openCustom"
          >
            <span>Custom range</span>
            <TIcon name="chevron-right" size="xs" class="shrink-0" />
          </button>

          <button
            v-if="clearable && hasValue"
            type="button"
            :class="rowClasses(false)"
            @click.stop="clear"
          >
            <span>Clear range</span>
            <TIcon name="x" size="xs" class="shrink-0" />
          </button>
        </div>

        <!-- Custom range: booking-style single calendar (From → To) -->
        <div v-else class="p-3 w-[min(20rem,calc(100vw-1rem))]">
          <button
            type="button"
            class="flex items-center gap-1.5 mb-3 text-[0.65rem] font-bold tracking-wider uppercase text-ink-muted hover:text-ink cursor-pointer"
            @click.stop="view = 'presets'"
          >
            <TIcon name="chevron-left" size="xs" />
            Quick ranges
          </button>

          <!-- From / To steps. Click a step to edit it (e.g. back to From). -->
          <div class="flex items-stretch gap-2 mb-3">
            <button
              type="button"
              :class="stepClasses(editing === 'from')"
              @click.stop="editing = 'from'"
            >
              <span class="block text-[0.6rem] font-bold tracking-wider uppercase text-ink-muted">
                From
              </span>
              <span
                class="block text-xs truncate"
                :class="draftStart ? 'text-ink' : 'text-ink-placeholder'"
              >
                {{ draftStart ? fmtDateTime(draftStart) : 'Select' }}
              </span>
            </button>
            <TIcon name="arrow-right" size="xs" class="self-center text-ink-muted shrink-0" />
            <button
              type="button"
              :class="stepClasses(editing === 'to')"
              @click.stop="editing = 'to'"
            >
              <span class="block text-[0.6rem] font-bold tracking-wider uppercase text-ink-muted">
                To
              </span>
              <span
                class="block text-xs truncate"
                :class="draftEnd ? 'text-ink' : 'text-ink-placeholder'"
              >
                {{ draftEnd ? fmtDateTime(draftEnd) : 'Select' }}
              </span>
            </button>
          </div>

          <div class="flex justify-center">
            <TCalendarMonth
              :model-value="calModelValue"
              :range-start="draftStart"
              :range-end="draftEnd"
              :preview-anchor="previewAnchor"
              :preview-active="previewActive"
              :min="calMin"
              :max="calMax"
              :week-starts-on="weekStartsOn"
              @update:model-value="onPickDay"
            />
          </div>

          <div class="mt-3 flex items-center gap-2">
            <TIcon name="clock" size="xs" class="text-ink-muted shrink-0" />
            <span class="text-[0.65rem] font-bold tracking-wider uppercase text-ink-muted">
              {{ editing === 'from' ? 'From' : 'To' }} time
            </span>
            <input
              type="time"
              :step="minuteStep * 60"
              :value="timeStr(activeDraft)"
              :disabled="!activeDraft"
              :class="timeInputClasses"
              @input="onActiveTime"
            />
          </div>

          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-line-subtle">
            <span v-if="invalid" class="text-xs text-danger">End must be after start</span>
            <div class="ml-auto flex items-center gap-2">
              <TButton variant="ghost" color="neutral" size="sm" label="Cancel" @click="close" />
              <TButton
                color="inverse"
                size="sm"
                label="Apply"
                :disabled="invalid || !draftStart || !draftEnd"
                @click="applyCustom"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
export type TDateTimeRangeSize = 'sm' | 'md' | 'lg'
/** A single endpoint. `Date` and ISO-string forms round-trip through the value. */
export type TDateTimeRangeEndpoint = Date | string | null
/** The absolute window. Either endpoint may be `null` (open-ended). */
export interface TDateTimeRangeValue {
  start: TDateTimeRangeEndpoint
  end: TDateTimeRangeEndpoint
}
/** A quick-range option. `duration` is milliseconds before `now` (the end). */
export interface TDateRangePreset {
  value: string
  label: string
  duration: number
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** House quick-range vocabulary (mirrors controls_webapp's useTimeRange). */
export const DEFAULT_PRESETS: TDateRangePreset[] = [
  { value: '15m', label: 'Last 15 minutes', duration: 15 * MINUTE },
  { value: '1h', label: 'Last hour', duration: HOUR },
  { value: '6h', label: 'Last 6 hours', duration: 6 * HOUR },
  { value: '12h', label: 'Last 12 hours', duration: 12 * HOUR },
  { value: '24h', label: 'Last 24 hours', duration: DAY },
  { value: '3d', label: 'Last 3 days', duration: 3 * DAY },
  { value: '7d', label: 'Last 7 days', duration: 7 * DAY },
  { value: '30d', label: 'Last 30 days', duration: 30 * DAY },
]
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import TIcon from '../TIcon.vue'
import TButton from '../TButton.vue'
import TCalendarMonth from '../internal/TCalendarMonth.vue'
import { useFormField } from '../../composables/useFormField'
import { useAnchoredOverlay } from '../../composables/useAnchoredOverlay'

const props = withDefaults(
  defineProps<{
    /** The absolute window. Bind with `v-model`. */
    modelValue?: TDateTimeRangeValue | null
    /** Active quick-range id, or `null` for a custom range. Bind with `v-model:preset`. */
    preset?: string | null
    /** Quick-range options shown in the list. */
    presets?: TDateRangePreset[]
    /** Show the "Custom range" disclosure with the two datetime pickers. */
    allowCustom?: boolean
    /** Trigger text when no range is selected. */
    placeholder?: string
    /** Earliest selectable day (inclusive). */
    min?: Date | string
    /** Latest selectable day (inclusive). */
    max?: Date | string
    /** Day each calendar row starts on. 0 = Sunday. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** Granularity of the time inputs, in minutes. */
    minuteStep?: number
    /** Re-resolve an active relative preset against `now` on an interval. */
    live?: boolean
    /** Interval (ms) for `live` re-resolution. */
    liveInterval?: number
    /** Custom trigger-label formatter. */
    format?: (range: { start: Date | null; end: Date | null }, preset: string | null) => string
    disabled?: boolean
    clearable?: boolean
    error?: boolean | string
    size?: TDateTimeRangeSize
    fullWidth?: boolean
  }>(),
  {
    modelValue: null,
    presets: () => DEFAULT_PRESETS,
    allowCustom: true,
    placeholder: 'Select range',
    weekStartsOn: 0,
    minuteStep: 1,
    live: false,
    liveInterval: 30_000,
    disabled: false,
    clearable: true,
    size: 'md',
    fullWidth: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: TDateTimeRangeValue | null]
  'update:preset': [value: string | null]
  /** Convenience event carrying resolved `Date`s regardless of value shape. */
  change: [value: { start: Date | null; end: Date | null; preset: string | null }]
  blur: [event?: FocusEvent]
  focus: [event?: FocusEvent]
}>()

const field = useFormField<TDateTimeRangeValue | null>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => emit('update:modelValue', value),
  emitBlur: (event) => emit('blur', event),
})

const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US'
const resolvedPresets = computed(() => props.presets ?? DEFAULT_PRESETS)

// --- preset (v-model:preset), controlled or uncontrolled -------------------
const internalPreset = ref<string | null>(props.preset ?? null)
watch(
  () => props.preset,
  (value) => {
    if (value !== undefined) internalPreset.value = value
  },
)
const activePreset = computed(() => internalPreset.value)
const setPreset = (value: string | null) => {
  internalPreset.value = value
  emit('update:preset', value)
}

// --- value parsing & resolved selection ------------------------------------
const parseEndpoint = (value: TDateTimeRangeEndpoint | undefined): Date | null => {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  // Date-only string -> local midnight; anything else (ISO datetime) -> native parse.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

const selected = computed(() => {
  const v = field.modelValue.value
  return { start: parseEndpoint(v?.start ?? null), end: parseEndpoint(v?.end ?? null) }
})

const hasValue = computed(
  () => !!(selected.value.start || selected.value.end || activePreset.value),
)

const fmtDateTime = (d: Date) =>
  d.toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

const displayLabel = computed(() => {
  const { start, end } = selected.value
  if (props.format) return props.format({ start, end }, activePreset.value)
  if (activePreset.value) {
    const p = resolvedPresets.value.find((x) => x.value === activePreset.value)
    if (p) return p.label
  }
  if (start && end) return `${fmtDateTime(start)} → ${fmtDateTime(end)}`
  if (start) return `From ${fmtDateTime(start)}`
  if (end) return `Until ${fmtDateTime(end)}`
  return props.placeholder
})

// --- emitting (shape-preserving) -------------------------------------------
const emitRange = (start: Date | null, end: Date | null) => {
  const cur = field.modelValue.value
  const wantsIso = typeof cur?.start === 'string' || typeof cur?.end === 'string'
  const conv = (d: Date | null): TDateTimeRangeEndpoint =>
    d == null ? null : wantsIso ? d.toISOString() : d
  field.setValue({ start: conv(start), end: conv(end) })
  emit('change', { start, end, preset: activePreset.value })
}

const commit = (start: Date | null, end: Date | null, presetValue: string | null) => {
  setPreset(presetValue)
  emitRange(start, end)
}

const selectPreset = (preset: TDateRangePreset) => {
  const end = new Date()
  const start = new Date(end.getTime() - preset.duration)
  commit(start, end, preset.value)
  close()
}

const clear = () => {
  setPreset(null)
  field.setValue(null)
  emit('change', { start: null, end: null, preset: null })
  close()
}

// --- custom view -----------------------------------------------------------
const view = ref<'presets' | 'custom'>('presets')
const draftStart = ref<Date | null>(null)
const draftEnd = ref<Date | null>(null)

// Which endpoint the single calendar is currently picking.
const editing = ref<'from' | 'to'>('from')

const stripDay = (d: Date | null) =>
  d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null

const customMin = computed(() => parseEndpoint(props.min ?? null))
const customMax = computed(() => parseEndpoint(props.max ?? null))

// One calendar, two modes. Editing "to" can't go before the start day; editing
// "from" can't go past the end day. Global min/max always apply on top.
const calMin = computed<Date | null>(() => {
  if (editing.value === 'to') {
    const s = stripDay(draftStart.value)
    if (s && customMin.value) return s > customMin.value ? s : customMin.value
    return s ?? customMin.value
  }
  return customMin.value
})
const calMax = computed<Date | null>(() => {
  if (editing.value === 'from') {
    const e = stripDay(draftEnd.value)
    if (e && customMax.value) return e < customMax.value ? e : customMax.value
    return e ?? customMax.value
  }
  return customMax.value
})

// Anchor the visible month to the endpoint being edited.
const calModelValue = computed(() =>
  editing.value === 'to'
    ? (draftEnd.value ?? draftStart.value)
    : (draftStart.value ?? draftEnd.value),
)
const activeDraft = computed(() => (editing.value === 'from' ? draftStart.value : draftEnd.value))

// Live hover band anchors at the OTHER endpoint while it exists.
const previewAnchor = computed(() => (editing.value === 'to' ? draftStart.value : draftEnd.value))
const previewActive = computed(() => !!previewAnchor.value)

const invalid = computed(
  () =>
    !!draftStart.value &&
    !!draftEnd.value &&
    draftEnd.value.getTime() <= draftStart.value.getTime(),
)

const openCustom = () => {
  // Start from any existing range; otherwise begin the From → To flow empty.
  draftStart.value = selected.value.start
  draftEnd.value = selected.value.end
  editing.value = draftStart.value && !draftEnd.value ? 'to' : 'from'
  view.value = 'custom'
}

const withDate = (base: Date | null, picked: Date) => {
  const b = base ?? new Date()
  return new Date(
    picked.getFullYear(),
    picked.getMonth(),
    picked.getDate(),
    b.getHours(),
    b.getMinutes(),
    0,
    0,
  )
}

const withTime = (base: Date | null, value: string): Date | null => {
  if (!value) return base
  const [h, m] = value.split(':').map(Number)
  const b = base ?? new Date()
  return new Date(b.getFullYear(), b.getMonth(), b.getDate(), h || 0, m || 0, 0, 0)
}

const timeStr = (d: Date | null) => {
  if (!d) return ''
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const onPickDay = (date: Date) => {
  if (editing.value === 'from') {
    draftStart.value = withDate(draftStart.value, date)
    // Booking flow: a new start past the end drops the end so you re-pick it.
    const s = stripDay(draftStart.value)
    const e = stripDay(draftEnd.value)
    if (s && e && s > e) draftEnd.value = null
    editing.value = 'to'
  } else {
    // A fresh end inherits the start's time so the range stays sensible.
    draftEnd.value = withDate(draftEnd.value ?? draftStart.value, date)
  }
}
const onActiveTime = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (editing.value === 'from') draftStart.value = withTime(draftStart.value, value)
  else draftEnd.value = withTime(draftEnd.value, value)
}

const applyCustom = () => {
  if (invalid.value || !draftStart.value || !draftEnd.value) return
  commit(draftStart.value, draftEnd.value, null)
  close()
}

// --- live re-resolution ----------------------------------------------------
let liveTimer: ReturnType<typeof setInterval> | null = null
const teardownLive = () => {
  if (liveTimer) {
    clearInterval(liveTimer)
    liveTimer = null
  }
}
const setupLive = () => {
  teardownLive()
  if (!props.live || !activePreset.value) return
  liveTimer = setInterval(
    () => {
      const p = resolvedPresets.value.find((x) => x.value === activePreset.value)
      if (!p) return teardownLive()
      const end = new Date()
      emitRange(new Date(end.getTime() - p.duration), end)
    },
    Math.max(1000, props.liveInterval),
  )
}
watch([() => props.live, () => props.liveInterval, activePreset], setupLive, { immediate: true })

// --- popover open/close + positioning --------------------------------------
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)

// The panel sizes itself (presets list vs wider custom view); the composable's
// ResizeObserver re-positions automatically when that width changes.
const { floatingStyles } = useAnchoredOverlay(containerRef, popupRef, isOpen, {
  side: 'bottom',
  align: 'start',
  sideOffset: 4,
})

const open = () => {
  if (props.disabled) return
  isOpen.value = true
  view.value = 'presets'
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  view.value = 'presets'
  field.onBlur()
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
    event.preventDefault()
    open()
  }
  if (event.key === 'Escape' && isOpen.value) close()
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value?.contains(event.target as Node)) return
  if (popupRef.value?.contains(event.target as Node)) return
  close()
}
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) close()
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  teardownLive()
})

defineExpose({ open, close })

// --- styling ---------------------------------------------------------------
const hasError = computed(() => !!field.error.value)

const rowClasses = (active: boolean) => {
  const base = [
    'flex items-center justify-between gap-3 w-full px-2.5 h-9 rounded-sm text-sm text-left cursor-pointer transition-colors',
  ]
  base.push(active ? 'bg-fill-strong text-ink' : 'text-ink-secondary hover:bg-fill hover:text-ink')
  return base.join(' ')
}

// From / To step segments in the custom view.
const stepClasses = (active: boolean) => {
  const base = [
    'flex-1 min-w-0 rounded-sm border px-2.5 py-1.5 text-left transition-colors cursor-pointer',
  ]
  base.push(active ? 'border-line-strong bg-fill-strong' : 'border-line hover:border-line-strong')
  return base.join(' ')
}

const timeInputClasses =
  'bg-fill-subtle border border-line rounded-sm text-ink font-mono px-2 py-1 text-xs focus:outline-none focus:border-line-strong focus:ring-1 focus:ring-info disabled:opacity-40 disabled:cursor-not-allowed'

const triggerClasses = computed(() => {
  const classes = [
    'flex items-center gap-2',
    'bg-fill-subtle border rounded-sm text-ink',
    'focus:outline-none transition-all',
  ]

  if (props.fullWidth) classes.push('w-full')

  if (hasError.value) classes.push('border-danger focus:border-danger')
  else classes.push('border-line focus:border-line-strong')

  if (props.disabled) classes.push('opacity-30 cursor-not-allowed')
  else classes.push('cursor-pointer hover:border-line-strong')

  switch (props.size) {
    case 'sm':
      classes.push('px-2 py-1 text-xs min-h-[30px]')
      break
    case 'lg':
      classes.push('px-4 py-3 text-base min-h-[46px]')
      break
    default:
      classes.push('px-3 py-2 text-sm min-h-[38px]')
  }

  return classes.join(' ')
})
</script>
