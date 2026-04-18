<template>
  <Story title="TToggle" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstSelect v-model="state.labelPosition" title="Label position" :options="['left', 'right']" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TToggle
          v-model="state.value"
          :label="state.label"
          :size="state.size"
          :label-position="state.labelPosition"
          :disabled="state.disabled"
        />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TToggle :model-value="false" label="Off" />
        <TToggle :model-value="true" label="On" />
        <TToggle :model-value="false" disabled label="Disabled off" />
        <TToggle :model-value="true" disabled label="Disabled on" />
        <TToggle :model-value="false" />
        <TToggle :model-value="true" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TToggle :model-value="true" size="sm" label="Small" />
        <TToggle :model-value="true" size="md" label="Medium" />
        <TToggle :model-value="true" size="lg" label="Large" />
      </div>
    </Variant>

    <Variant title="Label positions">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TToggle :model-value="true" label="Label right (default)" label-position="right" />
        <TToggle :model-value="true" label="Label left" label-position="left" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg">
        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <TToggle v-bind="form.getFieldProps('marketing')" label="Subscribe to newsletter" />
          <TToggle v-bind="form.getFieldProps('terms')" label="I accept the terms" />
          <p v-if="form.errors.value.terms" class="text-xs text-danger">
            {{ form.errors.value.terms }}
          </p>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Continue
          </button>
          <pre class="text-xs text-ink-muted">{{ JSON.stringify(form.values.value, null, 2) }}</pre>
        </form>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm } from '../../composables/useForm'
import TToggle, { type TToggleSize, type TToggleLabelPosition } from './TToggle.vue'

const state = reactive<{
  value: boolean
  label: string
  size: TToggleSize
  labelPosition: TToggleLabelPosition
  disabled: boolean
}>({
  value: false,
  label: 'Enable feature',
  size: 'md',
  labelPosition: 'right',
  disabled: false,
})

const schema = z.object({
  marketing: z.boolean(),
  terms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
})

const form = useForm({
  schema,
  initialValues: { marketing: false, terms: false },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
