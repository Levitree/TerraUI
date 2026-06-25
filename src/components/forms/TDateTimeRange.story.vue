<template>
  <Story title="TDateTimeRange" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.allowCustom" title="Allow custom" />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.live" title="Live (track now)" />
        <HstNumber v-model="state.minuteStep" title="Minute step" />
      </template>

      <div class="p-6 bg-bg min-h-112 max-w-sm">
        <TDateTimeRange
          v-model="state.value"
          v-model:preset="state.preset"
          :size="state.size"
          :allow-custom="state.allowCustom"
          :clearable="state.clearable"
          :disabled="state.disabled"
          :error="state.error"
          :live="state.live"
          :minute-step="state.minuteStep"
        />
        <dl class="mt-4 space-y-1 text-xs text-ink-muted">
          <div><span class="text-ink-secondary">preset:</span> {{ state.preset ?? 'null' }}</div>
          <div class="font-mono break-all">
            <span class="font-sans text-ink-secondary">value:</span> {{ display(state.value) }}
          </div>
        </dl>
      </div>
    </Variant>

    <Variant title="Presets only">
      <div class="p-6 bg-bg min-h-112 max-w-sm">
        <TDateTimeRange v-model="presetsOnly" v-model:preset="presetsOnlyId" :allow-custom="false" />
        <p class="mt-3 text-xs text-ink-muted">Active preset: {{ presetsOnlyId ?? 'null' }}</p>
      </div>
    </Variant>

    <Variant title="Custom range (click ‘Custom range’)">
      <div class="p-6 bg-bg min-h-112 max-w-sm">
        <TDateTimeRange v-model="customValue" v-model:preset="customPreset" />
        <p class="mt-3 text-xs text-ink-muted">
          Opens one calendar in a booking-style From → To flow: pick the start, it
          advances to the end (with a live range preview), click ‘From’ to go back.
        </p>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg min-h-112 max-w-sm flex flex-col gap-4">
        <TDateTimeRange v-model="sizeSm" size="sm" />
        <TDateTimeRange v-model="sizeMd" size="md" />
        <TDateTimeRange v-model="sizeLg" size="lg" />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg min-h-112 max-w-sm flex flex-col gap-4">
        <TDateTimeRange v-model="empty" placeholder="No range yet" />
        <TDateTimeRange v-model="preselected" v-model:preset="preselectedId" />
        <TDateTimeRange v-model="errored" error="Pick a time range" />
        <TDateTimeRange v-model="disabledVal" disabled />
      </div>
    </Variant>

    <Variant title="Dual v-model">
      <div class="p-6 bg-bg min-h-112 max-w-sm">
        <TDateTimeRange v-model="dualValue" v-model:preset="dualPreset" live />
        <div class="mt-4 rounded-sm border border-line bg-surface p-3 text-xs">
          <p class="text-ink-secondary">
            Backends send the absolute pair; the preset preserves intent.
          </p>
          <p class="mt-2 font-mono break-all text-ink-muted">preset = {{ dualPreset ?? 'null' }}</p>
          <p class="font-mono break-all text-ink-muted">startISO = {{ iso(dualValue?.start) }}</p>
          <p class="font-mono break-all text-ink-muted">endISO = {{ iso(dualValue?.end) }}</p>
        </div>
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg min-h-112 max-w-sm">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">Reporting window</label>
          <TDateTimeRange
            v-bind="form.getFieldProps('range') as unknown as Record<string, unknown>"
          />
          <p v-if="form.errors.value.range" class="text-xs text-danger">
            {{ form.errors.value.range }}
          </p>
          <TButton type="submit" label="Submit" />
          <p v-if="submitted" class="text-xs text-success">Submitted ✓</p>
        </form>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { useForm } from '../../composables/useForm'
import TDateTimeRange, {
  type TDateTimeRangeSize,
  type TDateTimeRangeValue,
} from './TDateTimeRange.vue'
import TButton from '../TButton.vue'

const iso = (v: Date | string | null | undefined) =>
  v == null ? 'null' : v instanceof Date ? v.toISOString() : v

const display = (v: TDateTimeRangeValue | null) =>
  v == null ? 'null' : `{ start: ${iso(v.start)}, end: ${iso(v.end)} }`

const state = reactive<{
  value: TDateTimeRangeValue | null
  preset: string | null
  size: TDateTimeRangeSize
  allowCustom: boolean
  clearable: boolean
  disabled: boolean
  error: boolean
  live: boolean
  minuteStep: number
}>({
  value: null,
  preset: null,
  size: 'md',
  allowCustom: true,
  clearable: true,
  disabled: false,
  error: false,
  live: false,
  minuteStep: 1,
})

const presetsOnly = ref<TDateTimeRangeValue | null>(null)
const presetsOnlyId = ref<string | null>(null)

const customValue = ref<TDateTimeRangeValue | null>(null)
const customPreset = ref<string | null>(null)

const sizeSm = ref<TDateTimeRangeValue | null>(null)
const sizeMd = ref<TDateTimeRangeValue | null>(null)
const sizeLg = ref<TDateTimeRangeValue | null>(null)

const now = new Date()
const empty = ref<TDateTimeRangeValue | null>(null)
const preselected = ref<TDateTimeRangeValue | null>({
  start: new Date(now.getTime() - 24 * 60 * 60_000),
  end: now,
})
const preselectedId = ref<string | null>('24h')
const errored = ref<TDateTimeRangeValue | null>(null)
const disabledVal = ref<TDateTimeRangeValue | null>({
  start: new Date(now.getTime() - 7 * 24 * 60 * 60_000),
  end: now,
})

const dualValue = ref<TDateTimeRangeValue | null>(null)
const dualPreset = ref<string | null>(null)

const schema = z.object({
  range: z
    .object({
      start: z.union([z.date(), z.string()]).nullable(),
      end: z.union([z.date(), z.string()]).nullable(),
    })
    .refine((r) => !!r.start && !!r.end, { message: 'Pick a start and end' })
    .refine((r) => !r.start || !r.end || new Date(r.start) <= new Date(r.end), {
      message: 'End must be after start',
    }),
})

const form = useForm({
  schema,
  initialValues: { range: { start: null, end: null } },
  validateOnChange: true,
})

const submitted = ref(false)
const submit = form.handleSubmit(() => {
  submitted.value = true
})
</script>
