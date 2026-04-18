<template>
  <span :class="containerClasses" :aria-label="alt ?? text ?? 'Avatar'" role="img">
    <img
      v-if="src && !imageFailed"
      :src="src"
      :alt="alt ?? ''"
      class="w-full h-full object-cover"
      @error="imageFailed = true"
    />
    <span v-else-if="initials" class="select-none font-semibold tracking-wider uppercase">
      {{ initials }}
    </span>
    <TIcon v-else name="user" :size="fallbackIconSize" class="text-ink-muted" />
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TIcon, { type IconSize } from './TIcon.vue'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarColor = 'primary' | 'neutral'

const props = withDefaults(
  defineProps<{
    src?: string
    text?: string
    alt?: string
    size?: AvatarSize
    color?: AvatarColor
  }>(),
  { size: 'md', color: 'neutral' },
)

const imageFailed = ref(false)

watch(
  () => props.src,
  () => {
    imageFailed.value = false
  },
)

const initials = computed(() => {
  if (!props.text) return ''
  const cleaned = props.text.trim()
  if (!cleaned) return ''
  const parts = cleaned.split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
})

const containerClasses = computed(() => {
  const base = ['inline-flex items-center justify-center overflow-hidden rounded-sm shrink-0']

  switch (props.size) {
    case 'xs':
      base.push('w-5 h-5 text-[0.6rem]')
      break
    case 'sm':
      base.push('w-7 h-7 text-xs')
      break
    case 'lg':
      base.push('w-12 h-12 text-base')
      break
    case 'xl':
      base.push('w-16 h-16 text-lg')
      break
    case 'md':
    default:
      base.push('w-10 h-10 text-sm')
  }

  if (props.color === 'primary') {
    base.push('bg-success-soft text-success')
  } else {
    base.push('bg-fill text-ink')
  }

  return base.join(' ')
})

const fallbackIconSize = computed<IconSize>(() => {
  switch (props.size) {
    case 'xs':
    case 'sm':
      return 'sm'
    case 'lg':
      return 'lg'
    case 'xl':
      return 'xl'
    case 'md':
    default:
      return 'md'
  }
})
</script>
