<template>
  <div :class="badgeClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant = 'type' | 'status' | 'default'
export type BadgeStatus = 'online' | 'offline' | 'active' | 'inactive'

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant
    status?: BadgeStatus
  }>(),
  {
    variant: 'default',
  },
)

const badgeClasses = computed(() => {
  const base = 'font-bold tracking-wider uppercase'

  if (props.variant === 'type') {
    return `${base} px-2 py-1 text-[0.7rem] border border-line rounded-sm bg-fill-subtle text-ink-muted`
  }

  if (props.variant === 'status') {
    const statusClass = getStatusClass()
    return `${base} text-[0.65rem] transition-colors ${statusClass}`
  }

  // Default variant
  return `${base} px-2 py-1 text-xs border border-line rounded-sm bg-fill-subtle text-ink-secondary`
})

const getStatusClass = () => {
  switch (props.status) {
    case 'online':
    case 'active':
      return 'text-ink-secondary'
    case 'offline':
    case 'inactive':
      return 'text-ink-subtle'
    default:
      return 'text-ink-muted'
  }
}
</script>
