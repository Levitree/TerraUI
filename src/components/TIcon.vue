<template>
  <component :is="Component" :size="pixels" :stroke-width="strokeWidth" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
}

interface IconProps {
  /**
   * Lucide icon name. Accepts any of:
   *   - kebab-case: `plus`, `chevron-right`
   *   - Nuxt/Iconify style: `i-lucide-plus`
   *   - PascalCase: `Plus`, `ChevronRight`
   *
   * Legacy PrimeIcons names (e.g. `pi-check`, `pi-times`) are mapped to their
   * nearest Lucide equivalent for backwards compatibility while the migration
   * lands. Unknown names render the HelpCircle fallback.
   */
  name: string
  size?: IconSize | number
  strokeWidth?: number
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
  strokeWidth: 1.75,
})

// Legacy PrimeIcons → Lucide map. Covers every `pi-*` name referenced in the
// controls app; extend as more are discovered. Keyed on the "pi-" stripped
// slug (values are always the kebab-case Lucide name). Both the source slug
// and the Lucide name use kebab-case, so identity entries (`foo: 'foo'`) exist
// only where the slug happens to match Lucide's name verbatim — kept for
// explicitness so additions don't silently collide with the default fallback.
const PRIMEICON_ALIAS: Record<string, string> = {
  // Core symbols
  check: 'check',
  times: 'x',
  minus: 'minus',
  plus: 'plus',

  // Chevrons / arrows
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',

  // Status / alerts
  spinner: 'loader-2',
  'exclamation-triangle': 'triangle-alert',
  'info-circle': 'info',
  'check-circle': 'circle-check',
  'times-circle': 'circle-x',
  'stop-circle': 'circle-stop',
  'check-square': 'square-check',
  stop: 'square',

  // Chrome / layout
  bars: 'menu',
  ellipsis: 'ellipsis-vertical',
  'ellipsis-v': 'ellipsis-vertical',
  expand: 'maximize-2',
  'window-maximize': 'maximize-2',
  'external-link': 'external-link',

  // I/O
  upload: 'upload',
  download: 'download',
  copy: 'copy',
  refresh: 'refresh-cw',

  // Tools
  search: 'search',
  filter: 'filter',
  cog: 'settings',
  trash: 'trash-2',
  pencil: 'pencil',
  'sliders-h': 'sliders-horizontal',
  sliders: 'sliders-horizontal',
  bolt: 'zap',
  bell: 'bell',

  // Privacy / access
  eye: 'eye',
  'eye-slash': 'eye-off',
  lock: 'lock',
  unlock: 'lock-open',
  'sign-in': 'log-in',
  'sign-out': 'log-out',

  // People
  user: 'user',
  users: 'users',

  // Navigation / geo
  home: 'home',
  map: 'map',
  'map-marker': 'map-pin',

  // Infrastructure
  server: 'server',
  database: 'database',
  microchip: 'cpu',
  desktop: 'monitor',
  wifi: 'wifi',
  box: 'box',
  play: 'play',

  // Media
  video: 'video',
  'video-off': 'video-off',

  // Theme
  sun: 'sun',
  moon: 'moon',

  // Charts
  'chart-bar': 'chart-bar',
  'chart-line': 'chart-line',
  'chart-pie': 'chart-pie',
}

const toPascal = (kebab: string): string =>
  kebab
    .split('-')
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('')

const resolvedName = computed(() => {
  const raw = props.name.trim()

  // PrimeIcons legacy format: strings can arrive as either a bare slug
  // (`pi-map-marker`) or the full two-class form (`pi pi-map-marker`). Scan
  // space-separated tokens and take the first `pi-<name>` match.
  const piToken = raw.split(/\s+/).find((t) => t.startsWith('pi-') && t.length > 3)
  if (piToken) {
    const key = piToken.slice(3)
    const mapped = PRIMEICON_ALIAS[key] ?? key
    return toPascal(mapped)
  }

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
</script>
