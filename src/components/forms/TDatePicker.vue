<template>
  <div ref="containerRef" class="relative" :class="{ 'w-full': fullWidth }">
    <button
      type="button"
      :disabled="disabled"
      :class="triggerClasses"
      @click.stop="toggle"
      @keydown="onTriggerKeydown"
    >
      <TIcon name="calendar" size="sm" class="text-ink-muted shrink-0" />
      <span
        class="flex-1 truncate text-left"
        :class="selected ? 'text-ink' : 'text-ink-placeholder'"
      >
        {{ displayLabel }}
      </span>
      <button
        v-if="clearable && selected && !disabled"
        type="button"
        class="text-ink-muted hover:text-ink cursor-pointer shrink-0"
        aria-label="Clear date"
        @click.stop="clear"
      >
        <TIcon name="x" size="xs" />
      </button>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="popupRef"
        :style="floatingStyles"
        class="z-100000 bg-elevated border border-line rounded-sm shadow-xl shadow-overlay overflow-hidden"
      >
        <div class="flex items-center justify-between px-3 py-2 border-b border-line-subtle">
          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:bg-fill hover:text-ink cursor-pointer"
            aria-label="Previous month"
            @click.stop="shiftMonth(-1)"
          >
            <TIcon name="chevron-left" size="sm" />
          </button>

          <div class="flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-ink">
            <button
              type="button"
              class="px-2 py-1 rounded-sm hover:bg-fill cursor-pointer"
              @click.stop="toggleYearPicker"
            >
              {{ monthName(viewMonth) }} {{ viewYear }}
            </button>
          </div>

          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:bg-fill hover:text-ink cursor-pointer"
            aria-label="Next month"
            @click.stop="shiftMonth(1)"
          >
            <TIcon name="chevron-right" size="sm" />
          </button>
        </div>

        <div v-if="!showYearPicker" class="p-2">
          <div class="grid grid-cols-7 gap-1 mb-1">
            <div
              v-for="day in weekdayLabels"
              :key="day"
              class="text-center text-[0.6rem] font-bold tracking-wider uppercase text-ink-subtle py-1"
            >
              {{ day }}
            </div>
          </div>
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(cell, idx) in cells"
              :key="idx"
              type="button"
              :disabled="cell.disabled"
              :aria-current="cell.isToday ? 'date' : undefined"
              :class="dayClasses(cell)"
              @click.stop="selectCell(cell)"
            >
              {{ cell.day }}
            </button>
          </div>
        </div>

        <div v-else class="p-2 grid grid-cols-4 gap-1 max-h-64 overflow-y-auto">
          <button
            v-for="year in yearOptions"
            :key="year"
            type="button"
            :class="[
              'px-2 py-1.5 text-xs rounded-sm font-mono cursor-pointer transition-colors',
              year === viewYear
                ? 'bg-fill-strong text-ink'
                : 'text-ink-secondary hover:bg-fill hover:text-ink',
            ]"
            @click.stop="pickYear(year)"
          >
            {{ year }}
          </button>
        </div>

        <div
          v-if="showFooter"
          class="flex items-center justify-between gap-2 px-3 py-2 border-t border-line-subtle"
        >
          <button
            type="button"
            class="text-[0.65rem] font-bold tracking-wider uppercase text-ink-muted hover:text-ink cursor-pointer"
            @click.stop="selectToday"
          >
            Today
          </button>
          <button
            v-if="clearable"
            type="button"
            class="text-[0.65rem] font-bold tracking-wider uppercase text-ink-muted hover:text-ink cursor-pointer"
            @click.stop="clear"
          >
            Clear
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import TIcon from '../TIcon.vue'
import { useFormField } from '../../composables/useFormField'

export type TDatePickerSize = 'sm' | 'md' | 'lg'
/** Accepted value shape. Emits the same shape the user passed in. */
export type TDatePickerValue = Date | string | null

const props = withDefaults(
  defineProps<{
    /** Date value. Pass a `Date`, ISO-date string `YYYY-MM-DD`, or `null`. */
    modelValue?: TDatePickerValue
    placeholder?: string
    /** Earliest selectable date (inclusive). */
    min?: Date | string
    /** Latest selectable date (inclusive). */
    max?: Date | string
    /** Hide individual dates (e.g. weekends, holidays). */
    isDisabled?: (date: Date) => boolean
    /** Custom label formatter. Defaults to locale-formatted medium date. */
    format?: (date: Date) => string
    /** Day of the week that starts each calendar row. 0 = Sunday. Default 0. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    disabled?: boolean
    clearable?: boolean
    error?: boolean | string
    size?: TDatePickerSize
    fullWidth?: boolean
  }>(),
  {
    placeholder: 'Pick a date',
    weekStartsOn: 0,
    disabled: false,
    clearable: true,
    size: 'md',
    fullWidth: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: TDatePickerValue]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const field = useFormField<TDatePickerValue>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => emit('update:modelValue', value),
})

const parseInput = (value: TDatePickerValue | undefined): Date | null => {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (match) {
    const [, y, m, d] = match
    const date = new Date(Number(y), Number(m) - 1, Number(d))
    return Number.isNaN(date.getTime()) ? null : date
  }
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

const selected = computed(() => parseInput(field.modelValue.value))

const toIso = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Preserve the caller's value shape — string in, string out; Date in, Date out.
const emitValue = (date: Date | null) => {
  if (date === null) {
    field.setValue(null)
    return
  }
  const existing = field.modelValue.value
  if (existing instanceof Date) {
    field.setValue(date)
  } else {
    field.setValue(toIso(date))
  }
}

const today = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const viewMonth = ref(0)
const viewYear = ref(0)
const showYearPicker = ref(false)

const resetView = () => {
  const base = selected.value ?? today()
  viewMonth.value = base.getMonth()
  viewYear.value = base.getFullYear()
  showYearPicker.value = false
}
resetView()

watch(
  () => field.modelValue.value,
  () => {
    if (!isOpen.value) resetView()
  },
)

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const floatingStyles = ref<Record<string, string>>({})

const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US'

const defaultFormatter = (date: Date) =>
  date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })

const displayLabel = computed(() => {
  if (selected.value) {
    return props.format ? props.format(selected.value) : defaultFormatter(selected.value)
  }
  return props.placeholder
})

const monthName = (m: number) => {
  const d = new Date(2000, m, 1)
  return d.toLocaleDateString(locale, { month: 'long' })
}

const weekdayLabels = computed(() => {
  const labels: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(2021, 7, 1 + ((props.weekStartsOn + i) % 7))
    labels.push(d.toLocaleDateString(locale, { weekday: 'narrow' }))
  }
  return labels
})

interface Cell {
  day: number
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
}

const minBound = computed(() => (props.min ? parseInput(props.min) : null))
const maxBound = computed(() => (props.max ? parseInput(props.max) : null))

const cells = computed<Cell[]>(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const offset = (first.getDay() - props.weekStartsOn + 7) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - offset)

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const now = today()
  const out: Cell[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const isCurrentMonth = date.getMonth() === viewMonth.value
    const isToday = sameDay(date, now)
    const isSelected = selected.value ? sameDay(date, selected.value) : false

    let disabled = false
    if (minBound.value && date < stripTime(minBound.value)) disabled = true
    if (maxBound.value && date > stripTime(maxBound.value)) disabled = true
    if (!disabled && props.isDisabled) disabled = props.isDisabled(date)

    out.push({ day: date.getDate(), date, isCurrentMonth, isToday, isSelected, disabled })
  }
  return out
})

const stripTime = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const showFooter = computed(() => props.clearable || true)

const yearOptions = computed(() => {
  const base = viewYear.value
  const start = base - 8
  return Array.from({ length: 16 }, (_, i) => start + i)
})

const shiftMonth = (delta: number) => {
  let m = viewMonth.value + delta
  let y = viewYear.value
  while (m < 0) {
    m += 12
    y -= 1
  }
  while (m > 11) {
    m -= 12
    y += 1
  }
  viewMonth.value = m
  viewYear.value = y
}

const toggleYearPicker = () => {
  showYearPicker.value = !showYearPicker.value
}

const pickYear = (year: number) => {
  viewYear.value = year
  showYearPicker.value = false
}

const selectCell = (cell: Cell) => {
  if (cell.disabled) return
  emitValue(cell.date)
  close()
}

const selectToday = () => {
  const d = today()
  if (minBound.value && d < stripTime(minBound.value)) return
  if (maxBound.value && d > stripTime(maxBound.value)) return
  emitValue(d)
  close()
}

const clear = () => {
  emitValue(null)
  close()
}

const updatePosition = () => {
  if (!containerRef.value || !isOpen.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const popupHeight = 360
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  const showAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow

  floatingStyles.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
    ...(showAbove
      ? { bottom: `${viewportHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  }
}

const open = () => {
  if (props.disabled) return
  isOpen.value = true
  resetView()
  nextTick(updatePosition)
}

const close = () => {
  isOpen.value = false
  showYearPicker.value = false
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

const handleScroll = () => {
  if (isOpen.value) updatePosition()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) close()
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', updatePosition)
})

const hasError = computed(() => !!field.error.value)

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

const dayClasses = (cell: Cell) => {
  const base = [
    'relative w-8 h-8 flex items-center justify-center rounded-sm text-xs font-mono transition-colors',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-line-strong',
  ]

  if (cell.disabled) {
    base.push('text-ink-disabled cursor-not-allowed opacity-40')
    return base.join(' ')
  }

  base.push('cursor-pointer')

  if (cell.isSelected) {
    base.push('bg-success text-ink-inverse font-bold')
  } else if (cell.isToday) {
    base.push('bg-fill-strong text-ink')
  } else if (cell.isCurrentMonth) {
    base.push('text-ink-secondary hover:bg-fill hover:text-ink')
  } else {
    base.push('text-ink-subtle hover:bg-fill hover:text-ink-secondary')
  }

  return base.join(' ')
}
</script>
