<template>
  <Story title="TInput" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.type"
          title="Type"
          :options="['text', 'number', 'email', 'password']"
        />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstText v-model="state.prefix" title="Prefix" />
        <HstText v-model="state.suffix" title="Suffix" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.center" title="Center" />
        <HstCheckbox v-model="state.mono" title="Mono" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.fullWidth" title="Full width" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-md">
        <TInput
          v-model="state.value"
          :type="state.type"
          :size="state.size"
          :placeholder="state.placeholder"
          :prefix="state.prefix || undefined"
          :suffix="state.suffix || undefined"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :center="state.center"
          :mono="state.mono"
          :error="state.error"
          :full-width="state.fullWidth"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TInput size="sm" placeholder="Small" />
        <TInput size="md" placeholder="Medium" />
        <TInput size="lg" placeholder="Large" />
      </div>
    </Variant>

    <Variant title="Types">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TInput type="text" placeholder="Text" />
        <TInput type="email" placeholder="email@example.com" />
        <TInput type="password" placeholder="Password" />
        <TInput type="number" placeholder="42" />
      </div>
    </Variant>

    <Variant title="Prefix and suffix">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TInput prefix="$" placeholder="0.00" />
        <TInput suffix="ms" placeholder="250" />
        <TInput prefix="@" suffix=".com" placeholder="handle" />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TInput placeholder="Default" />
        <TInput model-value="Readonly value" readonly />
        <TInput model-value="Disabled value" disabled />
        <TInput placeholder="Error" error />
        <TInput placeholder="Error with message" error="Required" />
      </div>
    </Variant>

    <Variant title="Modifiers">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TInput placeholder="Centered" center model-value="centered" />
        <TInput placeholder="Monospace" mono model-value="const x = 42" />
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-md">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <div>
            <TInput v-bind="form.getFieldProps('email') as unknown as Record<string, unknown>" type="email" placeholder="Email" />
            <p v-if="form.errors.value.email" class="mt-1 text-xs text-danger">
              {{ form.errors.value.email }}
            </p>
          </div>
          <div>
            <TInput v-bind="form.getFieldProps('password') as unknown as Record<string, unknown>" type="password" placeholder="Password" />
            <p v-if="form.errors.value.password" class="mt-1 text-xs text-danger">
              {{ form.errors.value.password }}
            </p>
          </div>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Sign in
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
import TInput, { type TInputType, type TInputSize } from './TInput.vue'

const state = reactive<{
  value: string
  placeholder: string
  type: TInputType
  size: TInputSize
  prefix: string
  suffix: string
  disabled: boolean
  readonly: boolean
  center: boolean
  mono: boolean
  error: boolean
  fullWidth: boolean
}>({
  value: '',
  placeholder: 'Type here…',
  type: 'text',
  size: 'md',
  prefix: '',
  suffix: '',
  disabled: false,
  readonly: false,
  center: false,
  mono: false,
  error: false,
  fullWidth: true,
})

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'At least 8 characters'),
})

const form = useForm({
  schema,
  initialValues: { email: '', password: '' },
  validateOnBlur: true,
})

const submit = form.handleSubmit(() => {})
</script>
