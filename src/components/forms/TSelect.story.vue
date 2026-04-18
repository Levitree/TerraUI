<template>
  <Story title="TSelect" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.multiple" title="Multiple" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>

      <div class="p-6 bg-bg min-h-60 max-w-md">
        <TSelect
          v-if="!state.multiple"
          v-model="state.singleValue"
          :options="options"
          :placeholder="state.placeholder"
          :size="state.size"
          :disabled="state.disabled"
          :error="state.error"
        />
        <TSelect
          v-else
          v-model="state.multiValue"
          :options="options"
          :placeholder="state.placeholder"
          :size="state.size"
          :disabled="state.disabled"
          :error="state.error"
          multiple
        />
        <p class="mt-3 text-xs text-ink-muted">
          Value: {{ state.multiple ? state.multiValue : state.singleValue }}
        </p>
      </div>
    </Variant>

    <Variant title="With 6+ options (including disabled)">
      <div class="p-6 bg-bg min-h-60 max-w-md">
        <TSelect :model-value="'ts'" :options="languageOptions" />
      </div>
    </Variant>

    <Variant title="Multiple selection">
      <div class="p-6 bg-bg min-h-60 max-w-md">
        <TSelect
          :model-value="['ts', 'rs']"
          :options="languageOptions"
          multiple
          placeholder="-- Pick languages --"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TSelect :options="languageOptions" size="sm" placeholder="Small" />
        <TSelect :options="languageOptions" size="md" placeholder="Medium" />
        <TSelect :options="languageOptions" size="lg" placeholder="Large" />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TSelect :options="languageOptions" placeholder="Default" />
        <TSelect :model-value="'ts'" :options="languageOptions" disabled />
        <TSelect :options="languageOptions" placeholder="Error" error />
        <TSelect :options="languageOptions" placeholder="Error msg" error="Please choose one" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-md">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">Region</label>
          <TSelect v-bind="form.getFieldProps('region')" :options="regionOptions" />
          <p v-if="form.errors.value.region" class="text-xs text-danger">
            {{ form.errors.value.region }}
          </p>
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
import TSelect, { type TSelectOption, type TSelectSize } from './TSelect.vue'

const options: TSelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

const languageOptions: TSelectOption[] = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'js', label: 'JavaScript' },
  { value: 'rs', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'py', label: 'Python' },
  { value: 'rb', label: 'Ruby', disabled: true },
  { value: 'php', label: 'PHP', disabled: true },
]

const regionOptions: TSelectOption[] = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)', disabled: true },
]

const state = reactive<{
  singleValue: string
  multiValue: string[]
  placeholder: string
  size: TSelectSize
  multiple: boolean
  disabled: boolean
  error: boolean
}>({
  singleValue: '',
  multiValue: [],
  placeholder: '-- Select --',
  size: 'md',
  multiple: false,
  disabled: false,
  error: false,
})

const schema = z.object({
  region: z.string().min(1, 'Pick a region'),
})

const form = useForm({
  schema,
  initialValues: { region: '' },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
