<template>
  <div class="flex items-center justify-between gap-4" :class="{ 'w-full': fullWidth }">
    <div class="relative" :class="fullWidth ? 'w-full' : 'w-1/3 min-w-20'">
      <input
        type="number"
        :value="displayValue"
        :disabled="disabled"
        :readonly="readonly || isCoarsePointer"
        :inputmode="isCoarsePointer ? 'none' : undefined"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @click="handleInputClick"
      />
      <span
        v-if="suffix"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle"
        :class="suffixSizeClasses"
      >
        {{ suffix }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useWindowManager } from '../../composables/useWindowManager'

export type TNumberInputSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    size?: TNumberInputSize
    disabled?: boolean
    readonly?: boolean
    placeholder?: string
    error?: boolean | string
    suffix?: string
    center?: boolean
    mono?: boolean
    fullWidth?: boolean
  }>(),
  {
    modelValue: 0,
    step: 1,
    size: 'md',
    disabled: false,
    readonly: false,
    center: true,
    mono: false,
    fullWidth: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const displayValue = computed(() => props.modelValue ?? 0)
const hasError = computed(() => !!props.error)

const clampValue = (value: number): number => {
  let clamped = value
  if (props.min !== undefined) clamped = Math.max(props.min, clamped)
  if (props.max !== undefined) clamped = Math.min(props.max, clamped)
  return clamped
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    emit('update:modelValue', clampValue(value))
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const isCoarsePointer = ref(false)
let coarseMedia: MediaQueryList | null = null
const syncCoarse = (e: MediaQueryListEvent | MediaQueryList) => {
  isCoarsePointer.value = e.matches
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    coarseMedia = window.matchMedia('(pointer: coarse)')
    isCoarsePointer.value = coarseMedia.matches
    coarseMedia.addEventListener('change', syncCoarse)
  }
})

onUnmounted(() => {
  coarseMedia?.removeEventListener('change', syncCoarse)
})

const windowManager = useWindowManager()

const handleInputClick = (event: MouseEvent) => {
  if (!isCoarsePointer.value) return
  if (props.disabled || props.readonly) return
  ;(event.target as HTMLInputElement).blur()
  windowManager.openWindow('numeric-keypad', {
    title: props.placeholder || 'Enter Number',
    props: {
      initialValue: displayValue.value,
      min: props.min,
      max: props.max,
      suffix: props.suffix,
      onConfirm: (value: number) => {
        emit('update:modelValue', clampValue(value))
      },
    },
  })
}

const baseInputClasses = computed(() => {
  const classes = [
    'bg-fill-subtle border rounded-sm text-ink placeholder-ink-placeholder',
    'focus:outline-none transition-all w-full',
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
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

  if (props.center) {
    classes.push('text-center')
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

const paddingAdjustment = computed(() => {
  if (props.suffix) {
    switch (props.size) {
      case 'sm':
        return 'pr-7'
      case 'lg':
        return 'pr-10'
      default:
        return 'pr-8'
    }
  }
  return ''
})

const inputClasses = computed(() => {
  return `${baseInputClasses.value} ${sizeClasses.value} ${paddingAdjustment.value}`
})

const suffixSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs'
    case 'lg':
      return 'text-base'
    default:
      return 'text-sm'
  }
})
</script>
