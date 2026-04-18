<template>
  <Story title="TFileInput" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.accept" title="Accept (MIME/extensions)" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.fullWidth" title="Full width" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TFileInput
          v-model="state.file"
          :placeholder="state.placeholder"
          :accept="state.accept || undefined"
          :disabled="state.disabled"
          :error="state.error"
          :full-width="state.fullWidth"
        />
        <p v-if="state.file" class="mt-2 text-xs text-ink-muted">
          Selected: {{ state.file.name }} ({{ state.file.size }} bytes)
        </p>
      </div>
    </Variant>

    <Variant title="Accept filters">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <div>
          <p class="text-xs text-ink-muted mb-1">Images only</p>
          <TFileInput accept="image/*" placeholder="Choose an image" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">PDF documents</p>
          <TFileInput accept="application/pdf,.pdf" placeholder="Choose a PDF" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">CSV or JSON</p>
          <TFileInput accept=".csv,application/json" placeholder="Choose data file" />
        </div>
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TFileInput placeholder="Default" />
        <TFileInput placeholder="Disabled" disabled />
        <TFileInput placeholder="Error state" error />
        <TFileInput placeholder="Error with message" error="File is required" />
      </div>
    </Variant>

    <Variant title="Width">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TFileInput placeholder="Full width (default)" />
        <div class="w-64">
          <TFileInput placeholder="Constrained width" :full-width="false" />
        </div>
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg">
        <form class="flex flex-col gap-2" @submit.prevent="submit">
          <TFileInput v-bind="form.getFieldProps('avatar') as unknown as Record<string, unknown>" accept="image/*" />
          <p v-if="form.errors.value.avatar" class="text-xs text-danger">
            {{ form.errors.value.avatar }}
          </p>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Upload
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
import TFileInput from './TFileInput.vue'

const state = reactive<{
  file: File | null
  placeholder: string
  accept: string
  disabled: boolean
  error: boolean
  fullWidth: boolean
}>({
  file: null,
  placeholder: 'Choose file…',
  accept: '',
  disabled: false,
  error: false,
  fullWidth: true,
})

const schema = z.object({
  avatar: z
    .instanceof(File, { message: 'Please choose an image' })
    .refine((f) => f.type.startsWith('image/'), { message: 'Must be an image' }),
})

const form = useForm({
  schema,
  initialValues: { avatar: null as unknown as File },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
