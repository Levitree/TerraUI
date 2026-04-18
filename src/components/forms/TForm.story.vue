<template>
  <Story title="TForm" group="forms">
    <Variant title="Composed form (valid + invalid side by side)">
      <div class="p-6 bg-bg grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xs uppercase tracking-wider text-ink-muted mb-3">Pristine</h3>
          <TForm :schema="schema" :initial-values="validInitial" @submit="onSubmit">
            <template #default="{ getFieldProps }">
              <TFormField name="name" label="Name" required>
                <TInput v-bind="getFieldProps('name')" placeholder="Ada Lovelace" />
              </TFormField>
              <TFormField name="email" label="Email" required>
                <TInput v-bind="getFieldProps('email')" type="email" placeholder="ada@example.com" />
              </TFormField>
              <TFormField name="role" label="Role">
                <TSelect v-bind="getFieldProps('role')" :options="roleOptions" />
              </TFormField>
              <TFormField name="bio" label="Bio" hint="Max 200 chars">
                <TTextarea v-bind="getFieldProps('bio')" :rows="3" />
              </TFormField>
            </template>
            <template #actions="{ isSubmitting, hasErrors }">
              <button
                type="submit"
                :disabled="isSubmitting || hasErrors"
                class="px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong disabled:opacity-50"
              >
                Submit
              </button>
            </template>
          </TForm>
        </div>

        <div>
          <h3 class="text-xs uppercase tracking-wider text-ink-muted mb-3">With errors</h3>
          <TForm :schema="schema" :initial-values="invalidInitial" @submit="onSubmit">
            <template #default="{ getFieldProps }">
              <TFormField name="name" label="Name" required>
                <TInput v-bind="getFieldProps('name')" placeholder="Ada Lovelace" />
              </TFormField>
              <TFormField name="email" label="Email" required>
                <TInput v-bind="getFieldProps('email')" type="email" />
              </TFormField>
              <TFormField name="role" label="Role">
                <TSelect v-bind="getFieldProps('role')" :options="roleOptions" />
              </TFormField>
              <TFormField name="bio" label="Bio">
                <TTextarea v-bind="getFieldProps('bio')" :rows="3" />
              </TFormField>
            </template>
            <template #actions>
              <button
                type="submit"
                class="px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
              >
                Submit (will show errors)
              </button>
            </template>
          </TForm>
        </div>
      </div>
    </Variant>

    <Variant title="Inline inputs (getFieldProps)">
      <div class="p-6 bg-bg max-w-md">
        <TForm :schema="schema" :initial-values="validInitial" @submit="onSubmit">
          <template #default="{ getFieldProps, values, errors }">
            <div class="flex flex-col gap-3">
              <TInput v-bind="getFieldProps('name')" placeholder="Name" />
              <TInput v-bind="getFieldProps('email')" type="email" placeholder="Email" />
              <TSelect v-bind="getFieldProps('role')" :options="roleOptions" />
              <pre class="text-xs text-ink-muted">values: {{ JSON.stringify(values) }}</pre>
              <pre class="text-xs text-danger">errors: {{ JSON.stringify(errors) }}</pre>
            </div>
          </template>
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

    <Variant title="validateOnChange">
      <div class="p-6 bg-bg max-w-md">
        <TForm :schema="schema" :initial-values="invalidInitial" validate-on-change @submit="onSubmit">
          <template #default="{ getFieldProps }">
            <TFormField name="name" label="Name" required>
              <TInput v-bind="getFieldProps('name')" />
            </TFormField>
            <TFormField name="email" label="Email" required>
              <TInput v-bind="getFieldProps('email')" type="email" />
            </TFormField>
          </template>
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
  </Story>
</template>

<script setup lang="ts">
import { z } from 'zod'
import TForm from './TForm.vue'
import TFormField from './TFormField.vue'
import TInput from './TInput.vue'
import TSelect from './TSelect.vue'
import TTextarea from './TTextarea.vue'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 chars'),
  email: z.string().email('Enter a valid email'),
  role: z.string().min(1, 'Pick a role'),
  bio: z.string().max(200, 'Max 200 characters').optional().default(''),
})

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const validInitial = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  role: 'editor',
  bio: '',
}

const invalidInitial = {
  name: 'A',
  email: 'not-an-email',
  role: '',
  bio: '',
}

const onSubmit = (data: Record<string, unknown>) => {
  console.log('submit', data)
}
</script>
