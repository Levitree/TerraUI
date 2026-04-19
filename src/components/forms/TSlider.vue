<template>
  <div
    ref="rootRef"
    :class="rootClasses"
    role="group"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <div
      ref="trackRef"
      :class="trackClasses"
      @pointerdown="onTrackPointerDown"
    >
      <div :class="rangeClasses" :style="rangeStyle" />
      <button
        v-for="(thumb, index) in thumbs"
        :key="index"
        type="button"
        :disabled="disabled"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="thumb.value"
        :aria-label="ariaLabel(index)"
        role="slider"
        :class="thumbClasses"
        :style="thumbStyle(thumb.value)"
        @pointerdown.stop="onThumbPointerDown($event, index)"
        @keydown="onThumbKeydown($event, index)"
      />
    </div>

    <div
      v-if="showValue"
      class="mt-2 flex items-center justify-between text-[0.65rem] text-ink-muted font-mono tabular-nums"
    >
      <span>{{ formatValue(min) }}</span>
      <span class="text-ink">{{ formattedValue }}</span>
      <span>{{ formatValue(max) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useFormField } from '../../composables/useFormField'

export type TSliderSize = 'sm' | 'md' | 'lg'
export type TSliderColor = 'neutral' | 'success' | 'error' | 'warn'
export type TSliderValue = number | [number, number]

const props = withDefaults(
  defineProps<{
    modelValue?: TSliderValue
    min?: number
    max?: number
    step?: number
    size?: TSliderSize
    color?: TSliderColor
    disabled?: boolean
    /** Render min/current/max labels under the track. */
    showValue?: boolean
    /** Optional formatter for the shown value. */
    formatter?: (value: number) => string
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    color: 'neutral',
    disabled: false,
    showValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: TSliderValue]
  change: [value: TSliderValue]
}>()

const field = useFormField<TSliderValue>({
  modelValue: () => props.modelValue,
  emit: (value) => emit('update:modelValue', value),
})

const isRange = computed(() => Array.isArray(field.modelValue.value))

interface Thumb {
  value: number
}

const thumbs = computed<Thumb[]>(() => {
  const raw = field.modelValue.value
  if (Array.isArray(raw)) {
    return [{ value: raw[0] ?? props.min }, { value: raw[1] ?? props.max }]
  }
  return [{ value: typeof raw === 'number' ? raw : props.min }]
})

const rootRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref<number | null>(null)

const percentFor = (value: number) => {
  if (props.max === props.min) return 0
  return ((value - props.min) / (props.max - props.min)) * 100
}

const rangeStyle = computed(() => {
  if (isRange.value) {
    const [a, b] = [thumbs.value[0].value, thumbs.value[1].value].sort((x, y) => x - y)
    return { left: `${percentFor(a)}%`, right: `${100 - percentFor(b)}%` }
  }
  return { left: '0%', right: `${100 - percentFor(thumbs.value[0].value)}%` }
})

const thumbStyle = (value: number) => ({
  left: `${percentFor(value)}%`,
})

const snap = (v: number) => {
  const stepped = Math.round((v - props.min) / props.step) * props.step + props.min
  return Math.max(props.min, Math.min(stepped, props.max))
}

const positionToValue = (clientX: number) => {
  const track = trackRef.value
  if (!track) return props.min
  const rect = track.getBoundingClientRect()
  const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width
  const raw = props.min + Math.max(0, Math.min(1, ratio)) * (props.max - props.min)
  return snap(raw)
}

const commit = (next: TSliderValue) => {
  field.setValue(next)
  emit('change', next)
}

const updateThumb = (index: number, value: number) => {
  if (isRange.value) {
    const [a, b] = [thumbs.value[0].value, thumbs.value[1].value]
    const next: [number, number] = index === 0 ? [value, b] : [a, value]
    // Keep thumb 0 <= thumb 1. Swap active index if they cross.
    if (next[0] > next[1]) {
      activeIndex.value = index === 0 ? 1 : 0
      next.sort((x, y) => x - y)
    }
    commit(next as [number, number])
  } else {
    commit(value)
  }
}

const onTrackPointerDown = (event: PointerEvent) => {
  if (props.disabled) return
  const value = positionToValue(event.clientX)

  let index = 0
  if (isRange.value) {
    // Pick the thumb closest to the pointer.
    const d0 = Math.abs(value - thumbs.value[0].value)
    const d1 = Math.abs(value - thumbs.value[1].value)
    index = d0 <= d1 ? 0 : 1
  }

  activeIndex.value = index
  updateThumb(index, value)
  attachPointerTracking(event.pointerId)
}

const onThumbPointerDown = (event: PointerEvent, index: number) => {
  if (props.disabled) return
  activeIndex.value = index
  attachPointerTracking(event.pointerId)
}

const onPointerMove = (event: PointerEvent) => {
  if (activeIndex.value === null) return
  const value = positionToValue(event.clientX)
  updateThumb(activeIndex.value, value)
}

const onPointerUp = () => {
  detachPointerTracking()
  activeIndex.value = null
}

const attachPointerTracking = (_pointerId: number) => {
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}

const detachPointerTracking = () => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}

onBeforeUnmount(detachPointerTracking)

const onThumbKeydown = (event: KeyboardEvent, index: number) => {
  if (props.disabled) return
  const current = thumbs.value[index].value
  let next: number
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      next = snap(current - props.step)
      break
    case 'ArrowRight':
    case 'ArrowUp':
      next = snap(current + props.step)
      break
    case 'Home':
      next = props.min
      break
    case 'End':
      next = props.max
      break
    case 'PageDown':
      next = snap(current - props.step * 10)
      break
    case 'PageUp':
      next = snap(current + props.step * 10)
      break
    default:
      return
  }
  event.preventDefault()
  updateThumb(index, next)
}

const formatValue = (value: number) =>
  props.formatter ? props.formatter(value) : String(value)

const formattedValue = computed(() => {
  if (isRange.value) {
    const [a, b] = thumbs.value
    return `${formatValue(a.value)} – ${formatValue(b.value)}`
  }
  return formatValue(thumbs.value[0].value)
})

const ariaLabel = (index: number) => {
  if (!isRange.value) return 'Slider value'
  return index === 0 ? 'Lower bound' : 'Upper bound'
}

const rootClasses = computed(() => {
  const base = ['w-full', 'select-none']
  if (props.disabled) base.push('opacity-50 pointer-events-none')
  return base.join(' ')
})

const trackHeight: Record<TSliderSize, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

const thumbSize: Record<TSliderSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const fillColor: Record<TSliderColor, string> = {
  neutral: 'bg-ink',
  success: 'bg-success',
  error: 'bg-danger',
  warn: 'bg-warning',
}

const thumbBorder: Record<TSliderColor, string> = {
  neutral: 'border-line-strong',
  success: 'border-success',
  error: 'border-danger',
  warn: 'border-warning',
}

const trackClasses = computed(() => {
  const base = [
    'relative w-full rounded-sm bg-fill-subtle border border-line-subtle cursor-pointer',
    trackHeight[props.size],
  ]
  return base.join(' ')
})

const rangeClasses = computed(() => {
  const base = ['absolute top-0 bottom-0 rounded-sm transition-[left,right] duration-100']
  base.push(fillColor[props.color])
  return base.join(' ')
})

const thumbClasses = computed(() => {
  const base = [
    'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
    'rounded-sm bg-elevated border-2 shadow-md transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-line-strong',
    'hover:bg-fill',
    thumbSize[props.size],
    thumbBorder[props.color],
  ]
  if (props.disabled) base.push('cursor-not-allowed')
  else base.push('cursor-grab active:cursor-grabbing')
  return base.join(' ')
})
</script>
