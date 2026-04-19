<template>
  <Story title="TDropdown" group="overlays">
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
        <TDropdown :items="playgroundItems" :content="{ align: state.align }">
          <template #trigger>
            <TButton label="Open Menu" icon="chevron-down" icon-right />
          </template>
        </TDropdown>
      </div>
    </Variant>

    <Variant title="With icons and colors">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdown :items="coloredItems">
          <template #trigger>
            <TButton color="neutral" label="Actions" icon="more-horizontal" />
          </template>
        </TDropdown>
      </div>
    </Variant>

    <Variant title="Grouped with separators">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdown :items="groupedItems">
          <template #trigger>
            <TButton label="Account" icon="user" />
          </template>
        </TDropdown>
      </div>
    </Variant>

    <Variant title="With labels and checkboxes">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdown :items="checkboxItems">
          <template #trigger>
            <TButton label="View options" icon="settings-2" />
          </template>
        </TDropdown>
      </div>
    </Variant>

    <Variant title="Custom content">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdown>
          <template #trigger="{ open }">
            <TButton
              label="Workspace"
              icon="layers"
              icon-right
              :active="open"
            />
          </template>
          <template #default="{ close }">
            <div class="w-64 p-3">
              <div class="flex items-center gap-2 pb-3 border-b border-line-subtle">
                <div class="w-8 h-8 rounded-sm bg-fill flex items-center justify-center text-ink">
                  T
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-ink">Terranova</span>
                  <span class="text-xs text-ink-muted">Production</span>
                </div>
              </div>
              <div class="pt-2 flex flex-col gap-1 text-sm text-ink-secondary">
                <button class="text-left px-2 py-1.5 rounded-sm hover:bg-fill" @click="close">
                  Switch workspace
                </button>
                <button class="text-left px-2 py-1.5 rounded-sm hover:bg-fill" @click="close">
                  Invite members
                </button>
              </div>
            </div>
          </template>
        </TDropdown>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TDropdown from './TDropdown.vue'
import type { TDropdownItem } from './TDropdown.vue'
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

const playgroundItems: TDropdownItem[] = [
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

const coloredItems: TDropdownItem[] = [
  { label: 'Approve', icon: 'check', color: 'success', onSelect: () => {} },
  { label: 'Request changes', icon: 'message-square', color: 'warn', onSelect: () => {} },
  { label: 'Reject', icon: 'x', color: 'error', onSelect: () => {} },
  { type: 'separator' },
  { label: 'View details', icon: 'eye', onSelect: () => {} },
  { label: 'Archive (disabled)', icon: 'archive', disabled: true, onSelect: () => {} },
]

const groupedItems: TDropdownItem[][] = [
  [
    { type: 'label', label: 'Aiden Bai', avatar: { text: 'AB' } },
    { label: 'Profile', icon: 'user', onSelect: () => {} },
    { label: 'Billing', icon: 'credit-card', onSelect: () => {} },
  ],
  [
    { label: 'Settings', icon: 'settings', onSelect: () => {} },
    { label: 'Help', icon: 'circle-help', onSelect: () => {} },
  ],
  [{ label: 'Sign out', icon: 'log-out', color: 'error', onSelect: () => {} }],
]

const checkboxItems = reactive<TDropdownItem[]>([
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
