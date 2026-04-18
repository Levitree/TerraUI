<template>
  <div :class="['flex flex-col items-center justify-center text-center', paddingClass]">
    <TIcon name="loader-2" :size="iconSize" :class="['animate-spin', iconColor]" />
    <span v-if="label" class="mt-2 text-xs text-ink-subtle">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    size?: 'sm' | 'md' | 'lg'
    inline?: boolean
  }>(),
  { size: 'md', inline: false },
)

const paddingClass = computed(() => (props.inline ? '' : 'py-8'))

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 16
    case 'lg':
      return 32
    default:
      return 24
  }
})

const iconColor = computed(() => {
  switch (props.size) {
    case 'lg':
      return 'text-ink-subtle'
    default:
      return 'text-ink-disabled'
  }
})
</script>
