<template>
  <div :class="indicatorClasses" :title="title" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type IndicatorSize = 'sm' | 'md' | 'lg'
export type IndicatorStatus = 'success' | 'error' | 'warn' | 'neutral'

const props = withDefaults(
  defineProps<{
    status?: IndicatorStatus
    size?: IndicatorSize
    pulse?: boolean
    title?: string
  }>(),
  {
    status: 'neutral',
    size: 'md',
    pulse: false,
  },
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-2 h-2'
    case 'lg':
      return 'w-3 h-3'
    default:
      return 'w-2.5 h-2.5'
  }
})

const statusClasses = computed(() => {
  switch (props.status) {
    case 'success':
      return 'bg-success shadow-[0_0_12px_var(--color-success)]'
    case 'warn':
      return 'bg-warning shadow-[0_0_12px_var(--color-warning)]'
    case 'error':
      return 'bg-danger shadow-[0_0_12px_var(--color-danger)]'
    case 'neutral':
    default:
      return 'bg-fill-strong'
  }
})

const pulseClass = computed(() => (props.pulse ? 'animate-pulse' : ''))

const indicatorClasses = computed(() =>
  ['rounded-sm transition-all', sizeClasses.value, statusClasses.value, pulseClass.value]
    .filter(Boolean)
    .join(' '),
)
</script>
