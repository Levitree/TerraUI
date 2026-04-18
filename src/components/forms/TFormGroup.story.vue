<template>
  <Story title="TFormGroup" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.description" title="Description" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.required" title="Required" />
        <HstCheckbox v-model="state.inline" title="Inline" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-md">
        <TFormGroup
          :label="state.label"
          :description="state.description || undefined"
          :hint="state.hint || undefined"
          :error="state.error || undefined"
          :required="state.required"
          :inline="state.inline"
        >
          <TInput v-model="state.value" placeholder="Value" />
        </TFormGroup>
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-5 max-w-md">
        <TFormGroup label="Basic">
          <TInput placeholder="plain" />
        </TFormGroup>
        <TFormGroup label="Required" required>
          <TInput placeholder="required" />
        </TFormGroup>
        <TFormGroup label="With hint" hint="A helpful tip">
          <TInput placeholder="with hint" />
        </TFormGroup>
        <TFormGroup label="With description" description="Some extra context for this field">
          <TInput placeholder="with description" />
        </TFormGroup>
        <TFormGroup label="With error" error="Value is invalid" hint="Hint hidden when erroring">
          <TInput placeholder="error" error />
        </TFormGroup>
      </div>
    </Variant>

    <Variant title="Inline layout">
      <div class="p-6 bg-bg flex flex-col gap-3 max-w-md">
        <TFormGroup label="Email" inline>
          <TInput placeholder="ada@example.com" />
        </TFormGroup>
        <TFormGroup label="Port" inline required>
          <TInput placeholder="443" />
        </TFormGroup>
      </div>
    </Variant>

    <Variant title="Composed layout">
      <div class="p-6 bg-bg max-w-md">
        <div class="grid grid-cols-2 gap-3">
          <TFormGroup label="Host" required>
            <TInput placeholder="localhost" />
          </TFormGroup>
          <TFormGroup label="Port">
            <TInput placeholder="8080" />
          </TFormGroup>
          <TFormGroup label="Username" class="col-span-2">
            <TInput placeholder="admin" />
          </TFormGroup>
          <TFormGroup label="Password" class="col-span-2" hint="Stored securely">
            <TInput type="password" />
          </TFormGroup>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TFormGroup from './TFormGroup.vue'
import TInput from './TInput.vue'

const state = reactive<{
  value: string
  label: string
  description: string
  hint: string
  error: string
  required: boolean
  inline: boolean
}>({
  value: '',
  label: 'Server',
  description: '',
  hint: 'Reachable hostname or IP',
  error: '',
  required: false,
  inline: false,
})
</script>
