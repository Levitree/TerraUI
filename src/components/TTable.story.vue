<template>
  <Story title="TTable" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstCheckbox v-model="state.hoverable" title="Hoverable" />
        <HstCheckbox v-model="state.rowClickable" title="Row clickable" />
        <HstCheckbox v-model="state.empty" title="Show empty state" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TTable
          :data="state.empty ? [] : users"
          :columns="userColumns"
          :loading="state.loading"
          :hoverable="state.hoverable"
          :row-clickable="state.rowClickable"
          empty-message="No users found"
          @row-click="handleRowClick"
        />
        <div v-if="lastClicked" class="mt-3 text-xs text-ink-subtle">
          Last clicked: <span class="font-mono text-ink">{{ lastClicked }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Sortable columns">
      <div class="p-6 bg-bg">
        <p class="mb-3 text-xs text-ink-subtle">
          Click any column header to sort. Name and role sort alphabetically, status sorts by its
          string value.
        </p>
        <TTable
          :data="users"
          :columns="userColumns"
          :initial-sorting="[{ id: 'name', desc: false }]"
        />
      </div>
    </Variant>

    <Variant title="With selection">
      <div class="p-6 bg-bg">
        <TTable :data="users" :columns="selectableColumns" row-clickable />
        <div class="mt-3 text-xs text-ink-subtle">
          Selected: <span class="font-mono text-ink">{{ selected.size }}</span> of
          {{ users.length }}
        </div>
      </div>
    </Variant>

    <Variant title="Orders table">
      <div class="p-6 bg-bg">
        <TTable :data="orders" :columns="orderColumns" />
      </div>
    </Variant>

    <Variant title="Loading">
      <div class="p-6 bg-bg">
        <TTable :data="[]" :columns="userColumns" loading />
      </div>
    </Variant>

    <Variant title="Empty state">
      <div class="p-6 bg-bg">
        <TTable :data="[]" :columns="userColumns" empty-message="No matching users" />
      </div>
    </Variant>

    <Variant title="Custom empty slot">
      <div class="p-6 bg-bg">
        <TTable :data="[]" :columns="userColumns">
          <template #empty>
            <div class="flex flex-col items-center gap-2 py-4">
              <span class="text-sm text-ink-muted">No users match your filters</span>
              <button
                class="px-2 py-1 text-[0.65rem] font-bold tracking-wider uppercase border border-line rounded-sm hover:bg-fill-subtle text-ink-secondary"
              >
                Clear filters
              </button>
            </div>
          </template>
        </TTable>
      </div>
    </Variant>

    <Variant title="With header & footer">
      <div class="p-6 bg-bg">
        <TTable :data="users" :columns="userColumns">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold tracking-wider uppercase text-ink-muted">
                Team members
              </span>
              <span class="text-[0.65rem] text-ink-subtle">{{ users.length }} total</span>
            </div>
          </template>
          <template #footer>
            <div class="flex items-center justify-between text-xs text-ink-subtle">
              <span>Page 1 of 1</span>
              <span>Showing {{ users.length }} of {{ users.length }}</span>
            </div>
          </template>
        </TTable>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import TTable from './TTable.vue'
import TBadge from './TBadge.vue'
import type { BadgeColor } from './TBadge.vue'

type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'online' | 'offline'
}

type Order = {
  id: string
  customer: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'refunded'
  createdAt: string
}

const users: User[] = [
  { id: 'u_01', name: 'Ada Lovelace', email: 'ada@terra.dev', role: 'admin', status: 'online' },
  { id: 'u_02', name: 'Alan Turing', email: 'alan@terra.dev', role: 'admin', status: 'active' },
  { id: 'u_03', name: 'Grace Hopper', email: 'grace@terra.dev', role: 'member', status: 'active' },
  {
    id: 'u_04',
    name: 'Linus Torvalds',
    email: 'linus@terra.dev',
    role: 'member',
    status: 'offline',
  },
  {
    id: 'u_05',
    name: 'Margaret Hamilton',
    email: 'maggie@terra.dev',
    role: 'viewer',
    status: 'inactive',
  },
]

const orders: Order[] = [
  {
    id: 'ord_1001',
    customer: 'Acme Inc.',
    amount: 1249.0,
    currency: 'USD',
    status: 'paid',
    createdAt: '2026-04-15',
  },
  {
    id: 'ord_1002',
    customer: 'Globex',
    amount: 89.5,
    currency: 'USD',
    status: 'pending',
    createdAt: '2026-04-16',
  },
  {
    id: 'ord_1003',
    customer: 'Initech',
    amount: 4200.0,
    currency: 'USD',
    status: 'paid',
    createdAt: '2026-04-16',
  },
  {
    id: 'ord_1004',
    customer: 'Soylent Corp',
    amount: 310.75,
    currency: 'USD',
    status: 'refunded',
    createdAt: '2026-04-17',
  },
  {
    id: 'ord_1005',
    customer: 'Umbrella',
    amount: 58.0,
    currency: 'USD',
    status: 'paid',
    createdAt: '2026-04-18',
  },
]

const userCol = createColumnHelper<User>()
const orderCol = createColumnHelper<Order>()

const userColumns: ColumnDef<User, unknown>[] = [
  userCol.accessor('name', {
    header: 'Name',
    cell: (ctx) =>
      h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'font-medium text-ink' }, ctx.getValue() as string),
        h('span', { class: 'text-xs text-ink-subtle' }, ctx.row.original.email),
      ]),
  }),
  userCol.accessor('role', {
    header: 'Role',
    cell: (ctx) => h(TBadge, { color: 'neutral' }, () => ctx.getValue() as string),
  }),
  userCol.accessor('status', {
    header: 'Status',
    cell: (ctx) => {
      const value = ctx.getValue() as User['status']
      const color: BadgeColor =
        value === 'online' || value === 'active'
          ? 'success'
          : value === 'inactive'
            ? 'neutral'
            : 'error'
      return h(TBadge, { color, variant: 'ghost' }, () => value)
    },
  }),
] as ColumnDef<User, unknown>[]

const selectableColumns: ColumnDef<User, unknown>[] = [
  {
    id: 'select',
    enableSorting: false,
    size: 40,
    header: () =>
      h('input', {
        type: 'checkbox',
        class: 'cursor-pointer',
        checked: selected.value.size === users.length && users.length > 0,
        onChange: (e: Event) => {
          const checked = (e.target as HTMLInputElement).checked
          selected.value = checked ? new Set(users.map((u) => u.id)) : new Set()
        },
      }),
    cell: (ctx) =>
      h('input', {
        type: 'checkbox',
        class: 'cursor-pointer',
        checked: selected.value.has(ctx.row.original.id),
        onClick: (e: MouseEvent) => e.stopPropagation(),
        onChange: (e: Event) => {
          const next = new Set(selected.value)
          const id = ctx.row.original.id
          if ((e.target as HTMLInputElement).checked) next.add(id)
          else next.delete(id)
          selected.value = next
        },
      }),
  },
  ...userColumns,
]

const orderColumns: ColumnDef<Order, unknown>[] = [
  orderCol.accessor('id', {
    header: 'Order',
    cell: (ctx) => h('span', { class: 'font-mono text-xs text-ink' }, ctx.getValue() as string),
  }),
  orderCol.accessor('customer', { header: 'Customer' }),
  orderCol.accessor('amount', {
    header: 'Amount',
    cell: (ctx) => {
      const row = ctx.row.original
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: row.currency,
      }).format(row.amount)
      return h('span', { class: 'font-mono text-ink' }, formatted)
    },
  }),
  orderCol.accessor('status', {
    header: 'Status',
    cell: (ctx) => {
      const value = ctx.getValue() as Order['status']
      const color: BadgeColor =
        value === 'paid' ? 'success' : value === 'refunded' ? 'error' : 'neutral'
      return h(TBadge, { color, variant: 'ghost' }, () => value)
    },
  }),
  orderCol.accessor('createdAt', {
    header: 'Created',
    cell: (ctx) => h('span', { class: 'text-xs text-ink-secondary' }, ctx.getValue() as string),
  }),
] as ColumnDef<Order, unknown>[]

const state = reactive<{
  loading: boolean
  hoverable: boolean
  rowClickable: boolean
  empty: boolean
}>({
  loading: false,
  hoverable: true,
  rowClickable: true,
  empty: false,
})

const lastClicked = ref<string>('')
const handleRowClick = (row: User) => {
  lastClicked.value = `${row.name} (${row.id})`
}

const selected = ref<Set<string>>(new Set())
</script>
