<template>
  <Story title="TUrlInput" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.protocolsCsv" title="Protocols (csv)" />
        <HstText v-model="state.defaultProtocol" title="Default protocol" />
        <HstNumber v-model="state.defaultPort" title="Default port" />
        <HstCheckbox v-model="state.authRequired" title="Auth required" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>

      <div class="p-6 bg-bg min-h-60 max-w-xl">
        <TUrlInput
          v-model="state.value"
          :protocols="protocols"
          :default-protocol="state.defaultProtocol || undefined"
          :default-port="state.defaultPort || undefined"
          :auth-required="state.authRequired"
          :readonly="state.readonly"
          :error="state.error"
        />
        <p class="mt-3 text-xs text-ink-muted break-all">Value: {{ state.value }}</p>
      </div>
    </Variant>

    <Variant title="Single protocol (https only)">
      <div class="p-6 bg-bg max-w-xl">
        <TUrlInput
          :model-value="'https://example.com/path'"
          :protocols="['https']"
          default-protocol="https"
          :default-port="443"
        />
      </div>
    </Variant>

    <Variant title="Multi protocol (http/https)">
      <div class="p-6 bg-bg max-w-xl">
        <TUrlInput
          :model-value="'http://localhost:8080'"
          :protocols="['http', 'https']"
          default-protocol="http"
          :default-port="{ http: 80, https: 443 }"
          :default-path="{ http: '/', https: '/' }"
        />
      </div>
    </Variant>

    <Variant title="Database URL (mysql/postgres) with auth required">
      <div class="p-6 bg-bg max-w-xl">
        <TUrlInput
          :model-value="'postgres://user:pass@db.example.com:5432/app'"
          :protocols="['postgres', 'mysql']"
          default-protocol="postgres"
          :default-port="{ postgres: 5432, mysql: 3306 }"
          auth-required
        />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-col gap-4 max-w-xl">
        <div>
          <p class="text-xs text-ink-muted mb-1">Empty</p>
          <TUrlInput :protocols="['https']" default-protocol="https" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Valid</p>
          <TUrlInput :model-value="'https://example.com'" :protocols="['https']" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Invalid (wrong protocol)</p>
          <TUrlInput :model-value="'ftp://nope.com'" :protocols="['http', 'https']" />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Readonly</p>
          <TUrlInput :model-value="'https://example.com'" :protocols="['https']" readonly />
        </div>
        <div>
          <p class="text-xs text-ink-muted mb-1">Error prop</p>
          <TUrlInput :model-value="'https://example.com'" :protocols="['https']" error />
        </div>
      </div>
    </Variant>

    <Variant title="With validation (zod + useForm)">
      <div class="p-6 bg-bg max-w-xl">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="text-xs uppercase tracking-wider text-ink-muted">Webhook URL</label>
          <TUrlInput
            v-bind="form.getFieldProps('webhook')"
            :protocols="['https']"
            default-protocol="https"
          />
          <p v-if="form.errors.value.webhook" class="text-xs text-danger">
            {{ form.errors.value.webhook }}
          </p>
          <button
            type="submit"
            class="self-start px-3 py-1.5 text-sm bg-fill border border-line rounded-sm text-ink hover:bg-fill-strong"
          >
            Save webhook
          </button>
        </form>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { z } from 'zod'
import { useForm } from '../../composables/useForm'
import TUrlInput from './TUrlInput.vue'

const state = reactive<{
  value: string
  protocolsCsv: string
  defaultProtocol: string
  defaultPort: number
  authRequired: boolean
  readonly: boolean
  error: boolean
}>({
  value: 'https://example.com',
  protocolsCsv: 'http,https',
  defaultProtocol: 'https',
  defaultPort: 443,
  authRequired: false,
  readonly: false,
  error: false,
})

const protocols = computed(() =>
  state.protocolsCsv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)

const schema = z.object({
  webhook: z
    .string()
    .min(1, 'Webhook URL is required')
    .url('Enter a valid URL')
    .refine((v) => v.startsWith('https://'), { message: 'HTTPS only' }),
})

const form = useForm({
  schema,
  initialValues: { webhook: '' },
  validateOnBlur: true,
})

const submit = form.handleSubmit(() => {})
</script>
