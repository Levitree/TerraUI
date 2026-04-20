<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <slot :values="values" :errors="errors" :getFieldProps="getFieldProps" />

    <div v-if="$slots.actions" class="flex gap-3 pt-4 border-t border-line-subtle">
      <slot name="actions" :isSubmitting="isSubmitting" :hasErrors="hasErrors" />
    </div>
  </form>
</template>

<script setup lang="ts" generic="TData extends Record<string, unknown> = Record<string, unknown>">
import { provide } from 'vue'
import { useForm } from '../../composables/useForm'
import { z, type ZodSchema } from 'zod'
import { FORM_CONTEXT_KEY } from './types'

const props = withDefaults(
  defineProps<{
    /**
     * Zod schema describing the form's values. Inferred into `TData`, which
     * types the `@submit` payload, `:initial-values`, and `defineExpose`'d
     * values.
     */
    schema?: ZodSchema<TData>
    /** Initial values for the form's internal state. */
    initialValues?: TData
    /** Alias for `initialValues`. */
    state?: TData
    /** Re-run validation on every field change. Default: false. */
    validateOnChange?: boolean
    /** Re-run validation on field blur. Default: true. */
    validateOnBlur?: boolean
  }>(),
  {
    validateOnChange: false,
    validateOnBlur: true,
  },
)

const emit = defineEmits<{
  /** Fired after successful validation with the form's parsed values. */
  submit: [data: TData]
  /** Fired when submit is attempted but validation fails. */
  invalid: [errors: Record<string, string>]
}>()

// Permissive schema if none is provided. z.record requires key+value in Zod 4.
const defaultSchema = z.record(z.string(), z.unknown()) as ZodSchema<Record<string, unknown>>

const form = useForm<TData>({
  schema: (props.schema ?? defaultSchema) as ZodSchema<TData>,
  initialValues: (props.initialValues ?? props.state) as Partial<TData> | undefined,
  validateOnChange: props.validateOnChange,
  validateOnBlur: props.validateOnBlur,
})

const { values, errors, hasErrors, isSubmitting, getFieldProps } = form

provide(FORM_CONTEXT_KEY, {
  getFieldProps: <V = unknown,>(name: string) => form.getNestedFieldProps<V>(name),
  getFieldError: (name: string) => errors.value[name],
  setFieldValue: (name: string, value: unknown) => form.setNestedFieldValue(name, value),
  validateField: (name: string) => form.validateField(name),
})

const onSubmit = async () => {
  const isValid = form.validate()

  if (!isValid) {
    emit('invalid', { ...errors.value })
    return
  }

  emit('submit', { ...values.value } as TData)
}

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
