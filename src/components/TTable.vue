<template>
  <div
    class="border border-line bg-surface rounded-sm overflow-hidden"
    :class="{ 'hover:border-line-strong transition-all': hoverable }"
  >
    <div v-if="$slots.header" class="px-4 py-3 border-b border-line-subtle bg-fill-subtle">
      <slot name="header" />
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="border-b border-line-subtle bg-fill-subtle"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :style="header.getSize() !== 150 ? { width: `${header.getSize()}px` } : undefined"
              class="px-4 py-2.5 text-left text-[0.65rem] font-bold tracking-[0.2em] uppercase text-ink-muted select-none"
              :class="[
                header.column.getCanSort() ? 'cursor-pointer hover:text-ink' : '',
                headerClass(header),
              ]"
              @click="
                header.column.getCanSort()
                  ? header.column.getToggleSortingHandler()?.($event)
                  : undefined
              "
            >
              <div class="flex items-center gap-1.5">
                <!--
                  Per-column header slots mirror `-cell` slots: opt in with
                  `#<id>-header` to fully override the rendered header while
                  keeping sort click-through on the <th>. Consumers still get
                  access to the TanStack header/column/table instances.
                -->
                <slot
                  v-if="!header.isPlaceholder && $slots[`${header.column.id}-header`]"
                  :name="`${header.column.id}-header`"
                  :header="header"
                  :column="header.column"
                  :table="table"
                />
                <FlexRender
                  v-else-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <TIcon
                  v-if="header.column.getIsSorted()"
                  :name="header.column.getIsSorted() === 'asc' ? 'arrow-up' : 'arrow-down'"
                  size="xs"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td
              :colspan="table.getAllColumns().length"
              class="px-4 py-6 text-xs uppercase tracking-wider text-ink-muted text-center"
            >
              <slot name="loading">Loading…</slot>
            </td>
          </tr>
          <tr v-else-if="table.getRowModel().rows.length === 0">
            <td
              :colspan="table.getAllColumns().length"
              class="px-4 py-6 text-xs uppercase tracking-wider text-ink-muted text-center"
            >
              <slot name="empty">{{ emptyMessage }}</slot>
            </td>
          </tr>
          <tr
            v-for="row in table.getRowModel().rows"
            v-else
            :key="row.id"
            class="border-b border-line-subtle transition-colors"
            :class="[rowClickable ? 'cursor-pointer hover:bg-fill-subtle' : '']"
            @click="rowClickable ? emit('rowClick', row.original) : undefined"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 text-sm text-ink align-middle"
              :class="cellClass(cell)"
            >
              <!--
                Slots take precedence over the column's `cell` render fn.
                TanStack auto-generates a default `cell` for every
                `accessorKey` column (it just returns `renderValue()`), so a
                naive `cell ? FlexRender : slot` check would make slots
                unreachable for the common case. Preferring the slot when one
                is provided lets consumers opt into slot-based rendering
                without having to drop accessorKey (and with it, sortability).
              -->
              <slot
                v-if="$slots[`${cell.column.id}-cell`]"
                :name="`${cell.column.id}-cell`"
                :row="cell.row.original"
                :value="cell.getValue()"
                :cell="cell"
                :column="cell.column"
                :table="table"
                :get-value="cell.getValue"
                :render-value="cell.renderValue"
              />
              <FlexRender
                v-else-if="cell.column.columnDef.cell"
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
              <template v-else>{{ cell.getValue() }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="px-4 py-3 border-t border-line-subtle">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
  type Cell,
  type ColumnDef,
  type ColumnFiltersState,
  type Header,
  type SortingState,
} from '@tanstack/vue-table'
import TIcon from './TIcon.vue'

// Per-column meta.class.{th,td} styling — Nuxt-UI-compatible extension of
// TanStack's `columnDef.meta`. Declared here (rather than via module
// augmentation) so consumers get inference on the `meta` field without having
// to augment `@tanstack/vue-table` in their own code.
export interface TTableColumnMeta {
  class?: {
    th?: string
    td?: string
  }
}

type TColumnDef = ColumnDef<TData, unknown> & { meta?: TTableColumnMeta }

const props = withDefaults(
  defineProps<{
    data: TData[]
    columns: TColumnDef[]
    loading?: boolean
    emptyMessage?: string
    hoverable?: boolean
    rowClickable?: boolean
    initialSorting?: SortingState
    /** Free-text filter applied across all filterable columns. Two-way via `v-model:global-filter`. */
    globalFilter?: string
    /** Custom matcher. Defaults to case-insensitive `includes` on the stringified cell value. */
    globalFilterFn?: (row: TData, columnId: string, filterValue: string) => boolean
  }>(),
  {
    loading: false,
    emptyMessage: 'No data',
    hoverable: true,
    rowClickable: false,
    initialSorting: () => [],
  },
)

const emit = defineEmits<{
  rowClick: [row: TData]
}>()

const sorting = defineModel<SortingState>('sorting', { default: () => [] })
const columnFilters = defineModel<ColumnFiltersState>('columnFilters', {
  default: () => [],
})
const globalFilter = defineModel<string>('globalFilter', { default: '' })

if (props.initialSorting.length && !sorting.value.length) {
  sorting.value = props.initialSorting
}

// Mirror non-model `globalFilter` prop into the model so callers can pass it
// as a plain prop without wiring `v-model:global-filter`.
if (props.globalFilter !== undefined && props.globalFilter !== globalFilter.value) {
  globalFilter.value = props.globalFilter
}

const defaultGlobalFilter = (row: TData, columnId: string, filterValue: string) => {
  const record = row as Record<string, unknown>
  const raw = record?.[columnId]
  if (raw == null) return false
  return String(raw).toLowerCase().includes(filterValue.toLowerCase())
}

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns as ColumnDef<TData, unknown>[]
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value =
      typeof updater === 'function' ? updater(columnFilters.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value =
      typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  globalFilterFn: (row, columnId, filterValue) => {
    const fn = props.globalFilterFn ?? defaultGlobalFilter
    return fn(row.original, columnId, filterValue as string)
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

const headerClass = (header: Header<TData, unknown>): string | undefined => {
  const meta = header.column.columnDef.meta as TTableColumnMeta | undefined
  return meta?.class?.th
}

const cellClass = (cell: Cell<TData, unknown>): string | undefined => {
  const meta = cell.column.columnDef.meta as TTableColumnMeta | undefined
  return meta?.class?.td
}

defineExpose({ table: computed(() => table) })
</script>
