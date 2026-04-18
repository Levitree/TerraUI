<template>
  <div :class="['relative', fullWidth ? 'w-full' : '']">
    <input
      ref="inputEl"
      type="file"
      :accept="accept"
      :disabled="disabled"
      class="sr-only"
      @change="handleChange"
    />
    <button type="button" :disabled="disabled" :class="buttonClasses" @click="openPicker">
      <TIcon name="upload" size="sm" />
      <span class="truncate">{{ displayLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TIcon from '../TIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: File | null
    accept?: string
    disabled?: boolean
    placeholder?: string
    error?: boolean | string
    fullWidth?: boolean
  }>(),
  { placeholder: 'Choose file…', fullWidth: true },
)

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
}>()

const inputEl = ref<HTMLInputElement | null>(null)

const displayLabel = computed(() => props.modelValue?.name ?? props.placeholder)

const buttonClasses = computed(() => {
  const c = [
    'flex items-center gap-2 w-full px-3 py-2 text-sm bg-fill-subtle border rounded-sm text-ink focus:outline-none transition-all',
    props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-fill',
  ]
  c.push(props.error ? 'border-danger' : 'border-line hover:border-line-strong')
  return c.join(' ')
})

function openPicker() {
  inputEl.value?.click()
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  emit('update:modelValue', file)
}
</script>
