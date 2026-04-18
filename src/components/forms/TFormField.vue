<template>
  <div :class="wrapperClasses">
    <label v-if="label || $slots.label" :for="inputId" :class="labelClasses">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>

    <p v-if="description || $slots.description" class="text-xs text-ink-muted mb-1.5">
      <slot name="description">{{ description }}</slot>
    </p>

    <slot />

    <p v-if="resolvedError" :class="errorClasses">
      <slot name="error" :error="resolvedError">{{ resolvedError }}</slot>
    </p>
    <p v-else-if="hint || $slots.hint" class="text-[0.65rem] text-ink-muted mt-1">
      <slot name="hint">{{ hint }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide, useId } from 'vue'
import { FIELD_CONTEXT_KEY, FORM_CONTEXT_KEY, type TFieldContext } from './types'

const props = withDefaults(
  defineProps<{
    name?: string
    label?: string
    hint?: string
    description?: string
    error?: string
    required?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { required: false, size: 'md' },
)

const form = inject(FORM_CONTEXT_KEY, null)

const inputId = `terra-field-${useId()}`

const fieldValue = computed<unknown>(() => {
  if (!form || !props.name) return undefined
  return form.getFieldProps(props.name).modelValue
})

const fieldError = computed<string | undefined>(() => {
  if (props.error) return props.error
  if (!form || !props.name) return undefined
  return form.getFieldError(props.name)
})

const resolvedError = computed(() => fieldError.value)

const fieldContext: TFieldContext = {
  name: props.name ?? '',
  value: fieldValue,
  setValue: (value: unknown) => props.name && form?.setFieldValue(props.name, value),
  error: fieldError,
  onBlur: () => props.name && form?.validateField(props.name),
  inputId,
}

provide(FIELD_CONTEXT_KEY, fieldContext)

const wrapperClasses = computed(() => ['flex flex-col', props.size === 'sm' ? 'gap-1' : 'gap-1.5'])

const labelClasses = computed(() => {
  const base = ['font-semibold tracking-wider uppercase text-ink-secondary']
  switch (props.size) {
    case 'sm':
      base.push('text-[0.6rem]')
      break
    case 'lg':
      base.push('text-sm')
      break
    default:
      base.push('text-xs')
  }
  return base.join(' ')
})

const errorClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-[0.65rem] text-danger mt-0.5'
    case 'lg':
      return 'text-sm text-danger mt-1.5'
    default:
      return 'text-xs text-danger mt-1'
  }
})
</script>
