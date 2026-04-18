<template>
  <Story title="TDropdownMenu" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.align"
          title="Align"
          :options="['start', 'center', 'end']"
        />
        <HstText v-model="state.lastAction" title="Last action" readonly />
      </template>

      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdownMenu :items="playgroundItems" :content="{ align: state.align }">
          <TButton label="Open Menu" icon="chevron-down" icon-right />
        </TDropdownMenu>
      </div>
    </Variant>

    <Variant title="With icons and colors">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdownMenu :items="coloredItems">
          <TButton variant="secondary" label="Actions" icon="more-horizontal" />
        </TDropdownMenu>
      </div>
    </Variant>

    <Variant title="Grouped with separators">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdownMenu :items="groupedItems">
          <TButton label="Account" icon="user" />
        </TDropdownMenu>
      </div>
    </Variant>

    <Variant title="With labels and checkboxes">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdownMenu :items="checkboxItems">
          <TButton label="View options" icon="settings-2" />
        </TDropdownMenu>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TDropdownMenu from './TDropdownMenu.vue'
import type { TDropdownMenuItem } from './TDropdownMenu.vue'
import TButton from './TButton.vue'

const state = reactive<{
  align: 'start' | 'center' | 'end'
  lastAction: string
  showGrid: boolean
  showLabels: boolean
}>({
  align: 'start',
  lastAction: '—',
  showGrid: true,
  showLabels: false,
})

const playgroundItems: TDropdownMenuItem[] = [
  { label: 'Duplicate', icon: 'copy', onSelect: () => (state.lastAction = 'Duplicate') },
  { label: 'Rename', icon: 'pencil', onSelect: () => (state.lastAction = 'Rename') },
  { type: 'separator' },
  {
    label: 'Delete',
    icon: 'trash-2',
    color: 'error',
    onSelect: () => (state.lastAction = 'Delete'),
  },
]

const coloredItems: TDropdownMenuItem[] = [
  { label: 'Approve', icon: 'check', color: 'success', onSelect: () => {} },
  { label: 'Request changes', icon: 'message-square', color: 'warning', onSelect: () => {} },
  { label: 'Reject', icon: 'x', color: 'error', onSelect: () => {} },
  { type: 'separator' },
  { label: 'View details', icon: 'eye', onSelect: () => {} },
  { label: 'Archive (disabled)', icon: 'archive', disabled: true, onSelect: () => {} },
]

const groupedItems: TDropdownMenuItem[][] = [
  [
    { type: 'label', label: 'Aiden Bai', avatar: { text: 'AB' } },
    { label: 'Profile', icon: 'user', onSelect: () => {} },
    { label: 'Billing', icon: 'credit-card', onSelect: () => {} },
  ],
  [
    { label: 'Settings', icon: 'settings', onSelect: () => {} },
    { label: 'Help', icon: 'circle-help', onSelect: () => {} },
  ],
  [
    { label: 'Sign out', icon: 'log-out', color: 'error', onSelect: () => {} },
  ],
]

const checkboxItems = reactive<TDropdownMenuItem[]>([
  { type: 'label', label: 'Display' },
  {
    type: 'checkbox',
    label: 'Show grid',
    icon: 'grid',
    checked: state.showGrid,
    onSelect: () => (state.showGrid = !state.showGrid),
  },
  {
    type: 'checkbox',
    label: 'Show labels',
    icon: 'tag',
    checked: state.showLabels,
    onSelect: () => (state.showLabels = !state.showLabels),
  },
])
</script>
