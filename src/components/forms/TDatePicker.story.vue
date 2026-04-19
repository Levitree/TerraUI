<template>
  <Story title="TDatePicker" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>

      <div class="p-6 bg-bg min-h-96 max-w-xs">
        <TDatePicker
          v-model="state.value"
          :size="state.size"
          :disabled="state.disabled"
          :clearable="state.clearable"
          :error="state.error"
        />
        <p class="mt-3 text-xs text-ink-muted">Value: {{ state.value ?? 'null' }}</p>
      </div>
    </Variant>

    <Variant title="Date value">
      <div class="p-6 bg-bg min-h-96 max-w-xs">
        <TDatePicker v-model="dateValue" />
        <p class="mt-3 text-xs text-ink-muted">
          Value:
          <span class="font-mono">{{ dateValue ? (dateValue as Date).toISOString() : 'null' }}</span>
        </p>
      </div>
    </Variant>

    <Variant title="Min and max bounds">
      <div class="p-6 bg-bg min-h-96 max-w-xs">
        <TDatePicker v-model="boundedValue" :min="minBound" :max="maxBound" />
        <p class="mt-3 text-xs text-ink-muted">Allowed: {{ minBound }} → {{ maxBound }}</p>
      </div>
    </Variant>

    <Variant title="Disable weekends">
      <div class="p-6 bg-bg min-h-96 max-w-xs">
        <TDatePicker
          v-model="weekdayValue"
          :is-disabled="(d) => d.getDay() === 0 || d.getDay() === 6"
        />
      </div>
    </Variant>

    <Variant title="Custom formatter">
      <div class="p-6 bg-bg min-h-96 max-w-xs">
        <TDatePicker v-model="formattedValue" :format="(d) => d.toISOString().slice(0, 10)" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-xs">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">Start date</label>
          <TDatePicker v-bind="form.getFieldProps('startDate') as unknown as Record<string, unknown>" />
          <p v-if="form.errors.value.startDate" class="text-xs text-danger">
            {{ form.errors.value.startDate }}
          </p>
          <TButton type="submit" label="Submit" />
        </form>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { useForm } from '../../composables/useForm'
import TDatePicker, { type TDatePickerSize } from './TDatePicker.vue'
import TButton from '../TButton.vue'

const today = new Date()
const iso = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const state = reactive<{
  value: string | null
  size: TDatePickerSize
  disabled: boolean
  clearable: boolean
  error: boolean
}>({
  value: iso(today),
  size: 'md',
  disabled: false,
  clearable: true,
  error: false,
})

const dateValue = ref<Date | null>(today)
const boundedValue = ref<string | null>(null)
const weekdayValue = ref<string | null>(null)
const formattedValue = ref<string | null>(iso(today))

const minBound = iso(new Date(today.getFullYear(), today.getMonth(), 1))
const maxBound = iso(new Date(today.getFullYear(), today.getMonth() + 2, 0))

const schema = z.object({
  startDate: z.string().min(1, 'Choose a date'),
})

const form = useForm({
  schema,
  initialValues: { startDate: '' },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
