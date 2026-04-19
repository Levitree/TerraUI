<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant = 'outline' | 'ghost'
export type BadgeColor = 'success' | 'error' | 'warn' | 'neutral'
export type BadgeSize = 'xs' | 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant
    color?: BadgeColor
    size?: BadgeSize
  }>(),
  {
    variant: 'outline',
    color: 'neutral',
    size: 'sm',
  },
)

// Static class maps — Tailwind can only pick up classes whose full literal
// string is present in source, so interpolation (`bg-${scale}-soft`) silently
// drops at build time. Keep one branch per color × variant combo.
const OUTLINE: Record<BadgeColor, string> = {
  success: 'text-success border border-success/50',
  warn: 'text-warning border border-warning/50',
  error: 'text-danger border border-danger/50',
  neutral: 'text-ink-secondary border border-line',
}

const GHOST: Record<BadgeColor, string> = {
  success: 'text-success',
  warn: 'text-warning',
  error: 'text-danger',
  neutral: 'text-ink-secondary',
}

const SIZE: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[0.6rem]',
  sm: 'px-2 py-0.5 text-[0.65rem]',
  md: 'px-2 py-1 text-xs',
}

const badgeClasses = computed(() => {
  const base =
    'inline-flex items-center gap-1 rounded-sm font-bold tracking-wider uppercase whitespace-nowrap leading-none'
  const tone = props.variant === 'ghost' ? GHOST[props.color] : OUTLINE[props.color]
  return `${base} ${SIZE[props.size]} ${tone}`
})
</script>
