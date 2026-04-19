<template>
  <Story title="TNumberInput" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.min" title="Min" />
        <HstNumber v-model="state.max" title="Max" />
        <HstNumber v-model="state.step" title="Step" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstText v-model="state.suffix" title="Suffix" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.center" title="Center" />
        <HstCheckbox v-model="state.mono" title="Mono" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-md">
        <TNumberInput
          v-model="state.value"
          :min="state.min"
          :max="state.max"
          :step="state.step"
          :size="state.size"
          :suffix="state.suffix || undefined"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :center="state.center"
          :mono="state.mono"
          :error="state.error"
        />
        <p class="mt-2 text-xs text-ink-muted">Value: {{ state.value }}</p>
      </div>
    </Variant>

    <Variant title="Bounds (min / max / step)">
      <div class="p-6 bg-bg flex flex-col gap-4 max-w-md">
        <div>
          <p class="text-xs text-ink-muted mb-1">0 – 100, step 1</p>
          <TNumberInput :model-value="50" :min="0" :max="100" :step="1" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">0 – 1, step 0.05 (decimals)</p>
          <TNumberInput :model-value="0.25" :min="0" :max="1" :step="0.05" mono />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">-10 – 10, step 2</p>
          <TNumberInput :model-value="0" :min="-10" :max="10" :step="2" />
        </div>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TNumberInput :model-value="1" size="sm" suffix="px" />
        <TNumberInput :model-value="2" size="md" suffix="px" />
        <TNumberInput :model-value="3" size="lg" suffix="px" />
      </div>
    </Variant>

    <Variant title="Stepper (± buttons)">
      <div class="p-6 bg-bg flex flex-col gap-4 max-w-md">
        <div>
          <p class="text-xs text-ink-muted mb-1">Default stepper, bounded 0–99</p>
          <TNumberInput v-model="stepper.qty" stepper :min="0" :max="99" suffix="pcs" />
          <p class="mt-1 text-xs text-ink-muted">Value: {{ stepper.qty }}</p>
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Stepper sizes</p>
          <div class="flex flex-col gap-2">
            <TNumberInput :model-value="1" stepper size="sm" />
            <TNumberInput :model-value="2" stepper size="md" />
            <TNumberInput :model-value="3" stepper size="lg" />
          </div>
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Disabled / readonly</p>
          <div class="flex flex-col gap-2">
            <TNumberInput :model-value="5" stepper disabled />
            <TNumberInput :model-value="5" stepper readonly />
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TNumberInput :model-value="10" />
        <TNumberInput :model-value="10" readonly />
        <TNumberInput :model-value="10" disabled />
        <TNumberInput :model-value="10" error />
        <TNumberInput :model-value="10" error="Out of range" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-md">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <div>
            <label class="text-xs uppercase tracking-wider text-ink-muted">Age</label>
            <TNumberInput v-bind="form.getFieldProps('age')" :min="0" :max="120" />
            <p v-if="form.errors.value.age" class="mt-1 text-xs text-danger">
              {{ form.errors.value.age }}
            </p>
          </div>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Submit
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
import TNumberInput, { type TNumberInputSize } from './TNumberInput.vue'

const state = reactive<{
  value: number
  min: number
  max: number
  step: number
  size: TNumberInputSize
  suffix: string
  placeholder: string
  disabled: boolean
  readonly: boolean
  center: boolean
  mono: boolean
  error: boolean
}>({
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  suffix: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  center: true,
  mono: false,
  error: false,
})

const stepper = reactive<{ qty: number }>({ qty: 1 })

const schema = z.object({
  age: z.number().int().min(18, 'Must be at least 18').max(120, 'Too high'),
})

const form = useForm({
  schema,
  initialValues: { age: 0 },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
