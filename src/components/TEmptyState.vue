<template>
  <div :class="['text-center border border-line-subtle border-dashed rounded-sm', paddingClass]">
    <TIcon v-if="icon" :name="icon" :class="'text-3xl text-ink-disabled mb-2'" />
    <div v-if="title" class="text-sm font-semibold text-ink-muted">{{ title }}</div>
    <p v-if="hint" class="mt-1 text-xs text-ink-subtle max-w-sm mx-auto">{{ hint }}</p>
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
      return 'py-4 px-3'
    case 'lg':
      return 'py-10 px-6'
    default:
      return 'py-6 px-4'
  }
})
</script>
