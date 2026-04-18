<template>
  <Story title="TRadioGroup" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.orientation"
          title="Orientation"
          :options="['vertical', 'horizontal']"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled (group)" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-xl">
        <TRadioGroup
          v-model="state.value"
          :items="items"
          :orientation="state.orientation"
          :disabled="state.disabled"
        />
        <p class="mt-3 text-xs text-ink-muted">Value: "{{ state.value }}"</p>
      </div>
    </Variant>

    <Variant title="Vertical layout">
      <div class="p-6 bg-bg max-w-md">
        <TRadioGroup :model-value="'standard'" :items="items" orientation="vertical" />
      </div>
    </Variant>

    <Variant title="Horizontal layout">
      <div class="p-6 bg-bg max-w-xl">
        <TRadioGroup
          :model-value="'standard'"
          :items="simpleItems"
          orientation="horizontal"
        />
      </div>
    </Variant>

    <Variant title="With disabled items">
      <div class="p-6 bg-bg max-w-md">
        <TRadioGroup :model-value="'free'" :items="itemsWithDisabled" />
      </div>
    </Variant>

    <Variant title="Whole-group disabled">
      <div class="p-6 bg-bg max-w-md">
        <TRadioGroup :model-value="'premium'" :items="simpleItems" disabled />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-md">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">Pick a plan</label>
          <TRadioGroup v-bind="form.getFieldProps('plan')" :items="simpleItems" />
          <p v-if="form.errors.value.plan" class="text-xs text-danger">
            {{ form.errors.value.plan }}
          </p>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Continue
          </button>
        </form>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm } from '../../composables/useForm'
import TRadioGroup, { type TRadioItem } from './TRadioGroup.vue'

const items: TRadioItem[] = [
  { value: 'free', label: 'Free', description: 'All basic features for personal use.' },
  { value: 'standard', label: 'Standard', description: 'More storage and priority support.' },
  { value: 'premium', label: 'Premium', description: 'Everything, plus advanced analytics.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom SLA — contact sales.' },
]

const simpleItems: TRadioItem[] = [
  { value: 'free', label: 'Free' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
]

const itemsWithDisabled: TRadioItem[] = [
  { value: 'free', label: 'Free' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium', description: 'Unavailable in your region', disabled: true },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
]

const state = reactive<{
  value: string
  orientation: 'vertical' | 'horizontal'
  disabled: boolean
}>({
  value: 'free',
  orientation: 'vertical',
  disabled: false,
})

const schema = z.object({
  plan: z.enum(['free', 'standard', 'premium', 'enterprise'], {
    message: 'Select a plan',
  }),
})

const form = useForm({
  schema,
  initialValues: { plan: '' as 'free' | 'standard' | 'premium' | 'enterprise' },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
