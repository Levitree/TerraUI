<template>
  <div :class="containerClasses">
    <label
      v-if="label"
      :for="labelFor"
      class="flex items-center gap-2 text-[0.7rem] font-bold tracking-wider uppercase text-ink-muted"
    >
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div v-if="description" class="text-[0.65rem] text-ink-subtle -mt-0.5 mb-1">
      {{ description }}
    </div>

    <slot />

    <div v-if="errorMessage" class="text-xs text-danger mt-1">
      {{ errorMessage }}
    </div>

    <div v-if="hint && !errorMessage" class="text-[0.65rem] text-ink-disabled mt-1">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    description?: string
    error?: string | boolean
    required?: boolean
    labelFor?: string
    inline?: boolean
    hint?: string
  }>(),
  {
    required: false,
    inline: false,
  },
)

const containerClasses = computed(() => {
  if (props.inline) {
    return 'flex items-center gap-3'
  }
  return 'space-y-1.5'
})

const errorMessage = computed(() => {
  if (typeof props.error === 'string' && props.error.length > 0) {
    return props.error
  }
  return null
})
</script>
