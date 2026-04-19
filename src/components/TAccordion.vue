<template>
  <div :class="wrapperClasses">
    <div v-for="(item, idx) in items" :key="item.slot" :class="panelClasses">
      <!-- Optional header overlay — sits behind the header content, used for
           edit-mode chrome, drag handles, etc. Same pattern as the original
           TCollapsibleSection. -->
      <slot :name="`${item.slot}-header-overlay`" :item="item" />

      <div class="flex items-center gap-3">
        <button
          type="button"
          :disabled="item.disabled"
          :aria-expanded="isOpen(idx)"
          :aria-controls="`accordion-panel-${uid}-${idx}`"
          :class="headerClasses(item)"
          @click="toggle(idx)"
        >
          <!-- Left-side indicator: status dot when `status` is set,
               otherwise a rotating chevron. -->
          <TStatusIndicator
            v-if="item.status"
            :status="item.status"
            :pulse="item.status === 'success'"
            class="shrink-0"
          />
          <TIcon
            v-else
            name="chevron-right"
            size="sm"
            class="shrink-0 text-ink-muted transition-transform"
            :class="{ 'rotate-90': isOpen(idx) }"
          />

          <TIcon v-if="item.icon" :name="item.icon" size="sm" class="shrink-0 text-ink-muted" />

          <div class="flex flex-col gap-0.5 text-left">
            <div class="flex items-center gap-2">
              <span :class="titleClasses">{{ item.label }}</span>
              <span
                v-if="item.count !== undefined"
                class="px-2 py-0.5 text-[0.65rem] font-bold tracking-wider rounded-sm"
                :class="
                  item.count > 0 ? 'bg-fill text-ink-secondary' : 'bg-fill-subtle text-ink-subtle'
                "
              >
                {{ item.count }}
              </span>
              <span
                v-else-if="item.badge !== undefined"
                class="px-2 py-0.5 text-[0.6rem] font-bold tracking-wider rounded-sm bg-fill text-ink-secondary"
              >
                {{ item.badge }}
              </span>
            </div>
            <p
              v-if="item.description"
              class="text-xs text-ink-subtle m-0 font-normal normal-case tracking-normal"
            >
              {{ item.description }}
            </p>
          </div>
        </button>

        <!-- Per-item actions slot: rendered outside the toggle button so
             action clicks don't trigger expand/collapse. Consumers opt in
             with `#<slot>-actions` and pass their own TButtons etc. -->
        <div
          v-if="$slots[`${item.slot}-actions`]"
          class="ml-auto flex items-center gap-2 pr-3"
          @click.stop
        >
          <slot :name="`${item.slot}-actions`" :item="item" :open="isOpen(idx)" />
          <!-- When a status indicator takes the chevron slot, surface an
               explicit expand/collapse button so users still have an
               obvious affordance to open the panel. -->
          <button
            v-if="item.status"
            type="button"
            class="p-2 flex items-center justify-center border border-line bg-fill-subtle rounded-sm text-ink-muted hover:bg-fill hover:border-line-strong hover:text-ink transition-all"
            @click.stop="toggle(idx)"
          >
            <TIcon :name="isOpen(idx) ? 'chevron-up' : 'chevron-down'" size="sm" />
          </button>
        </div>
      </div>

      <div v-show="isOpen(idx)" :id="`accordion-panel-${uid}-${idx}`" :class="contentClasses">
        <slot :name="item.slot" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import TIcon from './TIcon.vue'
import TStatusIndicator from './TStatusIndicator.vue'

export interface TAccordionItem {
  /** Slot name used for the expanded panel content. Also the unique key. */
  slot: string
  label: string
  /** Optional supporting copy under the label (inherited from TCollapsibleSection). */
  description?: string
  /** Left-side icon before the label (rendered next to the chevron/status). */
  icon?: string
  /** Inline pill badge — quick "beta"/"new" style tag. */
  badge?: string | number
  /**
   * Count pill — styled differently from `badge` (quieter when zero, louder
   * when non-zero). Prefer `count` for numeric totals; use `badge` for text.
   */
  count?: number
  /**
   * Status indicator. When set, replaces the chevron with a live dot and
   * surfaces an explicit expand/collapse button in the actions area.
   */
  status?: 'success' | 'error' | 'warn' | 'neutral'
  defaultOpen?: boolean
  disabled?: boolean
}

const uid = useId()

const props = withDefaults(
  defineProps<{
    items: TAccordionItem[]
    /** Allow multiple panels open simultaneously. */
    multiple?: boolean
    /**
     * Visual density of panel chrome.
     * - `compact` (default): matches the original TAccordion — small borders, tight spacing.
     * - `expanded`: matches the original TCollapsibleSection — bigger padding, dividers between
     *   header and content. Use for standalone sections where the panel is the focal point.
     */
    variant?: 'compact' | 'expanded'
  }>(),
  { multiple: false, variant: 'compact' },
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

const wrapperClasses = computed(() =>
  props.variant === 'expanded' ? 'flex flex-col gap-3' : 'flex flex-col gap-2',
)

const panelClasses = computed(() =>
  props.variant === 'expanded'
    ? 'relative bg-surface backdrop-blur-lg rounded-sm border border-line-subtle'
    : 'relative border border-line-subtle rounded-sm overflow-hidden bg-surface',
)

const headerClasses = (item: TAccordionItem) => {
  const base = [
    'flex-1 flex items-center gap-3 transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ]
  base.push(props.variant === 'expanded' ? 'px-5 py-4' : 'px-4 py-3')
  if (!item.disabled) base.push('hover:bg-fill-subtle cursor-pointer')
  return base.join(' ')
}

const titleClasses = computed(() =>
  props.variant === 'expanded'
    ? 'text-base font-bold tracking-wide text-ink'
    : 'text-sm font-bold tracking-wide uppercase text-ink',
)

const contentClasses = computed(() =>
  props.variant === 'expanded'
    ? 'px-5 pb-5 pt-2 border-t border-line-subtle'
    : 'px-4 py-4 border-t border-line-subtle',
)
</script>
