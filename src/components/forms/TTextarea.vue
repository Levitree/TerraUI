<template>
  <textarea
    :id="field.inputId.value"
    :value="field.modelValue.value"
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
    :rows="rows"
    :class="textareaClasses"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormField } from '../../composables/useFormField'

export type TTextareaSize = 'sm' | 'md' | 'lg'
export type TTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    readonly?: boolean
    error?: boolean | string
    resize?: TTextareaResize
    size?: TTextareaSize
    mono?: boolean
  }>(),
  {
    rows: 3,
    disabled: false,
    readonly: false,
    resize: 'none',
    size: 'md',
    mono: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const field = useFormField<string>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => emit('update:modelValue', value),
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  field.setValue(target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  field.onBlur()
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const hasError = computed(() => !!field.error.value)

const baseClasses = computed(() => {
  const classes = [
    'w-full bg-fill-subtle border rounded-sm text-ink placeholder-ink-placeholder',
    'focus:outline-none transition-all',
  ]

  if (hasError.value) {
    classes.push('border-danger focus:border-danger')
  } else {
    classes.push('border-line focus:border-line-strong')
  }

  if (props.disabled) {
    classes.push('opacity-30 cursor-not-allowed')
  } else if (props.readonly) {
    classes.push('opacity-60 cursor-not-allowed')
  }

  if (props.mono) {
    classes.push('font-mono')
  }

  return classes.join(' ')
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-1 text-xs'
    case 'lg':
      return 'px-4 py-3 text-base'
    default:
      return 'px-3 py-2 text-sm'
  }
})

const resizeClasses = computed(() => {
  switch (props.resize) {
    case 'vertical':
      return 'resize-y'
    case 'horizontal':
      return 'resize-x'
    case 'both':
      return 'resize'
    default:
      return 'resize-none'
  }
})

const textareaClasses = computed(() => {
  return `${baseClasses.value} ${sizeClasses.value} ${resizeClasses.value}`
})
</script>
