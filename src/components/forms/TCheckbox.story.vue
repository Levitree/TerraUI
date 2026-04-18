<template>
  <Story title="TCheckbox" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.description" title="Description" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.indeterminate" title="Indeterminate" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TCheckbox
          v-model="state.value"
          :label="state.label"
          :description="state.description"
          :size="state.size"
          :disabled="state.disabled"
          :indeterminate="state.indeterminate"
        />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TCheckbox :modelValue="false" label="Unchecked" />
        <TCheckbox :modelValue="true" label="Checked" />
        <TCheckbox :modelValue="false" indeterminate label="Indeterminate" />
        <TCheckbox :modelValue="false" disabled label="Disabled unchecked" />
        <TCheckbox :modelValue="true" disabled label="Disabled checked" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TCheckbox :modelValue="true" size="sm" label="Small" description="Compact size" />
        <TCheckbox :modelValue="true" size="md" label="Medium" description="Default size" />
        <TCheckbox :modelValue="true" size="lg" label="Large" description="Bigger touch target" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg">
        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <TCheckbox v-bind="form.getFieldProps('terms')" label="I accept the terms" />
          <p v-if="form.errors.value.terms" class="text-xs text-danger">
            {{ form.errors.value.terms }}
          </p>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Submit
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
import TCheckbox, { type TCheckboxSize } from './TCheckbox.vue'

const state = reactive<{
  value: boolean
  label: string
  description: string
  size: TCheckboxSize
  disabled: boolean
  indeterminate: boolean
}>({
  value: false,
  label: 'Enable notifications',
  description: 'You will receive emails about important updates.',
  size: 'md',
  disabled: false,
  indeterminate: false,
})

const schema = z.object({
  terms: z.literal(true, { message: 'You must accept the terms' }),
})

const form = useForm({
  schema,
  initialValues: { terms: false },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
