<template>
  <div
    role="radiogroup"
    :class="['flex', orientation === 'horizontal' ? 'flex-row gap-3 flex-wrap' : 'flex-col gap-2']"
  >
    <label
      v-for="item in items"
      :key="item.value"
      :class="[
        'flex items-start gap-3 px-3 py-2.5 rounded-sm border cursor-pointer transition-all',
        isSelected(item)
          ? 'bg-fill-subtle border-line-strong'
          : 'bg-surface border-line hover:border-line-strong',
        item.disabled ? 'opacity-40 cursor-not-allowed' : '',
      ]"
    >
      <input
        type="radio"
        :name="groupName"
        :value="item.value"
        :checked="isSelected(item)"
        :disabled="item.disabled || disabled"
        class="sr-only peer"
        @change="select(item)"
      />
      <span
        aria-hidden="true"
        :class="[
          'shrink-0 mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all',
          isSelected(item) ? 'border-success bg-success' : 'border-line bg-fill-subtle',
        ]"
      >
        <span v-if="isSelected(item)" class="w-1.5 h-1.5 rounded-full bg-ink" />
      </span>
      <span class="flex flex-col min-w-0 flex-1">
        <span class="text-sm font-medium tracking-wide text-ink">{{ item.label }}</span>
        <span v-if="item.description" class="text-xs text-ink-muted mt-0.5">
          {{ item.description }}
        </span>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { useFormField } from '../../composables/useFormField'

export interface TRadioItem {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    items: TRadioItem[]
    name?: string
    orientation?: 'vertical' | 'horizontal'
    disabled?: boolean
  }>(),
  { orientation: 'vertical', disabled: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const field = useFormField<string>({
  modelValue: () => props.modelValue,
  emit: (value) => emit('update:modelValue', value),
})

const groupName = props.name ?? `terra-radio-${useId()}`

const isSelected = (item: TRadioItem) => field.modelValue.value === item.value

const select = (item: TRadioItem) => {
  if (item.disabled || props.disabled) return
  field.setValue(item.value)
}
</script>
