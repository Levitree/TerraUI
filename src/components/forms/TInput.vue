<template>
  <div class="relative" :class="{ 'w-full': fullWidth }">
    <TIcon
      v-if="icon"
      :name="icon"
      :size="iconSize"
      class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
    />
    <span
      v-else-if="prefix"
      class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
      :class="prefixSizeClasses"
    >
      {{ prefix }}
    </span>
    <input
      :id="field.inputId.value"
      :type="type"
      :value="field.modelValue.value"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
      v-bind="$attrs"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <span
      v-if="suffix"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle"
      :class="suffixSizeClasses"
    >
      {{ suffix }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormField } from '../../composables/useFormField'
import TIcon from '../TIcon.vue'

defineOptions({ inheritAttrs: false })

export type TInputType = 'text' | 'number' | 'email' | 'password'
export type TInputSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: TInputType
    size?: TInputSize
    disabled?: boolean
    readonly?: boolean
    placeholder?: string
    center?: boolean
    mono?: boolean
    min?: number
    max?: number
    step?: number | string
    error?: boolean | string
    prefix?: string
    suffix?: string
    icon?: string
    fullWidth?: boolean
  }>(),
  {
    type: 'text',
    size: 'md',
    disabled: false,
    readonly: false,
    center: false,
    mono: false,
    fullWidth: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const field = useFormField<string | number>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => emit('update:modelValue', value),
  emitBlur: (event) => event && emit('blur', event),
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? parseFloat(target.value) || 0 : target.value
  field.setValue(value)
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
    'bg-fill-subtle border rounded-sm text-ink placeholder-ink-placeholder',
    'focus:outline-none transition-all w-full',
  ]

  // Border color based on error state
  if (hasError.value) {
    classes.push('border-danger focus:border-danger')
  } else {
    classes.push('border-line focus:border-line-strong')
  }

  // Disabled/readonly states — keep the value readable (profile emails,
  // user IDs, etc. surface in disabled inputs and need to stay legible).
  if (props.disabled) {
    classes.push('opacity-70 cursor-not-allowed')
  } else if (props.readonly) {
    classes.push('opacity-80 cursor-not-allowed')
  }

  if (props.center) {
    classes.push('text-center')
  }

  if (props.mono) {
    classes.push('font-mono')
  }

  // Remove number input spinners
  if (props.type === 'number') {
    classes.push('[appearance:textfield]')
    classes.push('[&::-webkit-outer-spin-button]:appearance-none')
    classes.push('[&::-webkit-inner-spin-button]:appearance-none')
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

const paddingAdjustment = computed(() => {
  const classes: string[] = []
  if (props.icon || props.prefix) {
    switch (props.size) {
      case 'sm':
        classes.push('pl-7')
        break
      case 'lg':
        classes.push('pl-10')
        break
      default:
        classes.push('pl-9')
    }
  }
  if (props.suffix) {
    switch (props.size) {
      case 'sm':
        classes.push('pr-7')
        break
      case 'lg':
        classes.push('pr-10')
        break
      default:
        classes.push('pr-8')
    }
  }
  return classes.join(' ')
})

const iconSize = computed<'xs' | 'sm' | 'md' | 'lg'>(() => {
  switch (props.size) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'md'
    default:
      return 'sm'
  }
})

const prefixSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs'
    case 'lg':
      return 'text-base'
    default:
      return 'text-sm'
  }
})

const suffixSizeClasses = computed(() => prefixSizeClasses.value)

const inputClasses = computed(() => {
  return `${baseClasses.value} ${sizeClasses.value} ${paddingAdjustment.value}`
})
</script>
