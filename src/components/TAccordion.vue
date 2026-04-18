<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(item, idx) in items"
      :key="item.slot"
      class="border border-line-subtle rounded-sm overflow-hidden bg-surface"
    >
      <button
        type="button"
        :disabled="item.disabled"
        :aria-expanded="isOpen(idx)"
        :aria-controls="`accordion-panel-${uid}-${idx}`"
        :class="headerClasses(item)"
        @click="toggle(idx)"
      >
        <TIcon
          name="chevron-right"
          size="sm"
          class="shrink-0 text-ink-muted transition-transform"
          :class="{ 'rotate-90': isOpen(idx) }"
        />
        <TIcon v-if="item.icon" :name="item.icon" size="sm" class="shrink-0 text-ink-muted" />
        <span class="flex-1 text-left text-sm font-bold tracking-wide uppercase text-ink">
          {{ item.label }}
        </span>
        <span
          v-if="item.badge !== undefined"
          class="px-2 py-0.5 text-[0.6rem] font-bold tracking-wider rounded-sm bg-fill text-ink-secondary"
        >
          {{ item.badge }}
        </span>
      </button>
      <div
        v-show="isOpen(idx)"
        :id="`accordion-panel-${uid}-${idx}`"
        class="px-4 py-4 border-t border-line-subtle"
      >
        <slot :name="item.slot" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import TIcon from './TIcon.vue'

export interface TAccordionItem {
  slot: string
  label: string
  icon?: string
  badge?: string | number
  defaultOpen?: boolean
  disabled?: boolean
}

const uid = useId()

const props = withDefaults(
  defineProps<{
    items: TAccordionItem[]
    multiple?: boolean
  }>(),
  { multiple: false },
)

const openIndexes = ref<Set<number>>(
  new Set(props.items.flatMap((item, idx) => (item.defaultOpen ? [idx] : []))),
)

// If not multiple, keep at most one entry from the default-open set.
if (!props.multiple && openIndexes.value.size > 1) {
  const first = [...openIndexes.value][0]
  openIndexes.value = new Set([first])
}

const isOpen = computed(() => (idx: number) => openIndexes.value.has(idx))

const toggle = (idx: number) => {
  const item = props.items[idx]
  if (item.disabled) return

  const next = new Set(openIndexes.value)
  if (next.has(idx)) {
    next.delete(idx)
  } else {
    if (!props.multiple) next.clear()
    next.add(idx)
  }
  openIndexes.value = next
}

const headerClasses = (item: TAccordionItem) => {
  const base = [
    'w-full flex items-center gap-3 px-4 py-3 transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ]
  if (!item.disabled) base.push('hover:bg-fill-subtle cursor-pointer')
  return base.join(' ')
}
</script>
