import type { ComputedRef, InjectionKey } from 'vue'
import type { FieldProps } from '../../composables/useForm'

export interface TFormContext {
  getFieldProps: <V = unknown>(name: string) => FieldProps<V>
  getFieldError: (name: string) => string | undefined
  setFieldValue: (name: string, value: unknown) => void
  validateField: (name: string) => void
}

export const FORM_CONTEXT_KEY: InjectionKey<TFormContext> = Symbol('TFormContext')

/**
 * Per-field context provided by `TFormField` to its default slot. Inputs
 * (`TInput`, `TSelect`, `TTextarea`, `TCheckbox`, `TToggle`, `TRadioGroup`)
 * inject this and use it as a fallback when no `v-model` is explicitly bound.
 * Allows the terse usage:
 *
 *   <TFormField label="Email" name="email"><TInput type="email" /></TFormField>
 */
export interface TFieldContext<V = unknown> {
  name: string
  value: ComputedRef<V>
  setValue: (value: V) => void
  error: ComputedRef<string | undefined>
  onBlur: () => void
  /** Stable DOM id. Inputs wire this into their `id` + label's `for`. */
  inputId: string
}

export const FIELD_CONTEXT_KEY: InjectionKey<TFieldContext> = Symbol('TFieldContext')
