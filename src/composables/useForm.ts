import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { type ZodSchema, type ZodError } from 'zod'

export interface UseFormOptions<T extends Record<string, unknown>> {
  schema: ZodSchema<T>
  initialValues?: Partial<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export interface FieldProps<V> {
  modelValue: V
  error: string | undefined
  onBlur: () => void
  'onUpdate:modelValue': (value: V) => void
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  /** Reactive form values */
  values: Ref<T>

  /** Reactive error messages keyed by field name */
  errors: Ref<Record<string, string>>

  /** Whether the form has any errors */
  hasErrors: ComputedRef<boolean>

  /** Whether the form is currently submitting */
  isSubmitting: Ref<boolean>

  /** Whether the form has been modified from initial values */
  isDirty: ComputedRef<boolean>

  /** Get props to spread onto a field component */
  getFieldProps: <K extends keyof T>(name: K) => FieldProps<T[K]>

  /** Get props for nested fields using dot notation */
  getNestedFieldProps: <V = unknown>(path: string) => FieldProps<V>

  /** Validate the entire form */
  validate: () => boolean

  /** Validate a single field */
  validateField: (name: keyof T | string) => boolean

  /** Set a field value programmatically */
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void

  /** Set a nested field value using dot notation */
  setNestedFieldValue: (path: string, value: unknown) => void

  /** Set a field error programmatically */
  setFieldError: (name: keyof T | string, error: string) => void

  /** Clear all errors */
  clearErrors: () => void

  /** Reset form to initial values */
  reset: (newValues?: Partial<T>) => void

  /** Create a submit handler that validates before calling onValid */
  handleSubmit: (onValid: (data: T) => void | Promise<void>) => (e?: Event) => Promise<void>
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

/**
 * Set a nested value in an object using dot notation
 */
function setNestedValue<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split('.')
  const result = { ...obj }
  let current: Record<string, unknown> = result

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    current[key] = { ...((current[key] as Record<string, unknown>) || {}) }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return result
}

/**
 * Composable for form state management with Zod validation
 */
export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): UseFormReturn<T> {
  const { schema, initialValues = {}, validateOnChange = false, validateOnBlur = true } = options

  // Form state
  const values = ref<T>({ ...initialValues } as T) as Ref<T>
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  const initialSnapshot = ref<T>({ ...initialValues } as T)

  // Computed properties
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const isDirty = computed(
    () => JSON.stringify(values.value) !== JSON.stringify(initialSnapshot.value),
  )

  /**
   * Extract error messages from Zod validation result
   */
  function extractErrors(zodError: ZodError): Record<string, string> {
    const result: Record<string, string> = {}
    for (const issue of zodError.issues) {
      const path = issue.path.join('.')
      if (path && !result[path]) {
        result[path] = issue.message
      }
    }
    return result
  }

  /**
   * Validate the entire form
   */
  function validate(): boolean {
    errors.value = {}
    const result = schema.safeParse(values.value)

    if (!result.success) {
      errors.value = extractErrors(result.error)
      return false
    }

    return true
  }

  /**
   * Validate a single field
   */
  function validateField(name: keyof T | string): boolean {
    const fieldName = String(name)
    // Clear existing error for this field
    delete errors.value[fieldName]

    // Validate the entire form but only extract error for this field
    const result = schema.safeParse(values.value)

    if (!result.success) {
      const fieldErrors = extractErrors(result.error)
      if (fieldErrors[fieldName]) {
        errors.value[fieldName] = fieldErrors[fieldName]
        return false
      }
    }

    return true
  }

  /**
   * Set a field value
   */
  function setFieldValue<K extends keyof T>(name: K, value: T[K]): void {
    values.value[name] = value
    const fieldName = String(name)

    // Clear error when value changes
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
    }

    if (validateOnChange) {
      validateField(name)
    }
  }

  /**
   * Set a nested field value using dot notation
   */
  function setNestedFieldValue(path: string, value: unknown): void {
    values.value = setNestedValue(values.value, path, value)

    // Clear error when value changes
    if (errors.value[path]) {
      delete errors.value[path]
    }

    if (validateOnChange) {
      validateField(path)
    }
  }

  /**
   * Set a field error
   */
  function setFieldError(name: keyof T | string, error: string): void {
    errors.value[String(name)] = error
  }

  /**
   * Clear all errors
   */
  function clearErrors(): void {
    errors.value = {}
  }

  /**
   * Reset form to initial values
   */
  function reset(newValues?: Partial<T>): void {
    const resetTo = newValues ?? initialSnapshot.value
    values.value = { ...resetTo } as T
    errors.value = {}
  }

  /**
   * Get field props for a top-level field
   */
  function getFieldProps<K extends keyof T>(name: K): FieldProps<T[K]> {
    const fieldName = String(name)
    return {
      modelValue: values.value[name],
      error: errors.value[fieldName],
      onBlur: () => {
        if (validateOnBlur) {
          validateField(name)
        }
      },
      'onUpdate:modelValue': (value: T[K]) => {
        setFieldValue(name, value)
      },
    }
  }

  /**
   * Get field props for nested fields using dot notation
   */
  function getNestedFieldProps<V = unknown>(path: string): FieldProps<V> {
    return {
      modelValue: getNestedValue(values.value, path) as V,
      error: errors.value[path],
      onBlur: () => {
        if (validateOnBlur) {
          validateField(path)
        }
      },
      'onUpdate:modelValue': (value: V) => {
        setNestedFieldValue(path, value)
      },
    }
  }

  /**
   * Create a submit handler
   */
  function handleSubmit(onValid: (data: T) => void | Promise<void>) {
    return async (e?: Event) => {
      e?.preventDefault()

      if (!validate()) {
        return
      }

      isSubmitting.value = true

      try {
        await onValid(values.value)
      } finally {
        isSubmitting.value = false
      }
    }
  }

  // Watch for external changes to initial values
  watch(
    () => options.initialValues,
    (newInitial) => {
      if (newInitial) {
        initialSnapshot.value = { ...newInitial } as T
        // Optionally update values if form isn't dirty
        if (!isDirty.value) {
          values.value = { ...newInitial } as T
        }
      }
    },
    { deep: true },
  )

  return {
    values,
    errors,
    hasErrors,
    isSubmitting,
    isDirty,
    getFieldProps,
    getNestedFieldProps,
    validate,
    validateField,
    setFieldValue,
    setNestedFieldValue,
    setFieldError,
    clearErrors,
    reset,
    handleSubmit,
  }
}
