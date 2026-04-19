<template>
  <div
    :class="[
      'w-full',
      orientation === 'vertical' ? 'h-full flex flex-col gap-2' : 'flex flex-col gap-2',
    ]"
  >
    <div
      v-if="hasHeader"
      class="flex items-center justify-between gap-2 text-[0.65rem] font-bold tracking-wider uppercase text-ink-muted"
    >
      <span v-if="label">{{ label }}</span>
      <span v-if="showValue" class="font-mono normal-case">{{ displayValue }}</span>
    </div>

    <div
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="isIndeterminate ? undefined : clampedValue"
      :class="trackClasses"
    >
      <div :class="fillClasses" :style="fillStyle" />
    </div>

    <div v-if="$slots.default" class="text-xs text-ink-muted">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ProgressColor = 'neutral' | 'success' | 'error' | 'warn'
export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg'
export type ProgressOrientation = 'horizontal' | 'vertical'

const props = withDefaults(
  defineProps<{
    /** Current value. Pass `null` to render an indeterminate bar. */
    modelValue?: number | null
    /** Upper bound for `modelValue`. Default 100. */
    max?: number
    color?: ProgressColor
    size?: ProgressSize
    orientation?: ProgressOrientation
    /** Optional header label, rendered above the bar (horizontal only). */
    label?: string
    /** Show the current percentage next to the label. */
    showValue?: boolean
  }>(),
  {
    modelValue: 0,
    max: 100,
    color: 'neutral',
    size: 'sm',
    orientation: 'horizontal',
    showValue: false,
  },
)

const isIndeterminate = computed(() => props.modelValue === null)

const clampedValue = computed(() => {
  if (isIndeterminate.value) return 0
  const v = typeof props.modelValue === 'number' ? props.modelValue : 0
  return Math.max(0, Math.min(v, props.max))
})

const percent = computed(() => (clampedValue.value / Math.max(1, props.max)) * 100)

const displayValue = computed(() => {
  if (isIndeterminate.value) return '—'
  return `${Math.round(percent.value)}%`
})

const hasHeader = computed(
  () => props.orientation === 'horizontal' && (props.label !== undefined || props.showValue),
)

const trackSize: Record<ProgressSize, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

const trackSizeVertical: Record<ProgressSize, string> = {
  xs: 'w-1',
  sm: 'w-1.5',
  md: 'w-2',
  lg: 'w-3',
}

const fillColor: Record<ProgressColor, string> = {
  neutral: 'bg-ink',
  success: 'bg-success',
  error: 'bg-danger',
  warn: 'bg-warning',
}

const trackClasses = computed(() => {
  const base = ['bg-fill-subtle border border-line-subtle rounded-sm overflow-hidden relative']
  if (props.orientation === 'vertical') {
    base.push('w-full flex-1 min-h-24', trackSizeVertical[props.size], 'flex items-end')
  } else {
    base.push('w-full', trackSize[props.size])
  }
  return base.join(' ')
})

const fillClasses = computed(() => {
  const base = [fillColor[props.color]]
  if (isIndeterminate.value) {
    base.push('absolute top-0 bottom-0 tprogress-indeterminate')
    if (props.orientation === 'vertical') base.push('left-0 right-0 bottom-0')
  } else {
    base.push('transition-all duration-300 ease-out')
    if (props.orientation === 'vertical') base.push('w-full')
    else base.push('h-full')
  }
  return base.join(' ')
})

const fillStyle = computed<Record<string, string>>(() => {
  if (isIndeterminate.value) return {} as Record<string, string>
  if (props.orientation === 'vertical') return { height: `${percent.value}%` }
  return { width: `${percent.value}%` }
})
</script>

<style scoped>
.tprogress-indeterminate {
  width: 40%;
  animation: tprogress-slide 1.4s ease-in-out infinite;
}

@keyframes tprogress-slide {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(150%);
  }
  100% {
    transform: translateX(300%);
  }
}
</style>
