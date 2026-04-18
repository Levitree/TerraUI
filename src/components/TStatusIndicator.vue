<template>
  <div :class="indicatorClasses" :title="title" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type IndicatorSize = 'sm' | 'md' | 'lg'
export type IndicatorStatus =
  | 'online'
  | 'offline'
  | 'connecting'
  | 'active'
  | 'inactive'
  | 'warning'
  | 'error'
  | 'unknown'
  | 'unconfigured'

const props = withDefaults(
  defineProps<{
    status?: IndicatorStatus
    size?: IndicatorSize
    pulse?: boolean
    title?: string
  }>(),
  {
    status: 'offline',
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
    case 'online':
    case 'active':
      return 'bg-success shadow-[0_0_12px_var(--color-success)]'
    case 'connecting':
      return 'bg-warning shadow-[0_0_12px_var(--color-warning)] animate-pulse'
    case 'warning':
      return 'bg-warning-strong shadow-[0_0_12px_var(--color-warning-strong)]'
    case 'error':
      return 'bg-danger shadow-[0_0_12px_var(--color-danger)]'
    case 'offline':
      return 'bg-danger shadow-[0_0_12px_var(--color-danger)]'
    case 'unknown':
      return 'bg-fill-strong'
    case 'unconfigured':
      return 'bg-fill-strong'
    case 'inactive':
    default:
      return 'bg-fill-strong'
  }
})

const pulseClass = computed(() => {
  if (!props.pulse) return ''
  if (props.status === 'connecting') return ''
  return 'animate-pulse'
})

const indicatorClasses = computed(() =>
  ['rounded-sm transition-all', sizeClasses.value, statusClasses.value, pulseClass.value]
    .filter(Boolean)
    .join(' '),
)
</script>
