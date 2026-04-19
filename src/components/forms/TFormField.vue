<template>
  <div :class="wrapperClasses">
    <label v-if="label || $slots.label" :for="labelTarget" :class="labelClasses">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>

    <p
      v-if="description || $slots.description"
      :class="inline ? 'sr-only' : 'text-xs text-ink-muted mb-1.5'"
    >
      <slot name="description">{{ description }}</slot>
    </p>

    <!-- In inline mode the input needs to expand to fill remaining row space,
         so wrap the slot; outside inline mode we emit the slot directly to
         keep markup flat for form-context integration. -->
    <div v-if="inline" class="flex-1 min-w-0">
      <slot />
    </div>
    <slot v-else />

    <p v-if="resolvedError" :class="errorClasses">
      <slot name="error" :error="resolvedError">{{ resolvedError }}</slot>
    </p>
    <p v-else-if="hint || $slots.hint" :class="hintClasses">
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
    /**
     * Error message. Passing `true` renders the error state without a
     * message (useful when validation context lives elsewhere); a string
     * renders it as the message.
     */
    error?: string | boolean
    required?: boolean
    size?: 'sm' | 'md' | 'lg'
    /**
     * Label sits on the same row as the control, label takes intrinsic
     * width and the control expands. Hidden description/hint/error still
     * render below (error/hint) or hidden (description) as appropriate.
     */
    inline?: boolean
    /**
     * Override the `for=` target on the rendered `<label>`. Defaults to the
     * auto-generated id provided to child inputs via field context.
     */
    labelFor?: string
  }>(),
  { required: false, size: 'md', inline: false },
)

const form = inject(FORM_CONTEXT_KEY, null)

const inputId = `terra-field-${useId()}`
const labelTarget = computed(() => props.labelFor ?? inputId)

const fieldValue = computed<unknown>(() => {
  if (!form || !props.name) return undefined
  return form.getFieldProps(props.name).modelValue
})

const ownError = computed<string | undefined>(() => {
  if (typeof props.error === 'string' && props.error.length > 0) return props.error
  return undefined
})

const fieldError = computed<string | undefined>(() => {
  if (ownError.value) return ownError.value
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

const wrapperClasses = computed(() => {
  if (props.inline) return ['flex items-center gap-3']
  return ['flex flex-col', props.size === 'sm' ? 'gap-1' : 'gap-1.5']
})

const labelClasses = computed(() => {
  const base = ['font-semibold tracking-wider uppercase text-ink-secondary']
  if (props.inline) base.push('shrink-0')
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

const hintClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-[0.6rem] text-ink-muted mt-0.5'
    case 'lg':
      return 'text-xs text-ink-muted mt-1.5'
    default:
      return 'text-[0.65rem] text-ink-muted mt-1'
  }
})
</script>
