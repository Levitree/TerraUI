<template>
  <div class="flex items-center gap-2">
    <button type="button" :disabled="disabled || atMin" :class="buttonClasses" @click="adjust(-1)">
      <TIcon name="minus" :size="iconSize" />
    </button>
    <TNumberInput
      class="flex-1"
      :modelValue="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :suffix="suffix"
      :mono="mono"
      :center="center"
      :error="error"
      @update:modelValue="$emit('update:modelValue', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <button type="button" :disabled="disabled || atMax" :class="buttonClasses" @click="adjust(1)">
      <TIcon name="plus" :size="iconSize" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TNumberInput, { type TNumberInputSize } from './TNumberInput.vue'
import TIcon, { type IconSize } from '../TIcon.vue'

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
  }>(),
  {
    modelValue: 0,
    step: 1,
    size: 'md',
    disabled: false,
    readonly: false,
    center: true,
    mono: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  jog: [direction: 1 | -1]
}>()

const clamp = (v: number): number => {
  let n = v
  if (props.min !== undefined) n = Math.max(props.min, n)
  if (props.max !== undefined) n = Math.min(props.max, n)
  return n
}

const adjust = (direction: 1 | -1) => {
  const next = clamp((props.modelValue ?? 0) + direction * props.step)
  emit('update:modelValue', next)
  emit('jog', direction)
}

const atMin = computed(() => props.min !== undefined && (props.modelValue ?? 0) <= props.min)
const atMax = computed(() => props.max !== undefined && (props.modelValue ?? 0) >= props.max)

const buttonClasses = computed(() => {
  const base = [
    'shrink-0 flex items-center justify-center rounded-sm transition-all',
    'border border-line bg-fill-subtle text-ink-secondary',
    'hover:bg-fill hover:border-line-strong',
    'disabled:opacity-30 disabled:cursor-not-allowed',
  ]
  switch (props.size) {
    case 'sm':
      base.push('w-6 h-6')
      break
    case 'lg':
      base.push('w-12 h-12')
      break
    default:
      base.push('w-9 h-9')
  }
  return base.join(' ')
})

const iconSize = computed<IconSize>(() => {
  switch (props.size) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'sm'
    default:
      return 'xs'
  }
})
</script>
