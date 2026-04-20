<template>
  <div class="space-y-1.5">
    <TInput
      :modelValue="urlText"
      mono
      :placeholder="urlPlaceholder"
      :readonly="readonly"
      :error="!!resolvedError || !!validationError"
      full-width
      @update:modelValue="onUrlTextChange($event as string)"
    />
    <div v-if="validationError" class="text-xs text-danger">
      {{ validationError }}
    </div>
    <button
      type="button"
      :disabled="readonly"
      class="inline-flex items-center gap-1.5 text-[0.65rem] tracking-wider uppercase font-medium text-ink-muted hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      @click="openManualModal"
    >
      <TIcon name="sliders-horizontal" size="xs" />
      Enter manually
    </button>
  </div>

  <TModal v-model:open="isManualOpen" title="URL Details" size="md">
    <div class="space-y-4">
      <TFormField v-if="protocols.length > 1" label="Protocol" required>
        <TSelect
          :modelValue="manual.protocol"
          :options="protocolOptions"
          @update:modelValue="manual.protocol = $event as string"
        />
      </TFormField>

      <TFormField label="Host" required :error="manualHostError">
        <TInput v-model="manual.host" mono placeholder="192.168.1.50" full-width />
      </TFormField>

      <div class="grid grid-cols-2 gap-3">
        <TFormField label="Port">
          <TInput v-model="manual.port" mono :placeholder="portPlaceholder" full-width />
        </TFormField>
        <TFormField label="Path">
          <TInput v-model="manual.path" mono :placeholder="pathPlaceholder" full-width />
        </TFormField>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <TFormField :label="authRequired ? 'Username *' : 'Username'">
          <TInput v-model="manual.username" placeholder="admin" full-width />
        </TFormField>
        <TFormField :label="authRequired ? 'Password *' : 'Password'">
          <TInput
            v-model="manual.password"
            type="password"
            :placeholder="passwordPlaceholder"
            full-width
          />
        </TFormField>
      </div>

      <p class="text-[0.65rem] text-ink-subtle">
        Special characters in credentials are URL-encoded automatically.
      </p>
    </div>

    <template #footer>
      <TButton color="ghost" class="flex-1" label="Cancel" @click="isManualOpen = false" />
      <TButton
        color="success"
        class="flex-1"
        label="Apply"
        :disabled="!manual.host.trim()"
        @click="applyManual"
      />
    </template>
  </TModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, provide, watch } from 'vue'
import TInput from './TInput.vue'
import TSelect, { type TSelectOption } from './TSelect.vue'
import TFormField from './TFormField.vue'
import TModal from '../TModal.vue'
import TButton from '../TButton.vue'
import TIcon from '../TIcon.vue'
import { useFormField } from '../../composables/useFormField'
import { FIELD_CONTEXT_KEY, type TFieldContext } from './types'

export interface UrlValue {
  protocol: string
  host: string
  port?: number
  path?: string
  username?: string
  password?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | UrlValue | null
    protocols: string[]
    defaultProtocol?: string
    defaultPort?: number | Record<string, number>
    defaultPath?: string | Record<string, string>
    authRequired?: boolean
    readonly?: boolean
    error?: boolean | string
  }>(),
  {
    authRequired: false,
    readonly: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function resolveForProtocol<T extends number | string>(
  value: T | Record<string, T> | undefined,
  proto: string,
): T | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'object') return value[proto]
  return value
}

function urlValueToString(v: UrlValue): string {
  const userInfo =
    v.username || v.password
      ? `${encodeURIComponent(v.username ?? '')}${
          v.password ? `:${encodeURIComponent(v.password)}` : ''
        }@`
      : ''
  const portPart = v.port != null ? `:${v.port}` : ''
  const pathPart = v.path ?? ''
  return `${v.protocol}://${userInfo}${v.host}${portPart}${pathPart}`
}

const field = useFormField<string | UrlValue | null>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => {
    const str =
      typeof value === 'string' ? value : value == null ? '' : urlValueToString(value)
    emit('update:modelValue', str)
  },
})

// Neutralize the field context for descendant TInput/TSelect/TFormField so
// TUrlInput is the sole owner of the outer field binding. Inner inputs work
// off their own v-model props/refs.
const neutralField: TFieldContext = {
  name: '',
  value: computed(() => undefined),
  setValue: () => {},
  error: computed(() => undefined),
  onBlur: () => {},
  inputId: '',
}
provide(FIELD_CONTEXT_KEY, neutralField)

const resolvedError = computed(() => field.error.value)

const urlText = computed<string>(() => {
  const v = field.modelValue.value
  if (v == null || v === '') return ''
  if (typeof v === 'string') return v
  return urlValueToString(v)
})

function onUrlTextChange(next: string) {
  field.setValue(next)
}

// === Validation ===

const protocolHint = computed(() => {
  if (props.protocols.length === 0) return 'Invalid URL'
  const options = props.protocols.map((p) => `${p}://`).join(' or ')
  return `Must start with ${options}`
})

const urlPlaceholder = computed(() => {
  const proto = props.defaultProtocol ?? props.protocols[0] ?? 'https'
  const port = resolveForProtocol(props.defaultPort, proto)
  const path = resolveForProtocol(props.defaultPath, proto)
  const portPart = port !== undefined ? `:${port}` : ''
  const pathPart = path ?? ''
  return `${proto}://host${portPart}${pathPart}`
})

const validationError = computed<string>(() => {
  const v = urlText.value.trim()
  if (!v) return ''
  const schemeMatch = /^([a-z][a-z0-9+.-]*):\/\//i.exec(v)
  if (!schemeMatch) return protocolHint.value
  const scheme = schemeMatch[1].toLowerCase()
  if (props.protocols.length > 0 && !props.protocols.includes(scheme)) {
    return protocolHint.value
  }
  try {
    const u = new URL(v)
    if (!u.hostname) return 'Invalid URL'
    return ''
  } catch {
    return 'Invalid URL'
  }
})

// === Manual modal ===

interface ManualFields {
  protocol: string
  host: string
  port: string
  path: string
  username: string
  password: string
}

const isManualOpen = ref(false)
const manual = reactive<ManualFields>({
  protocol: '',
  host: '',
  port: '',
  path: '',
  username: '',
  password: '',
})
let manualPristinePassword: string | undefined
let manualPasswordWasStored = false

const protocolOptions = computed<TSelectOption[]>(() =>
  props.protocols.map((p) => ({ value: p, label: p })),
)

const portPlaceholder = computed(() => {
  const port = resolveForProtocol(props.defaultPort, manual.protocol)
  return port !== undefined ? String(port) : ''
})

const pathPlaceholder = computed(() => {
  const path = resolveForProtocol(props.defaultPath, manual.protocol)
  return path ?? '/'
})

const passwordPlaceholder = computed(() =>
  manualPasswordWasStored && manual.password === '' ? '••••••••' : '',
)

const manualHostError = computed(() =>
  isManualOpen.value && manual.host.trim() === '' ? '' : undefined,
)

function parseUrlString(raw: string): Partial<UrlValue> {
  if (!raw) return {}
  const fallbackProto = props.defaultProtocol ?? props.protocols[0] ?? ''
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
  const withScheme = hasScheme ? raw : `${fallbackProto}://${raw}`
  try {
    const u = new URL(withScheme)
    const out: Partial<UrlValue> = {
      protocol: u.protocol.replace(/:$/, ''),
      host: u.hostname,
    }
    if (u.port) out.port = Number(u.port)
    if (u.pathname && u.pathname !== '/') out.path = u.pathname + (u.search ?? '')
    if (u.username) out.username = decodeURIComponent(u.username)
    if (u.password) out.password = decodeURIComponent(u.password)
    return out
  } catch {
    return {}
  }
}

function openManualModal() {
  if (props.readonly) return
  const source = field.modelValue.value
  const parsed =
    typeof source === 'object' && source !== null
      ? (source as Partial<UrlValue>)
      : parseUrlString(urlText.value)

  manual.protocol = parsed.protocol ?? props.defaultProtocol ?? props.protocols[0] ?? ''
  manual.host = parsed.host ?? ''
  manual.port = parsed.port != null ? String(parsed.port) : ''
  manual.path = parsed.path ?? ''
  manual.username = parsed.username ?? ''
  manual.password = ''
  manualPristinePassword = parsed.password
  manualPasswordWasStored = !!parsed.password
  isManualOpen.value = true
}

function composeFromManual(): string {
  const proto = manual.protocol || props.defaultProtocol || props.protocols[0] || ''
  const host = manual.host.trim()
  if (!host) return ''

  const portStr = manual.port.trim()
  const portNum = portStr ? Number(portStr) : NaN
  const portPart = Number.isFinite(portNum) && portNum > 0 ? `:${portNum}` : ''

  let pathPart = manual.path.trim()
  if (pathPart && !pathPart.startsWith('/')) pathPart = `/${pathPart}`

  const effectivePassword =
    manual.password !== ''
      ? manual.password
      : manualPasswordWasStored
        ? (manualPristinePassword ?? '')
        : ''

  const user = manual.username
  let userInfo = ''
  if (user || effectivePassword) {
    userInfo = `${encodeURIComponent(user)}${
      effectivePassword ? `:${encodeURIComponent(effectivePassword)}` : ''
    }@`
  }

  return `${proto}://${userInfo}${host}${portPart}${pathPart}`
}

function applyManual() {
  if (!manual.host.trim()) return
  const composed = composeFromManual()
  field.setValue(composed)
  isManualOpen.value = false
}

// Close the manual modal if the field becomes readonly mid-flight.
watch(
  () => props.readonly,
  (ro) => {
    if (ro) isManualOpen.value = false
  },
)
</script>
