<template>
  <div class="select-none">
    <!-- Month / year navigation -->
    <div class="flex items-center justify-between mb-2">
      <button
        type="button"
        class="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:bg-fill hover:text-ink cursor-pointer"
        aria-label="Previous month"
        @click.stop="shiftMonth(-1)"
      >
        <TIcon name="chevron-left" size="sm" />
      </button>

      <button
        type="button"
        class="px-2 py-1 rounded-sm text-xs font-bold tracking-wider uppercase text-ink hover:bg-fill cursor-pointer"
        @click.stop="showYearPicker = !showYearPicker"
      >
        {{ monthName(viewMonth) }} {{ viewYear }}
      </button>

      <button
        type="button"
        class="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:bg-fill hover:text-ink cursor-pointer"
        aria-label="Next month"
        @click.stop="shiftMonth(1)"
      >
        <TIcon name="chevron-right" size="sm" />
      </button>
    </div>

    <!-- Year picker -->
    <div v-if="showYearPicker" class="grid grid-cols-4 gap-1 max-h-56 overflow-y-auto">
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

    <!-- Day grid -->
    <template v-else>
      <div class="grid grid-cols-7 gap-1 mb-1">
        <div
          v-for="day in weekdayLabels"
          :key="day"
          class="text-center text-[0.6rem] font-bold tracking-wider uppercase text-ink-muted py-1"
        >
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1" @mouseleave="onGridLeave">
        <button
          v-for="(cell, idx) in cells"
          :key="idx"
          type="button"
          :disabled="cell.disabled"
          :aria-current="cell.isToday ? 'date' : undefined"
          :class="dayClasses(cell)"
          @click.stop="selectCell(cell)"
          @mouseenter="onCellEnter(cell)"
        >
          {{ cell.day }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TIcon from '../TIcon.vue'

/**
 * Private single-month calendar grid used by date components. Not exported from
 * the public barrel and intentionally excluded from generated LLM docs (lives in
 * `internal/`). Selecting a day emits a local-midnight `Date`; the parent owns
 * any time-of-day. `rangeStart`/`rangeEnd` drive the in-range band highlight so a
 * pair of these can render one continuous range.
 */
const props = withDefaults(
  defineProps<{
    /** The day this calendar treats as selected (its own endpoint). */
    modelValue?: Date | null
    /** Earliest selectable day (inclusive). */
    min?: Date | string | null
    /** Latest selectable day (inclusive). */
    max?: Date | string | null
    /** Per-day disabling predicate. */
    isDisabled?: (date: Date) => boolean
    /** Start of the highlighted range (for the band). */
    rangeStart?: Date | null
    /** End of the highlighted range (for the band). */
    rangeEnd?: Date | null
    /** Fixed endpoint to draw a live band toward the hovered day. */
    previewAnchor?: Date | null
    /** Enable the hover preview band (anchored at `previewAnchor`). */
    previewActive?: boolean
    /** Day of week each row starts on. 0 = Sunday. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  }>(),
  {
    modelValue: null,
    previewActive: false,
    weekStartsOn: 0,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US'

const parseInput = (value: Date | string | null | undefined): Date | null => {
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

const stripTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const today = () => stripTime(new Date())
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const viewMonth = ref(0)
const viewYear = ref(0)
const showYearPicker = ref(false)

const resetView = () => {
  const base = parseInput(props.modelValue) ?? parseInput(props.rangeStart) ?? today()
  viewMonth.value = base.getMonth()
  viewYear.value = base.getFullYear()
}
resetView()

// Re-anchor the visible month when the selected day changes externally.
watch(
  () => props.modelValue,
  () => resetView(),
)

const monthName = (m: number) => new Date(2000, m, 1).toLocaleDateString(locale, { month: 'long' })

const weekdayLabels = computed(() => {
  const labels: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(2021, 7, 1 + ((props.weekStartsOn + i) % 7))
    labels.push(d.toLocaleDateString(locale, { weekday: 'narrow' }))
  }
  return labels
})

const minBound = computed(() => parseInput(props.min))
const maxBound = computed(() => parseInput(props.max))

interface Cell {
  day: number
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isStart: boolean
  isEnd: boolean
  isBetween: boolean
  disabled: boolean
}

// Day the pointer is over (for the live booking-style preview band).
const hovered = ref<Date | null>(null)

// Effective range to paint: the hover preview (anchor → hovered) while active,
// otherwise the committed rangeStart → rangeEnd.
const band = computed<{ start: Date | null; end: Date | null }>(() => {
  if (props.previewActive && hovered.value && props.previewAnchor) {
    const a = stripTime(props.previewAnchor)
    const h = stripTime(hovered.value)
    return a <= h ? { start: a, end: h } : { start: h, end: a }
  }
  return {
    start: props.rangeStart ? stripTime(props.rangeStart) : null,
    end: props.rangeEnd ? stripTime(props.rangeEnd) : null,
  }
})

const cells = computed<Cell[]>(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const offset = (first.getDay() - props.weekStartsOn + 7) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - offset)

  const now = today()
  const { start: rs, end: re } = band.value

  const out: Cell[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)

    const isStart = rs ? sameDay(date, rs) : false
    const isEnd = re ? sameDay(date, re) : false
    const isBetween = !!rs && !!re && date > rs && date < re

    let disabled = false
    if (minBound.value && date < stripTime(minBound.value)) disabled = true
    if (maxBound.value && date > stripTime(maxBound.value)) disabled = true
    if (!disabled && props.isDisabled) disabled = props.isDisabled(date)

    out.push({
      day: date.getDate(),
      date,
      isCurrentMonth: date.getMonth() === viewMonth.value,
      isToday: sameDay(date, now),
      isStart,
      isEnd,
      isBetween,
      disabled,
    })
  }
  return out
})

const yearOptions = computed(() => {
  const start = viewYear.value - 8
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

const pickYear = (year: number) => {
  viewYear.value = year
  showYearPicker.value = false
}

const selectCell = (cell: Cell) => {
  if (cell.disabled) return
  emit('update:modelValue', cell.date)
}

const onCellEnter = (cell: Cell) => {
  if (!cell.disabled && props.previewActive) hovered.value = cell.date
}
const onGridLeave = () => {
  hovered.value = null
}

const dayClasses = (cell: Cell) => {
  const base = [
    'relative w-8 h-8 flex items-center justify-center rounded-sm text-xs font-mono transition-colors',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-info',
  ]

  if (cell.disabled) {
    base.push('text-ink-disabled cursor-not-allowed opacity-40')
    return base.join(' ')
  }

  base.push('cursor-pointer')

  if (cell.isStart || cell.isEnd) {
    base.push('bg-success-strong text-ink-inverse font-bold')
  } else if (cell.isBetween) {
    base.push('bg-success-soft text-ink')
  } else if (cell.isToday) {
    base.push('bg-fill-strong text-ink')
  } else if (cell.isCurrentMonth) {
    base.push('text-ink-secondary hover:bg-fill hover:text-ink')
  } else {
    base.push('text-ink-muted hover:bg-fill hover:text-ink-secondary')
  }

  return base.join(' ')
}
</script>
