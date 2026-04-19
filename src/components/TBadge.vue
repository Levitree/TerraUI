<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant = 'type' | 'status' | 'default' | 'subtle' | 'outline' | 'solid'
export type BadgeStatus = 'online' | 'offline' | 'active' | 'inactive'
export type BadgeColor =
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'danger'
  | 'neutral'
export type BadgeSize = 'xs' | 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant
    status?: BadgeStatus
    color?: BadgeColor
    size?: BadgeSize
  }>(),
  {
    variant: 'default',
    size: 'sm',
  },
)

// Normalise incoming Nuxt-UI-style color names onto TerraUI's semantic tokens.
// `primary` borrows the info scale and `error` aliases `danger` so callers can
// drop a Nuxt UI badge in without remapping.
type Scale = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

const scale = computed<Scale>(() => {
  switch (props.color) {
    case 'primary':
    case 'info':
      return 'info'
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'error':
    case 'danger':
      return 'danger'
    case 'neutral':
      return 'neutral'
    default:
      return 'neutral'
  }
})

// Static class maps — Tailwind can only pick up classes whose full literal
// string is present in source, so interpolation (`bg-${scale}-soft`) silently
// drops at build time. Keep one branch per color × variant combo.
const SUBTLE: Record<Scale, string> = {
  info: 'bg-info-soft text-info border border-info/30',
  success: 'bg-success-soft text-success border border-success/30',
  warning: 'bg-warning-soft text-warning border border-warning/30',
  danger: 'bg-danger-soft text-danger border border-danger/30',
  neutral: 'bg-fill-subtle text-ink-secondary border border-line-subtle',
}

const OUTLINE: Record<Scale, string> = {
  info: 'text-info border border-info/50',
  success: 'text-success border border-success/50',
  warning: 'text-warning border border-warning/50',
  danger: 'text-danger border border-danger/50',
  neutral: 'text-ink-secondary border border-line',
}

const SOLID: Record<Scale, string> = {
  info: 'bg-info text-ink-inverse border border-info',
  success: 'bg-success text-ink-inverse border border-success',
  warning: 'bg-warning text-ink-inverse border border-warning',
  danger: 'bg-danger text-ink-inverse border border-danger',
  neutral: 'bg-fill text-ink border border-line',
}

const SIZE: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[0.6rem]',
  sm: 'px-2 py-0.5 text-[0.65rem]',
  md: 'px-2 py-1 text-xs',
}

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center gap-1 rounded-sm font-bold tracking-wider uppercase whitespace-nowrap leading-none'

  // Color-aware variants take precedence when a color is provided.
  if (props.variant === 'subtle' || (props.color && props.variant === 'default')) {
    return `${base} ${SIZE[props.size]} ${SUBTLE[scale.value]}`
  }

  if (props.variant === 'outline') {
    return `${base} ${SIZE[props.size]} ${OUTLINE[scale.value]}`
  }

  if (props.variant === 'solid') {
    return `${base} ${SIZE[props.size]} ${SOLID[scale.value]}`
  }

  if (props.variant === 'type') {
    return `${base} px-2 py-1 text-[0.7rem] border border-line bg-fill-subtle text-ink-muted`
  }

  if (props.variant === 'status') {
    return `${base} text-[0.65rem] transition-colors ${getStatusClass()}`
  }

  // Default (no color, no variant override)
  return `${base} ${SIZE[props.size]} border border-line bg-fill-subtle text-ink-secondary`
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
