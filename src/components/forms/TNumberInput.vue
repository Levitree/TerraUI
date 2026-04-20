<template>
  <div v-if="stepper" class="flex items-center gap-2" :class="{ 'w-full': fullWidth }">
    <button
      type="button"
      :disabled="disabled || atMin"
      :class="stepperButtonClasses"
      @click="adjust(-1)"
    >
      <TIcon name="minus" :size="stepperIconSize" />
    </button>
    <TInput
      type="number"
      class="flex-1"
      :model-value="displayValue"
      :min="min"
      :max="max"
      :step="step"
      :size="size"
      :disabled="disabled"
      :readonly="readonly || isCoarsePointer"
      :placeholder="placeholder"
      :error="resolvedError"
      :center="center"
      :mono="mono"
      :suffix="suffix"
      :inputmode="isCoarsePointer ? 'none' : undefined"
      :full-width="fullWidth"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="emit('focus', $event)"
      @click="handleCoarseClick"
    />
    <button
      type="button"
      :disabled="disabled || atMax"
      :class="stepperButtonClasses"
      @click="adjust(1)"
    >
      <TIcon name="plus" :size="stepperIconSize" />
    </button>
  </div>
  <TInput
    v-else
    type="number"
    :class="fullWidth ? 'w-full' : 'w-1/3 min-w-20'"
    :model-value="displayValue"
    :min="min"
    :max="max"
    :step="step"
    :size="size"
    :disabled="disabled"
    :readonly="readonly || isCoarsePointer"
    :placeholder="placeholder"
    :error="resolvedError"
    :center="center"
    :mono="mono"
    :suffix="suffix"
    :inputmode="isCoarsePointer ? 'none' : undefined"
    :full-width="fullWidth"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="emit('focus', $event)"
    @click="handleCoarseClick"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import TInput from './TInput.vue'
import TIcon, { type IconSize } from '../TIcon.vue'
import { useFormField } from '../../composables/useFormField'
import { FIELD_CONTEXT_KEY, type TFieldContext } from './types'
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
    /**
     * Wraps the input with − and + buttons. Replaces the previous
     * `TNumberStepper` component — use this prop instead.
     */
    stepper?: boolean
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
    stepper: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const field = useFormField<number>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => emit('update:modelValue', value),
  emitBlur: (event) => event && emit('blur', event),
})

// Neutralize the field context for the inner TInput — TNumberInput owns the
// binding, so the input's own useFormField must fall back to the v-model
// props rather than double-writing to the form context.
const neutralField: TFieldContext = {
  name: '',
  value: computed(() => undefined),
  setValue: () => {},
  error: computed(() => undefined),
  onBlur: () => {},
  inputId: '',
}
provide(FIELD_CONTEXT_KEY, neutralField)

const displayValue = computed(() => field.modelValue.value ?? 0)
const resolvedError = computed(() => field.error.value)

const clampValue = (value: number): number => {
  let clamped = value
  if (props.min !== undefined) clamped = Math.max(props.min, clamped)
  if (props.max !== undefined) clamped = Math.min(props.max, clamped)
  return clamped
}

const handleInput = (value: string | number) => {
  const parsed = typeof value === 'number' ? value : parseFloat(value)
  if (!isNaN(parsed)) {
    field.setValue(clampValue(parsed))
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  field.onBlur()
}

const atMin = computed(() => props.min !== undefined && displayValue.value <= props.min)
const atMax = computed(() => props.max !== undefined && displayValue.value >= props.max)

const adjust = (direction: -1 | 1) => {
  if (props.disabled) return
  const next = clampValue(displayValue.value + direction * (props.step ?? 1))
  field.setValue(next)
  // Mirror a tab-out so consumers that commit on `@blur` also commit on step.
  emit('blur', new FocusEvent('blur'))
  field.onBlur()
}

// Coarse-pointer (touch) keypad — on tap, swap the soft-keyboard out for our
// dedicated numeric keypad window. Preserved from the pre-rewrite behavior.
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

const handleCoarseClick = (event: MouseEvent) => {
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
      allowDecimal: !Number.isInteger(props.step),
      onConfirm: (value: number) => {
        field.setValue(clampValue(value))
      },
    },
  })
}

const stepperButtonClasses = computed(() => {
  const base = [
    'flex items-center justify-center rounded-sm border border-line',
    'bg-fill-subtle text-ink-secondary transition-all',
    'not-disabled:hover:bg-fill not-disabled:hover:border-line-strong not-disabled:hover:text-ink',
    'disabled:opacity-30 disabled:cursor-not-allowed',
  ]
  // Heights match TInput: font line-height + vertical padding + 2px border.
  switch (props.size) {
    case 'sm':
      base.push('h-[26px] w-[26px]')
      break
    case 'lg':
      base.push('h-[50px] w-[50px]')
      break
    default:
      base.push('h-[38px] w-[38px]')
  }
  return base.join(' ')
})

const stepperIconSize = computed<IconSize>(() => {
  switch (props.size) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'md'
    default:
      return 'sm'
  }
})
</script>
