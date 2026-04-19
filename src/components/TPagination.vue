<template>
  <nav v-if="pageCount > 1 || showSinglePage" aria-label="Pagination" class="flex items-center gap-1.5">
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
    /** Total item count. */
    total: number
    /** Items per page. Default 10. */
    itemsPerPage?: number
    /** Number of pages to show on each side of the current page. Default 1. */
    siblingCount?: number
    /** Show first/last arrow buttons. Default true. */
    showEdges?: boolean
    /** Render even when there is only one page. Default false. */
    showSinglePage?: boolean
    size?: TPaginationSize
  }>(),
  {
    page: 1,
    itemsPerPage: 10,
    siblingCount: 1,
    showEdges: true,
    showSinglePage: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:page': [value: number]
  change: [value: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, props.itemsPerPage))))

const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= pageCount.value)

const setPage = (next: number) => {
  const clamped = Math.max(1, Math.min(next, pageCount.value))
  if (clamped === props.page) return
  emit('update:page', clamped)
  emit('change', clamped)
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

const iconSize = computed<IconSize>(() => (props.size === 'lg' ? 'md' : 'sm'))

const sizeClasses: Record<TPaginationSize, string> = {
  sm: 'min-w-7 h-7 px-2 text-[0.65rem]',
  md: 'min-w-8 h-8 px-2.5 text-xs',
  lg: 'min-w-10 h-10 px-3 text-sm',
}

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
