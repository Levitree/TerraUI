<template>
  <Story title="TNavigationMenu" group="layout">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.orientation"
          title="Orientation"
          :options="['vertical', 'horizontal']"
        />
        <HstCheckbox v-model="state.collapsed" title="Collapsed" />
      </template>

      <div class="p-6 bg-bg min-h-80">
        <div
          :class="[
            'bg-chrome border border-line-subtle rounded-sm',
            state.collapsed ? 'w-16 p-2' : 'w-64 p-3',
          ]"
        >
          <TNavigationMenu
            :items="items"
            :orientation="state.orientation"
            :collapsed="state.collapsed"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div class="p-6 bg-bg">
        <div class="w-64 p-3 bg-chrome border border-line-subtle rounded-sm">
          <TNavigationMenu :items="items" orientation="vertical" />
        </div>
      </div>
    </Variant>

    <Variant title="Horizontal">
      <div class="p-6 bg-bg">
        <div class="p-3 bg-chrome border border-line-subtle rounded-sm">
          <TNavigationMenu :items="items" orientation="horizontal" />
        </div>
      </div>
    </Variant>

    <Variant title="Collapsed (icon rail)">
      <div class="p-6 bg-bg">
        <div class="w-16 p-2 bg-chrome border border-line-subtle rounded-sm">
          <TNavigationMenu :items="items" collapsed />
        </div>
      </div>
    </Variant>

    <Variant title="With children (tree)">
      <div class="p-6 bg-bg">
        <div class="w-64 p-3 bg-chrome border border-line-subtle rounded-sm">
          <TNavigationMenu :items="itemsWithChildren" />
        </div>
      </div>
    </Variant>

    <Variant title="Grouped items">
      <div class="p-6 bg-bg">
        <div class="w-64 p-3 bg-chrome border border-line-subtle rounded-sm">
          <TNavigationMenu :items="groupedItems" />
        </div>
      </div>
    </Variant>

    <Variant title="With badges & disabled">
      <div class="p-6 bg-bg">
        <div class="w-64 p-3 bg-chrome border border-line-subtle rounded-sm">
          <TNavigationMenu :items="itemsWithBadges" />
        </div>
      </div>
    </Variant>

    <Variant title="Empty">
      <div class="p-6 bg-bg">
        <div class="w-64 p-3 bg-chrome border border-line-subtle rounded-sm min-h-20">
          <TNavigationMenu :items="[]" />
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TNavigationMenu, { type NavItem } from './TNavigationMenu.vue'

const items: NavItem[] = [
  { label: 'Dashboard', icon: 'home', to: '/dashboard' },
  { label: 'Devices', icon: 'cpu', to: '/devices' },
  { label: 'Users', icon: 'users', to: '/users' },
  { label: 'Reports', icon: 'bar-chart-3', to: '/reports' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const itemsWithChildren: NavItem[] = [
  { label: 'Home', icon: 'home', to: '/' },
  {
    label: 'Fleet',
    icon: 'network',
    defaultOpen: true,
    children: [
      { label: 'All devices', icon: 'cpu', to: '/fleet/all' },
      { label: 'Gateways', icon: 'router', to: '/fleet/gateways' },
      { label: 'Sensors', icon: 'radio', to: '/fleet/sensors' },
    ],
  },
  {
    label: 'Admin',
    icon: 'shield',
    children: [
      { label: 'Users', icon: 'users', to: '/admin/users' },
      { label: 'Roles', icon: 'key', to: '/admin/roles' },
      {
        label: 'Billing',
        icon: 'credit-card',
        children: [
          { label: 'Invoices', icon: 'file-text', to: '/admin/billing/invoices' },
          { label: 'Plans', icon: 'layers', to: '/admin/billing/plans' },
        ],
      },
    ],
  },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const groupedItems: NavItem[][] = [
  [
    { label: 'Dashboard', icon: 'home', to: '/dashboard' },
    { label: 'Devices', icon: 'cpu', to: '/devices' },
  ],
  [
    { label: 'Inbox', icon: 'inbox', to: '/inbox', badge: 12 },
    { label: 'Reports', icon: 'bar-chart-3', to: '/reports' },
  ],
  [{ label: 'Settings', icon: 'settings', to: '/settings' }],
]

const itemsWithBadges: NavItem[] = [
  { label: 'Inbox', icon: 'inbox', to: '/inbox', badge: 12 },
  { label: 'Alerts', icon: 'bell', to: '/alerts', badge: 'new' },
  { label: 'Reports', icon: 'bar-chart-3', to: '/reports' },
  { label: 'Archived', icon: 'archive', to: '/archived', disabled: true },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const state = reactive<{
  orientation: 'vertical' | 'horizontal'
  collapsed: boolean
}>({
  orientation: 'vertical',
  collapsed: false,
})
</script>
