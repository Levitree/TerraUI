<template>
  <div class="flex items-center" :class="containerClasses">
    <span v-if="label && labelPosition === 'left'" :class="labelClasses">
      {{ label }}
    </span>
    <button type="button" :disabled="disabled" :class="toggleClasses" @click="handleClick">
      <div :class="knobClasses" />
    </button>
    <span v-if="label && labelPosition === 'right'" :class="labelClasses">
      {{ label }}
    </span>
    <span v-if="!label" class="text-xs text-ink-muted">
      {{ field.modelValue.value ? 'On' : 'Off' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormField } from '../../composables/useFormField'

export type TToggleSize = 'sm' | 'md' | 'lg'
export type TToggleLabelPosition = 'left' | 'right'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    size?: TToggleSize
    label?: string
    labelPosition?: TToggleLabelPosition
  }>(),
  {
    disabled: false,
    size: 'md',
    labelPosition: 'right',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const field = useFormField<boolean>({
  modelValue: () => props.modelValue,
  emit: (value) => emit('update:modelValue', value),
})

const handleClick = () => {
  if (!props.disabled) {
    field.setValue(!field.modelValue.value)
  }
}

const containerClasses = computed(() => {
  return props.labelPosition === 'left' ? 'flex-row-reverse gap-3' : 'gap-3'
})

const toggleClasses = computed(() => {
  const base = ['relative rounded-sm transition-all border']

  if (field.modelValue.value) {
    base.push('bg-success border-success')
  } else {
    base.push('bg-fill-subtle border-line')
  }

  if (props.disabled) {
    base.push('opacity-30 cursor-not-allowed')
  } else {
    base.push('cursor-pointer')
  }

  switch (props.size) {
    case 'sm':
      base.push('w-8 h-4')
      break
    case 'lg':
      base.push('w-14 h-7')
      break
    default:
      base.push('w-10 h-5')
  }

  return base.join(' ')
})

const knobClasses = computed(() => {
  const base = ['absolute rounded-sm bg-ink transition-all']

  switch (props.size) {
    case 'sm':
      base.push('top-0.25 w-3 h-3')
      base.push(field.modelValue.value ? 'left-4.25' : 'left-0.5')
      break
    case 'lg':
      base.push('top-5 w-5 h-5')
      base.push(field.modelValue.value ? 'left-8' : 'left-1')
      break
    default:
      base.push('top-0.25 w-4 h-4')
      base.push(field.modelValue.value ? 'left-5' : 'left-0.5')
  }

  return base.join(' ')
})

const labelClasses = computed(() => {
  const base = ['text-ink-secondary']

  switch (props.size) {
    case 'sm':
      base.push('text-xs')
      break
    case 'lg':
      base.push('text-base')
      break
    default:
      base.push('text-sm')
  }

  if (props.disabled) {
    base.push('opacity-50')
  }

  return base.join(' ')
})
</script>
