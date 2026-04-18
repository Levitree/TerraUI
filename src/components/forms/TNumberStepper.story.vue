<template>
  <Story title="TNumberStepper" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.min" title="Min" />
        <HstNumber v-model="state.max" title="Max" />
        <HstNumber v-model="state.step" title="Step" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstText v-model="state.suffix" title="Suffix" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-md">
        <TNumberStepper
          v-model="state.value"
          :min="state.min"
          :max="state.max"
          :step="state.step"
          :size="state.size"
          :suffix="state.suffix || undefined"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :error="state.error"
        />
        <p class="mt-2 text-xs text-ink-muted">Value: {{ state.value }}</p>
      </div>
    </Variant>

    <Variant title="Bounds (min / max / step)">
      <div class="p-6 bg-bg flex flex-col gap-4 max-w-md">
        <div>
          <p class="text-xs text-ink-muted mb-1">0 – 10, step 1 (at min disables minus)</p>
          <TNumberStepper :model-value="0" :min="0" :max="10" :step="1" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">At max (plus disabled)</p>
          <TNumberStepper :model-value="10" :min="0" :max="10" :step="1" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Fractional step 0.25</p>
          <TNumberStepper :model-value="0.5" :min="0" :max="5" :step="0.25" mono />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Step 5 with suffix</p>
          <TNumberStepper :model-value="30" :min="0" :max="100" :step="5" suffix="%" />
        </div>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-4 max-w-md">
        <TNumberStepper :model-value="1" size="sm" />
        <TNumberStepper :model-value="2" size="md" />
        <TNumberStepper :model-value="3" size="lg" />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TNumberStepper :model-value="5" />
        <TNumberStepper :model-value="5" readonly />
        <TNumberStepper :model-value="5" disabled />
        <TNumberStepper :model-value="5" error />
        <TNumberStepper :model-value="5" error="Out of range" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-md">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <div>
            <label class="text-xs uppercase tracking-wider text-ink-muted">Quantity</label>
            <TNumberStepper v-bind="form.getFieldProps('quantity')" :min="1" :max="10" />
            <p v-if="form.errors.value.quantity" class="mt-1 text-xs text-danger">
              {{ form.errors.value.quantity }}
            </p>
          </div>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Add to cart
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
import TNumberStepper from './TNumberStepper.vue'
import type { TNumberInputSize } from './TNumberInput.vue'

const state = reactive<{
  value: number
  min: number
  max: number
  step: number
  size: TNumberInputSize
  suffix: string
  disabled: boolean
  readonly: boolean
  error: boolean
}>({
  value: 0,
  min: 0,
  max: 10,
  step: 1,
  size: 'md',
  suffix: '',
  disabled: false,
  readonly: false,
  error: false,
})

const schema = z.object({
  quantity: z.number().int().min(1, 'Minimum 1 item').max(10, 'Maximum 10 items'),
})

const form = useForm({
  schema,
  initialValues: { quantity: 1 },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
