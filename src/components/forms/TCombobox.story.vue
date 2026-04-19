<template>
  <Story title="TCombobox" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.multiple" title="Multiple" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>

      <div class="p-6 bg-bg min-h-96 max-w-md">
        <TCombobox
          v-if="!state.multiple"
          v-model="state.singleValue"
          :options="countries"
          :placeholder="state.placeholder"
          :size="state.size"
          :disabled="state.disabled"
          :error="state.error"
        />
        <TCombobox
          v-else
          v-model="state.multiValue"
          :options="countries"
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

    <Variant title="Single select with icons">
      <div class="p-6 bg-bg min-h-96 max-w-md">
        <TCombobox :model-value="'next'" :options="frameworks" placeholder="Pick a framework" />
      </div>
    </Variant>

    <Variant title="Multiple with chips">
      <div class="p-6 bg-bg min-h-96 max-w-md">
        <TCombobox
          :model-value="['next', 'nuxt']"
          :options="frameworks"
          multiple
          placeholder="Pick frameworks"
        />
      </div>
    </Variant>

    <Variant title="Custom filter (prefix only)">
      <div class="p-6 bg-bg min-h-96 max-w-md">
        <TCombobox
          :options="countries"
          :filter="(o, q) => !q || o.label.toLowerCase().startsWith(q.toLowerCase())"
          placeholder="Starts-with search"
        />
      </div>
    </Variant>

    <Variant title="With footer action">
      <div class="p-6 bg-bg min-h-96 max-w-md">
        <TCombobox v-model="withFooterValue" :options="tags" multiple placeholder="Add tags">
          <template #footer="{ query, close }">
            <button
              class="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-ink hover:bg-fill rounded-sm cursor-pointer"
              @click="close"
            >
              <span class="text-ink-muted">Create</span>
              <span class="font-bold">{{ query || 'new tag' }}</span>
            </button>
          </template>
        </TCombobox>
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-md">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">Country</label>
          <TCombobox
            v-bind="form.getFieldProps('country') as unknown as Record<string, unknown>"
            :options="countries"
            placeholder="Search countries…"
          />
          <p v-if="form.errors.value.country" class="text-xs text-danger">
            {{ form.errors.value.country }}
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
import TCombobox, { type TComboboxOption, type TComboboxSize } from './TCombobox.vue'
import TButton from '../TButton.vue'

const countries: TComboboxOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'br', label: 'Brazil' },
  { value: 'ar', label: 'Argentina' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'cn', label: 'China' },
  { value: 'au', label: 'Australia', disabled: true },
]

const frameworks: TComboboxOption[] = [
  { value: 'next', label: 'Next.js', icon: 'flame' },
  { value: 'nuxt', label: 'Nuxt', icon: 'mountain' },
  { value: 'remix', label: 'Remix', icon: 'music' },
  { value: 'astro', label: 'Astro', icon: 'rocket' },
  { value: 'svelte', label: 'SvelteKit', icon: 'zap' },
]

const tags: TComboboxOption[] = [
  { value: 'infra', label: 'Infrastructure' },
  { value: 'api', label: 'API' },
  { value: 'ux', label: 'UX' },
  { value: 'perf', label: 'Performance' },
]

const state = reactive<{
  singleValue: string
  multiValue: string[]
  placeholder: string
  size: TComboboxSize
  multiple: boolean
  disabled: boolean
  error: boolean
}>({
  singleValue: '',
  multiValue: [],
  placeholder: 'Pick a country',
  size: 'md',
  multiple: false,
  disabled: false,
  error: false,
})

const withFooterValue = ref<string[]>(['infra'])

const schema = z.object({
  country: z.string().min(1, 'Pick a country'),
})

const form = useForm({
  schema,
  initialValues: { country: '' },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
