<template>
  <div
    v-if="!isEmpty"
    class="flex flex-wrap items-center justify-between gap-3"
    :class="containerClass"
  >
    <div v-if="showSummary" class="text-ink-muted text-[0.7rem] font-mono uppercase tracking-wider">
      {{ summaryText }}
    </div>

    <div v-else />

    <div class="flex items-center gap-3">
      <label v-if="renderPageSizes" class="flex items-center gap-2">
        <span class="text-ink-muted text-[0.65rem] font-bold uppercase tracking-[0.2em]">
          Rows
        </span>
        <select
          :value="String(perPage)"
          :class="selectClasses"
          :aria-label="'Items per page'"
          @change="onPageSizeChange(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>

      <nav
        v-if="pageCount > 1 || showSinglePage"
        aria-label="Pagination"
        class="flex items-center gap-1.5"
      >
        <button
          v-if="showEdges"
          type="button"
          :disabled="isFirst"
          :class="buttonClasses(false)"
          aria-label="First page"
          @click="setPage(1)"
        >
          <TIcon name="chevrons-left" :size="iconSize" />
        </button>

        <button
          type="button"
          :disabled="isFirst"
          :class="buttonClasses(false)"
          aria-label="Previous page"
          @click="setPage(page - 1)"
        >
          <TIcon name="chevron-left" :size="iconSize" />
        </button>

        <template v-for="(entry, idx) in pages" :key="idx">
          <span
            v-if="entry === 'ellipsis'"
            class="px-2 text-ink-muted font-mono select-none"
            aria-hidden="true"
          >
            …
          </span>
          <button
            v-else
            type="button"
            :aria-current="entry === page ? 'page' : undefined"
            :class="buttonClasses(entry === page)"
            @click="setPage(entry)"
          >
            {{ entry }}
          </button>
        </template>

        <button
          type="button"
          :disabled="isLast"
          :class="buttonClasses(false)"
          aria-label="Next page"
          @click="setPage(page + 1)"
        >
          <TIcon name="chevron-right" :size="iconSize" />
        </button>

        <button
          v-if="showEdges"
          type="button"
          :disabled="isLast"
          :class="buttonClasses(false)"
          aria-label="Last page"
          @click="setPage(pageCount)"
        >
          <TIcon name="chevrons-right" :size="iconSize" />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import type { IconSize } from './TIcon.vue'

export type TPaginationSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** Current page (1-indexed). Use with `v-model:page`. */
    page?: number
    /** Total item count across all pages. */
    total: number
    /** Items per page. Use with `v-model:per-page` when a selector is desired. */
    perPage?: number
    /** Selectable page sizes. Pass `[]` to hide the selector entirely. */
    pageSizes?: number[]
    /**
     * Item noun used in the summary string.
     * Pass a string for auto-plural (`item` → `items`), or a tuple for custom plural.
     */
    itemLabel?: string | [singular: string, plural: string]
    /** Show the "Showing X–Y of Z" summary. Default true. */
    showSummary?: boolean
    /** Number of pages to show on each side of the current page. Default 1. */
    siblingCount?: number
    /** Show first/last arrow buttons. Default true. */
    showEdges?: boolean
    /** Render even when there is only one page. Default false. */
    showSinglePage?: boolean
    size?: TPaginationSize
    /** Extra classes on the outer wrapper. */
    containerClass?: string
  }>(),
  {
    page: 1,
    perPage: 25,
    pageSizes: () => [25, 50, 100],
    itemLabel: 'item',
    showSummary: true,
    siblingCount: 1,
    showEdges: true,
    showSinglePage: false,
    size: 'md',
    containerClass: '',
  },
)

const emit = defineEmits<{
  'update:page': [value: number]
  'update:perPage': [value: number]
  change: [value: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, props.perPage))))

const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= pageCount.value)
const isEmpty = computed(() => props.total <= 0)

const renderPageSizes = computed(() => props.pageSizes.length > 1)

const setPage = (next: number) => {
  const clamped = Math.max(1, Math.min(next, pageCount.value))
  if (clamped === props.page) return
  emit('update:page', clamped)
  emit('change', clamped)
}

const onPageSizeChange = (raw: string) => {
  const next = Number(raw)
  if (!Number.isFinite(next) || next <= 0 || next === props.perPage) return
  emit('update:perPage', next)
  // When the page size grows, the current page may now be out of range.
  // Clamp back into bounds so consumers don't have to.
  const newPageCount = Math.max(1, Math.ceil(props.total / next))
  if (props.page > newPageCount) emit('update:page', newPageCount)
}

type PageEntry = number | 'ellipsis'

// Build the middle page strip: current ± siblings, plus first and last,
// with ellipses where there are gaps. Produces between `2*sibling+5` and
// `pageCount` items.
const pages = computed<PageEntry[]>(() => {
  const total = pageCount.value
  const siblings = props.siblingCount
  const current = props.page

  const totalNumbers = siblings * 2 + 5
  if (total <= totalNumbers) {
    return range(1, total)
  }

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)

  const showLeftEllipsis = leftSibling > 3
  const showRightEllipsis = rightSibling < total - 2

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblings
    return [...range(1, leftItemCount), 'ellipsis', total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblings
    return [1, 'ellipsis', ...range(total - rightItemCount + 1, total)]
  }

  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', total]
})

const range = (start: number, end: number): number[] => {
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
}

const formatNumber = (n: number): string => n.toLocaleString('en-US')

const labels = computed(() => {
  if (Array.isArray(props.itemLabel)) {
    return { singular: props.itemLabel[0], plural: props.itemLabel[1] }
  }
  return { singular: props.itemLabel, plural: `${props.itemLabel}s` }
})

const summaryText = computed(() => {
  if (props.total <= 0) return `0 ${labels.value.plural}`
  const from = Math.min(props.total, (props.page - 1) * props.perPage + 1)
  const to = Math.min(props.total, props.page * props.perPage)
  const noun = props.total === 1 ? labels.value.singular : labels.value.plural
  return `Showing ${formatNumber(from)}–${formatNumber(to)} of ${formatNumber(props.total)} ${noun}`
})

const iconSize = computed<IconSize>(() => (props.size === 'lg' ? 'md' : 'sm'))

const sizeClasses: Record<TPaginationSize, string> = {
  sm: 'min-w-7 h-7 px-2 text-[0.65rem]',
  md: 'min-w-8 h-8 px-2.5 text-xs',
  lg: 'min-w-10 h-10 px-3 text-sm',
}

const selectSizeClasses: Record<TPaginationSize, string> = {
  sm: 'h-7 px-2 text-[0.65rem]',
  md: 'h-8 px-2 text-xs',
  lg: 'h-10 px-2.5 text-sm',
}

const selectClasses = computed(() =>
  [
    'appearance-none rounded-sm border bg-fill-subtle border-line text-ink-secondary',
    'font-bold tracking-wider uppercase cursor-pointer',
    'hover:bg-fill hover:text-ink hover:border-line-strong transition-colors',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-line-strong',
    selectSizeClasses[props.size],
  ].join(' '),
)

const buttonClasses = (active: boolean) => {
  const base = [
    'inline-flex items-center justify-center gap-1 rounded-sm font-bold tracking-wider uppercase transition-colors',
    'border',
    'disabled:opacity-30 disabled:cursor-not-allowed enabled:cursor-pointer',
    sizeClasses[props.size],
  ]
  if (active) {
    base.push('bg-fill-strong border-line-strong text-ink')
  } else {
    base.push(
      'bg-fill-subtle border-line text-ink-secondary enabled:hover:bg-fill enabled:hover:text-ink enabled:hover:border-line-strong',
    )
  }
  return base.join(' ')
}
</script>
