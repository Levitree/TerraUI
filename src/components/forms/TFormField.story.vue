<template>
  <Story title="TFormField" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.description" title="Description" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error (override)" />
        <HstCheckbox v-model="state.required" title="Required" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-md">
        <TFormField
          :label="state.label"
          :description="state.description || undefined"
          :hint="state.hint || undefined"
          :error="state.error || undefined"
          :required="state.required"
          :size="state.size"
        >
          <TInput v-model="state.value" placeholder="Type here…" />
        </TFormField>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-4 max-w-md">
        <TFormField label="Small field" hint="Compact" size="sm">
          <TInput size="sm" placeholder="sm" />
        </TFormField>
        <TFormField label="Medium field" hint="Default" size="md">
          <TInput size="md" placeholder="md" />
        </TFormField>
        <TFormField label="Large field" hint="Roomy" size="lg">
          <TInput size="lg" placeholder="lg" />
        </TFormField>
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-4 max-w-md">
        <TFormField label="With hint" hint="This appears below">
          <TInput placeholder="ok" />
        </TFormField>
        <TFormField label="With description" description="A longer description before the input">
          <TInput placeholder="ok" />
        </TFormField>
        <TFormField label="Required" required>
          <TInput placeholder="required" />
        </TFormField>
        <TFormField
          label="With error (overrides hint)"
          hint="This hint is hidden"
          error="Something went wrong"
        >
          <TInput placeholder="error" error />
        </TFormField>
      </div>
    </Variant>

    <Variant title="Context injection (with TForm)">
      <div class="p-6 bg-bg max-w-md">
        <p class="text-xs text-ink-muted mb-3">
          Inside TForm, children can be terse — inputs inject value/error/onBlur from the field.
        </p>
        <TForm :schema="schema" :initial-values="{ name: '', email: 'bad' }">
          <TFormField name="name" label="Name" required>
            <TInput placeholder="Ada" />
          </TFormField>
          <TFormField name="email" label="Email" required hint="We never share it">
            <TInput type="email" placeholder="ada@example.com" />
          </TFormField>
          <template #actions>
            <button
              type="submit"
              class="px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
            >
              Submit
            </button>
          </template>
        </TForm>
      </div>
    </Variant>

    <Variant title="Inline (label on same row)">
      <div class="p-6 bg-bg max-w-md flex flex-col gap-3">
        <TFormField label="Host" inline>
          <TInput placeholder="example.com" />
        </TFormField>
        <TFormField label="Port" inline hint="Usually 443">
          <TInput placeholder="443" />
        </TFormField>
        <TFormField label="TLS" inline error="Required" required>
          <TInput placeholder="cert.pem" error />
        </TFormField>
      </div>
    </Variant>

    <Variant title="Slots">
      <div class="p-6 bg-bg max-w-md flex flex-col gap-4">
        <TFormField>
          <template #label>Custom <em class="text-success">label</em> slot</template>
          <template #description>Supports rich <strong>content</strong></template>
          <TInput placeholder="Slotted" />
          <template #hint>Hint via slot</template>
        </TFormField>

        <TFormField label="Error slot" error="oops">
          <TInput placeholder="broken" error />
          <template #error="{ error }">
            <span class="flex items-center gap-1">
              <span aria-hidden="true">⚠</span>
              {{ error }}
            </span>
          </template>
        </TFormField>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import TFormField from './TFormField.vue'
import TForm from './TForm.vue'
import TInput from './TInput.vue'

const state = reactive<{
  value: string
  label: string
  description: string
  hint: string
  error: string
  required: boolean
  size: 'sm' | 'md' | 'lg'
}>({
  value: '',
  label: 'Username',
  description: '',
  hint: 'Letters and numbers only',
  error: '',
  required: false,
  size: 'md',
})

const schema = z.object({
  name: z.string().min(2, 'Must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})
</script>
