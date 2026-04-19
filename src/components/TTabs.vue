<template>
  <div :class="wrapperClasses">
    <button
      v-for="(tab, index) in tabs"
      :key="keyFor(tab, index)"
      type="button"
      :class="buttonClasses(tab, index)"
      @click="handleClick(tab)"
    >
      <TIcon v-if="tab.icon" :name="tab.icon" size="xs" />
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.count !== undefined"
        class="text-ink-subtle ml-0.5 font-mono text-[0.6rem] normal-case"
      >
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TIcon from './TIcon.vue'

export interface Tab {
  /** Shown text — styling auto-applies uppercase tracking. */
  label: string
  /** Value written to `v-model` when clicked. Required for v-model-driven tabs. */
  value?: string
  /** Optional Lucide icon rendered left of the label. */
  icon?: string
  /** Optional count shown after the label in a muted mono style. */
  count?: number
  /** Route path to navigate to on click. Active state matches `route.path`. */
  to?: string
  /** Callback invoked on click. Takes precedence over `to` and `value`. */
  action?: () => void
}

const props = withDefaults(
  defineProps<{
    /** Current value for v-model-driven tabs. Ignored for `to`/`action` tabs. */
    modelValue?: string
    tabs: Tab[]
    /**
     * Visual density.
     * - `false` (default): joined segmented control — single outer border,
     *   no gap between buttons, quiet active state. Reads as "swap view."
     * - `true`: loose pill row — each button is independently bordered and
     *   rounded with a gap between them, louder active state. Reads as
     *   "filter this list."
     */
    separated?: boolean
    /**
     * Optional transform applied to a tab's `to` before navigating and
     * matching against the active route. Lets the host app namespace paths
     * (e.g. prefix with a device UUID) without TerraUI knowing about routing.
     */
    pathBuilder?: (to: string) => string
  }>(),
  { separated: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const router = useRouter()
const route = useRoute()

const resolveTo = (to: string) => (props.pathBuilder ? props.pathBuilder(to) : to)

const isActive = (tab: Tab) => {
  if (tab.to) return route.path === resolveTo(tab.to)
  if (tab.value !== undefined) return props.modelValue === tab.value
  return false
}

const handleClick = (tab: Tab) => {
  if (tab.action) {
    tab.action()
    return
  }
  if (tab.to) {
    router.push(resolveTo(tab.to))
    return
  }
  if (tab.value !== undefined) {
    emit('update:modelValue', tab.value)
  }
}

const keyFor = (tab: Tab, index: number) => tab.value ?? tab.to ?? `${tab.label}-${index}`

const wrapperClasses = computed(() =>
  props.separated
    ? 'flex flex-wrap items-center gap-2'
    : 'flex items-center border border-line rounded-sm overflow-hidden',
)

const buttonClasses = (tab: Tab, index: number) => {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1.5 font-bold tracking-wider uppercase transition-all'
  const active = isActive(tab)

  if (props.separated) {
    return [
      base,
      'text-[0.65rem] rounded-sm border',
      active
        ? 'bg-fill-strong border-line-strong text-ink'
        : 'bg-fill-subtle border-line-subtle text-ink-muted hover:bg-fill hover:text-ink',
    ].join(' ')
  }

  return [
    base,
    'text-xs',
    active ? 'bg-fill text-ink' : 'bg-fill-subtle text-ink-muted hover:bg-fill hover:text-ink',
    index < props.tabs.length - 1 ? 'border-r border-line' : '',
  ].join(' ')
}
</script>
