<template>
  <Story title="TTextarea" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstNumber v-model="state.rows" title="Rows" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstSelect
          v-model="state.resize"
          title="Resize"
          :options="['none', 'vertical', 'horizontal', 'both']"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.mono" title="Mono" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-xl">
        <TTextarea
          v-model="state.value"
          :placeholder="state.placeholder"
          :rows="state.rows"
          :size="state.size"
          :resize="state.resize"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :mono="state.mono"
          :error="state.error"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-xl">
        <TTextarea size="sm" placeholder="Small" />
        <TTextarea size="md" placeholder="Medium" />
        <TTextarea size="lg" placeholder="Large" />
      </div>
    </Variant>

    <Variant title="Resize options">
      <div class="p-6 bg-bg grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
        <TTextarea resize="none" placeholder="none (default)" />
        <TTextarea resize="vertical" placeholder="vertical" />
        <TTextarea resize="horizontal" placeholder="horizontal" />
        <TTextarea resize="both" placeholder="both" />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-xl">
        <TTextarea placeholder="Default" />
        <TTextarea model-value="Readonly content" readonly />
        <TTextarea model-value="Disabled content" disabled />
        <TTextarea placeholder="Error" error />
        <TTextarea placeholder="Error with message" error="Description is required" />
        <TTextarea mono model-value="const greeting = 'hello'" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-xl">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">Bio</label>
          <TTextarea v-bind="form.getFieldProps('bio')" :rows="4" placeholder="Tell us about yourself" />
          <p v-if="form.errors.value.bio" class="text-xs text-danger">
            {{ form.errors.value.bio }}
          </p>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Save
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
import TTextarea, { type TTextareaSize, type TTextareaResize } from './TTextarea.vue'

const state = reactive<{
  value: string
  placeholder: string
  rows: number
  size: TTextareaSize
  resize: TTextareaResize
  disabled: boolean
  readonly: boolean
  mono: boolean
  error: boolean
}>({
  value: '',
  placeholder: 'Write something…',
  rows: 3,
  size: 'md',
  resize: 'none',
  disabled: false,
  readonly: false,
  mono: false,
  error: false,
})

const schema = z.object({
  bio: z.string().min(10, 'At least 10 characters').max(200, 'Max 200 characters'),
})

const form = useForm({
  schema,
  initialValues: { bio: '' },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
