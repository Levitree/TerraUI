<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <slot :values="values" :errors="errors" :getFieldProps="getFieldProps" />

    <div v-if="$slots.actions" class="flex gap-3 pt-4 border-t border-line-subtle">
      <slot name="actions" :isSubmitting="isSubmitting" :hasErrors="hasErrors" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useForm } from '../../composables/useForm'
import { z, type ZodSchema } from 'zod'
import { FORM_CONTEXT_KEY } from './types'

const props = withDefaults(
  defineProps<{
    schema?: ZodSchema
    initialValues?: Record<string, unknown>
    /**
     * Alias for `initialValues`; mirrors Nuxt UI's `UForm :state` prop so
     * existing auth-app forms keep working without template changes.
     */
    state?: Record<string, unknown>
    validateOnChange?: boolean
    validateOnBlur?: boolean
  }>(),
  {
    validateOnChange: false,
    validateOnBlur: true,
  },
)

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
  invalid: [errors: Record<string, string>]
}>()

// Use a permissive schema if none provided - z.record needs key and value types in Zod 4
const defaultSchema = z.record(z.string(), z.unknown()) as ZodSchema<Record<string, unknown>>

const form = useForm({
  schema: (props.schema ?? defaultSchema) as ZodSchema<Record<string, unknown>>,
  initialValues: props.initialValues ?? props.state,
  validateOnChange: props.validateOnChange,
  validateOnBlur: props.validateOnBlur,
})

const { values, errors, hasErrors, isSubmitting, getFieldProps } = form

// Provide form context for child components
provide(FORM_CONTEXT_KEY, {
  getFieldProps: <V = unknown,>(name: string) => form.getNestedFieldProps<V>(name),
  getFieldError: (name: string) => errors.value[name],
  setFieldValue: (name: string, value: unknown) => form.setNestedFieldValue(name, value),
  validateField: (name: string) => form.validateField(name),
})

const onSubmit = async () => {
  const isValid = form.validate()

  if (!isValid) {
    emit('invalid', { ...errors.value } as Record<string, string>)
    return
  }

  emit('submit', { ...values.value })
}

// Expose form methods for parent component access
defineExpose({
  values,
  errors,
  hasErrors,
  isSubmitting,
  validate: form.validate,
  reset: form.reset,
  clearErrors: form.clearErrors,
  setFieldValue: form.setFieldValue,
  setFieldError: form.setFieldError,
})
</script>
