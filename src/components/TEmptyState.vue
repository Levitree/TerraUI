<template>
  <div :class="['text-center border border-line-subtle border-dashed rounded-sm', paddingClass]">
    <div
      v-if="icon"
      class="bg-fill-subtle text-ink-muted mx-auto mb-3 flex items-center justify-center rounded-sm"
      :class="iconWrapSize"
    >
      <TIcon :name="icon" :size="iconPx" />
    </div>
    <div v-if="title" :class="titleClass">{{ title }}</div>
    <p v-if="hint" :class="hintClass">{{ hint }}</p>
    <div v-if="$slots.actions" class="mt-4 flex flex-wrap items-center justify-center gap-2">
      <slot name="actions" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = withDefaults(
  defineProps<{
    icon?: string
    title?: string
    hint?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const paddingClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'py-6 px-4'
    case 'lg':
      return 'py-12 px-8'
    default:
      return 'py-10 px-6'
  }
})

// Icon is a lucide SVG component sized via the `size` prop (pixels), not
// CSS font-size. Provide both a square background tile (so it reads as an
// intentional illustration instead of a stray glyph) and a matching pixel
// size per density tier.
const iconPx = computed(() => {
  switch (props.size) {
    case 'sm':
      return 20
    case 'lg':
      return 32
    default:
      return 24
  }
})

const iconWrapSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-10 h-10'
    case 'lg':
      return 'w-16 h-16'
    default:
      return 'w-12 h-12'
  }
})

const titleClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm font-bold tracking-wide text-ink'
    case 'lg':
      return 'text-lg font-bold tracking-wide text-ink'
    default:
      return 'text-base font-bold tracking-wide text-ink'
  }
})

const hintClass = computed(() => {
  const base = 'text-ink-muted mt-1 mx-auto'
  switch (props.size) {
    case 'sm':
      return `${base} text-xs max-w-xs`
    case 'lg':
      return `${base} text-sm max-w-md`
    default:
      return `${base} text-xs max-w-sm`
  }
})
</script>
