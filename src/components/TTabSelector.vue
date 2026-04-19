<template>
  <div :class="wrapperClasses">
    <button
      v-for="(tab, index) in tabs"
      :key="tab.value"
      type="button"
      :class="buttonClasses(tab, index)"
      @click="emit('update:modelValue', tab.value)"
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
import TIcon from './TIcon.vue'

export interface Tab {
  /** Shown text — styling auto-applies uppercase tracking. */
  label: string
  /** Value written to `v-model` when clicked. */
  value: string
  /** Optional Lucide icon rendered left of the label. */
  icon?: string
  /** Optional count shown after the label in a muted mono style. */
  count?: number
}

const props = withDefaults(
  defineProps<{
    modelValue: string
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
  }>(),
  { separated: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const wrapperClasses = computed(() =>
  props.separated
    ? 'flex flex-wrap items-center gap-2'
    : 'flex items-center border border-line rounded-sm overflow-hidden',
)

const buttonClasses = (tab: Tab, index: number) => {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1.5 font-bold tracking-wider uppercase transition-all'
  const active = props.modelValue === tab.value

  if (props.separated) {
    return [
      base,
      'text-[0.65rem] rounded-sm border',
      active
        ? 'bg-fill-strong border-line-strong text-ink'
        : 'bg-fill-subtle border-line-subtle text-ink-muted hover:bg-fill hover:text-ink',
    ].join(' ')
  }

  // Joined segmented: right-border between buttons, quieter active state.
  return [
    base,
    'text-xs',
    active ? 'bg-fill text-ink' : 'bg-fill-subtle text-ink-muted hover:bg-fill hover:text-ink',
    index < props.tabs.length - 1 ? 'border-r border-line' : '',
  ].join(' ')
}
</script>
