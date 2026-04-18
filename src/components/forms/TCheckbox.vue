<template>
  <label
    class="flex items-start gap-3 cursor-pointer"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <div class="relative flex-shrink-0" :class="checkboxContainerClasses">
      <input
        :id="field.inputId.value"
        type="checkbox"
        :checked="!!field.modelValue.value"
        :disabled="disabled"
        :indeterminate="indeterminate"
        class="sr-only peer"
        @change="handleChange"
      />
      <div :class="checkboxClasses">
        <TIcon
          v-if="field.modelValue.value && !indeterminate"
          name="check"
          :size="iconSize"
          class="text-ink"
        />
        <TIcon v-else-if="indeterminate" name="minus" :size="iconSize" class="text-ink" />
      </div>
    </div>
    <div v-if="label || description" class="flex flex-col">
      <span v-if="label" :class="labelClasses">{{ label }}</span>
      <span v-if="description" :class="descriptionClasses">{{ description }}</span>
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TIcon, { type IconSize } from '../TIcon.vue'
import { useFormField } from '../../composables/useFormField'

export type TCheckboxSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    disabled?: boolean
    indeterminate?: boolean
    label?: string
    description?: string
    size?: TCheckboxSize
  }>(),
  {
    disabled: false,
    indeterminate: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const field = useFormField<boolean>({
  modelValue: () => props.modelValue,
  emit: (value) => emit('update:modelValue', value),
})

const handleChange = (event: Event) => {
  if (!props.disabled) {
    const target = event.target as HTMLInputElement
    field.setValue(target.checked)
  }
}

const checkboxContainerClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'mt-0.5'
    case 'lg':
      return 'mt-1'
    default:
      return 'mt-0.5'
  }
})

const checkboxClasses = computed(() => {
  const base = ['flex items-center justify-center border rounded-sm transition-all']

  if (field.modelValue.value || props.indeterminate) {
    base.push('bg-success border-success')
  } else {
    base.push('bg-fill-subtle border-line')
  }

  if (!props.disabled) {
    base.push('hover:border-line-strong')
  }

  switch (props.size) {
    case 'sm':
      base.push('w-4 h-4')
      break
    case 'lg':
      base.push('w-6 h-6')
      break
    default:
      base.push('w-5 h-5')
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

const labelClasses = computed(() => {
  const base = ['text-ink']

  switch (props.size) {
    case 'sm':
      return [...base, 'text-xs'].join(' ')
    case 'lg':
      return [...base, 'text-base'].join(' ')
    default:
      return [...base, 'text-sm'].join(' ')
  }
})

const descriptionClasses = computed(() => {
  const base = ['text-ink-muted']

  switch (props.size) {
    case 'sm':
      return [...base, 'text-[0.65rem]'].join(' ')
    case 'lg':
      return [...base, 'text-sm'].join(' ')
    default:
      return [...base, 'text-xs'].join(' ')
  }
})
</script>
