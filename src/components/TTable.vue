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
              :class="header.column.getCanSort() ? 'cursor-pointer hover:text-ink' : ''"
              @click="
                header.column.getCanSort()
                  ? header.column.getToggleSortingHandler()?.($event)
                  : undefined
              "
            >
              <div class="flex items-center gap-1.5">
                <FlexRender
                  v-if="!header.isPlaceholder"
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
              Loading…
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
            >
              <FlexRender
                v-if="cell.column.columnDef.cell"
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
              <slot
                v-else
                :name="`${cell.column.id}-cell`"
                :row="cell.row.original"
                :value="cell.getValue()"
                :cell="cell"
              >
                {{ cell.getValue() }}
              </slot>
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
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'
import TIcon from './TIcon.vue'

const props = withDefaults(
  defineProps<{
    data: TData[]
    columns: ColumnDef<TData, unknown>[]
    loading?: boolean
    emptyMessage?: string
    hoverable?: boolean
    rowClickable?: boolean
    initialSorting?: SortingState
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

if (props.initialSorting.length && !sorting.value.length) {
  sorting.value = props.initialSorting
}

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

defineExpose({ table: computed(() => table) })
</script>
