<template>
  <component
    :is="Component"
    :size="pixels"
    :stroke-width="strokeWidth"
    :class="colorClass"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconColor = 'success' | 'error' | 'warn' | 'neutral'

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
}

const COLOR_CLASS: Record<IconColor, string> = {
  success: 'text-success',
  error: 'text-danger',
  warn: 'text-warning',
  neutral: 'text-ink-muted',
}

interface IconProps {
  /**
   * Lucide icon name. Accepts any of:
   *   - kebab-case: `plus`, `chevron-right`
   *   - Nuxt/Iconify style: `i-lucide-plus`
   *   - PascalCase: `Plus`, `ChevronRight`
   *
   * Unknown names render the HelpCircle fallback.
   */
  name: string
  size?: IconSize | number
  strokeWidth?: number
  /** Semantic tone. Omit to inherit text color from the parent. */
  color?: IconColor
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
  strokeWidth: 1.75,
})

const toPascal = (kebab: string): string =>
  kebab
    .split('-')
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('')

const resolvedName = computed(() => {
  const raw = props.name.trim()
  // Strip Iconify-style prefix if present.
  const slug = raw.replace(/^i-lucide-/, '')

  // Caller may have passed PascalCase directly.
  if (/^[A-Z]/.test(slug)) return slug
  return toPascal(slug)
})

const Component = computed(() => {
  const lib = icons as Record<string, unknown>
  return lib[resolvedName.value] ?? lib.HelpCircle
})

const pixels = computed(() => {
  if (typeof props.size === 'number') return props.size
  return SIZE_MAP[props.size]
})

const colorClass = computed(() => (props.color ? COLOR_CLASS[props.color] : undefined))
</script>
