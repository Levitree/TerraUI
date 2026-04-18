<template>
  <Story title="TPinInput" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.length" title="Length" />
        <HstSelect v-model="state.type" title="Type" :options="['text', 'number']" />
        <HstCheckbox v-model="state.otp" title="OTP (autocomplete)" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstText v-model="state.placeholder" title="Placeholder (slot char)" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TPinInput
          v-model="state.value"
          :length="state.length"
          :type="state.type"
          :otp="state.otp"
          :disabled="state.disabled"
          :placeholder="state.placeholder"
          @complete="onComplete"
        />
        <p class="mt-3 text-xs text-ink-muted">Value: "{{ state.value }}"</p>
        <p v-if="lastCompleted" class="text-xs text-success">
          Completed: {{ lastCompleted }}
        </p>
      </div>
    </Variant>

    <Variant title="Digit counts">
      <div class="p-6 bg-bg flex flex-col gap-5">
        <div>
          <p class="text-xs text-ink-muted mb-2">4-digit</p>
          <TPinInput :length="4" type="number" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-2">6-digit (default)</p>
          <TPinInput :length="6" type="number" otp />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-2">8-character alphanumeric</p>
          <TPinInput :length="8" type="text" />
        </div>
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-5">
        <div>
          <p class="text-xs text-ink-muted mb-2">Empty</p>
          <TPinInput :length="6" type="number" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-2">Prefilled</p>
          <TPinInput :length="6" type="number" :model-value="'123456'" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-2">Disabled</p>
          <TPinInput :length="6" type="number" disabled :model-value="'999999'" />
        </div>
      </div>
    </Variant>

    <Variant title="Array v-model">
      <div class="p-6 bg-bg">
        <TPinInput v-model="arrayValue" :length="4" type="number" />
        <pre class="mt-3 text-xs text-ink-muted">{{ arrayValue }}</pre>
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">
            Enter the 6-digit code sent to your device
          </label>
          <TPinInput v-bind="form.getFieldProps('code')" :length="6" type="number" otp />
          <p v-if="form.errors.value.code" class="text-xs text-danger">
            {{ form.errors.value.code }}
          </p>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Verify
          </button>
        </form>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { useForm } from '../../composables/useForm'
import TPinInput from './TPinInput.vue'

const state = reactive<{
  value: string
  length: number
  type: 'text' | 'number'
  otp: boolean
  disabled: boolean
  placeholder: string
}>({
  value: '',
  length: 6,
  type: 'number',
  otp: false,
  disabled: false,
  placeholder: '○',
})

const lastCompleted = ref('')
const onComplete = (value: string) => {
  lastCompleted.value = value
}

const arrayValue = ref<string[]>([])

const schema = z.object({
  code: z.string().length(6, 'Enter all 6 digits').regex(/^\d+$/, 'Digits only'),
})

const form = useForm({
  schema,
  initialValues: { code: '' },
  validateOnChange: true,
})

const submit = form.handleSubmit(() => {})
</script>
