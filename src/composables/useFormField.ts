import { computed, inject, type ComputedRef } from 'vue'
import { FIELD_CONTEXT_KEY } from '../components/forms/types'

export interface FieldBinding<V> {
  /** Current value — from the injected field if wrapped, else from parent `v-model`. */
  modelValue: ComputedRef<V | undefined>
  /** Commit a new value. Emits `update:modelValue` AND syncs the field (if injected). */
  setValue: (value: V) => void
  /** Error string from the injected field, undefined if standalone. */
  error: ComputedRef<string | undefined>
  /** Blur handler. Invokes the field's blur if present (triggers validation). */
  onBlur: () => void
  /** DOM id for `<input>`. Inherits from field if wrapped, else undefined. */
  inputId: ComputedRef<string | undefined>
  /** True when rendering inside a named `TFormField`. */
  isWrapped: ComputedRef<boolean>
}

export interface UseFormFieldOptions<V> {
  /** Input's own `modelValue` prop. Used when standalone, or as a fallback when
   *  the wrapping `TFormField` has no `name`. */
  modelValue: () => V | undefined
  /** Input's own `error` prop override. Takes precedence over field error. */
  error?: () => string | boolean | undefined
  /** Called when the input emits a new value. */
  emit: (value: V) => void
  /** Called when the input blurs. */
  emitBlur?: (event?: FocusEvent) => void
}

/**
 * Bridge between standalone `v-model` usage and `TFormField` injection. Input
 * components call this and spread the returned bindings instead of reading
 * `props.modelValue` / emitting directly.
 *
 * Resolution:
 * - Inside a named `TFormField`: the field is the source of truth for
 *   value/error. Input writes go through both the field (for validation) and
 *   `update:modelValue` (so any parent `v-model` stays mirrored).
 * - Otherwise: the input's own props/emits drive everything.
 */
export function useFormField<V>(options: UseFormFieldOptions<V>): FieldBinding<V> {
  const field = inject(FIELD_CONTEXT_KEY, null)

  // A field is "active" only if it belongs to a named TFormField. A nameless
  // TFormField is a pure label wrapper and shouldn't claim ownership of the
  // input's value — fall through to the standalone v-model path.
  const hasField = computed(() => !!field && !!field.name)

  const modelValue = computed<V | undefined>(() => {
    if (hasField.value) return field!.value.value as V | undefined
    return options.modelValue()
  })

  const error = computed<string | undefined>(() => {
    const own = options.error?.()
    if (own) return typeof own === 'string' ? own : ' '
    return field?.error.value
  })

  const inputId = computed<string | undefined>(() => field?.inputId)
  const isWrapped = computed(() => hasField.value)

  const setValue = (value: V) => {
    // Always emit so a parent v-model (if any) stays mirrored. Always push
    // into the field context (if active) so the form's internal state and
    // validation stay aligned — regardless of whether the parent also bound
    // v-model.
    options.emit(value)
    if (hasField.value) field!.setValue(value as unknown)
  }

  const onBlur = () => {
    options.emitBlur?.()
    field?.onBlur()
  }

  return { modelValue, setValue, error, onBlur, inputId, isWrapped }
}
