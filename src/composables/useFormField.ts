import { computed, getCurrentInstance, inject, type ComputedRef } from 'vue'
import { FIELD_CONTEXT_KEY } from '../components/forms/types'

export interface FieldBinding<V> {
  /** Current value — from parent `v-model` if bound, else from injected field. */
  modelValue: ComputedRef<V | undefined>
  /** Commit a new value. Emits `update:modelValue` AND updates the field (if injected). */
  setValue: (value: V) => void
  /** Error string from the injected field, undefined if standalone. */
  error: ComputedRef<string | undefined>
  /** Blur handler. Invokes the field's blur if present (triggers validation). */
  onBlur: () => void
  /** DOM id for `<input>`. Inherits from field if wrapped, else undefined. */
  inputId: ComputedRef<string | undefined>
  /** True when rendering inside a `TFormField`. */
  isWrapped: ComputedRef<boolean>
}

export interface UseFormFieldOptions<V> {
  /** Input's own `modelValue` prop. Takes precedence over the injected field. */
  modelValue: () => V | undefined
  /** Input's own `error` prop override. Takes precedence. */
  error?: () => string | boolean | undefined
  /** Called when the input emits a new value. */
  emit: (value: V) => void
  /** Called when the input blurs. */
  emitBlur?: (event?: FocusEvent) => void
}

/**
 * Bridge between standalone `v-model` usage and `TFormField` injection. Input
 * components call this and spread the returned bindings instead of reading
 * `props.modelValue` / emitting directly. When wrapped in a `TFormField`, the
 * field provides value + error + onBlur; when standalone, the input's own
 * props/emits take over transparently.
 */
export function useFormField<V>(options: UseFormFieldOptions<V>): FieldBinding<V> {
  const field = inject(FIELD_CONTEXT_KEY, null)
  const instance = getCurrentInstance()

  // Check raw vnode props to detect whether the parent explicitly bound
  // `v-model` / `modelValue`. This lets an input inside a TFormField still
  // override the injected field if the author wants.
  const hasExplicitModel = computed(() => {
    const vnodeProps = instance?.vnode.props
    return !!vnodeProps && ('modelValue' in vnodeProps || 'onUpdate:modelValue' in vnodeProps)
  })

  const modelValue = computed<V | undefined>(() => {
    if (hasExplicitModel.value || !field) return options.modelValue()
    return field.value.value as V | undefined
  })

  const error = computed<string | undefined>(() => {
    const own = options.error?.()
    if (own) return typeof own === 'string' ? own : ' '
    return field?.error.value
  })

  const inputId = computed<string | undefined>(() => field?.inputId)
  const isWrapped = computed(() => !!field)

  const setValue = (value: V) => {
    options.emit(value)
    if (field && !hasExplicitModel.value) {
      field.setValue(value as unknown)
    }
  }

  const onBlur = () => {
    options.emitBlur?.()
    field?.onBlur()
  }

  return { modelValue, setValue, error, onBlur, inputId, isWrapped }
}
