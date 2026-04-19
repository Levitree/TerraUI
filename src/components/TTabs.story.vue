<template>
  <Story title="TTabs" group="layout">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.value"
          title="Active tab"
          :options="playgroundTabs.map((t) => t.value!)"
        />
      </template>

      <div class="p-6 bg-bg min-h-40 flex flex-col items-start gap-4">
        <TTabs v-model="state.value" :tabs="playgroundTabs" />
        <div class="text-sm text-ink-muted">Selected: {{ state.value }}</div>
      </div>
    </Variant>

    <Variant title="Three tabs">
      <div class="p-6 bg-bg flex flex-col items-start gap-4">
        <TTabs v-model="view" :tabs="viewTabs" />
        <div class="text-sm text-ink">Viewing as <strong>{{ view }}</strong></div>
      </div>
    </Variant>

    <Variant title="Five tabs">
      <div class="p-6 bg-bg flex flex-col items-start gap-4">
        <TTabs v-model="range" :tabs="rangeTabs" />
        <div class="text-sm text-ink">Range: <strong>{{ range }}</strong></div>
      </div>
    </Variant>

    <Variant title="In a control bar">
      <div class="p-6 bg-bg">
        <TControlBar position="top">
          <TFilterLabel label="Mode" />
          <TTabs v-model="mode" :tabs="modeTabs" />
          <TSeparator orientation="vertical" class="h-5" />
          <TFilterLabel label="Range" />
          <TTabs v-model="range" :tabs="rangeTabs" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="Separated (filter chips)">
      <div class="p-6 bg-bg flex flex-col items-start gap-4">
        <TTabs v-model="status" separated :tabs="statusTabs" />
        <div class="text-sm text-ink">Status: <strong>{{ status }}</strong></div>
      </div>
    </Variant>

    <Variant title="Separated with icons and counts">
      <div class="p-6 bg-bg flex flex-col items-start gap-4">
        <TTabs v-model="priority" separated :tabs="priorityTabs" />
        <div class="text-sm text-ink">Priority: <strong>{{ priority }}</strong></div>
      </div>
    </Variant>

    <Variant title="Routing tabs (sub-nav pattern)">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TControlBar position="top">
          <TTabs separated :tabs="routingTabs" />
        </TControlBar>
        <span class="text-xs text-ink-muted">
          Active state follows the router. Compose with TControlBar for a sticky sub-navbar.
        </span>
      </div>
    </Variant>

    <Variant title="Routing tabs with path builder">
      <div class="p-6 bg-bg flex flex-col gap-2">
        <TTabs separated :tabs="routingTabs" :path-builder="prefixWithDevice" />
        <span class="text-xs text-ink-muted">Paths are prefixed with /devices/abc-123</span>
      </div>
    </Variant>

    <Variant title="Action tabs">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TTabs separated :tabs="actionTabs" />
        <span class="text-xs text-ink-muted">Last action: {{ lastAction || 'none' }}</span>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TTabs, { type Tab } from './TTabs.vue'
import TControlBar from './TControlBar.vue'
import TFilterLabel from './TFilterLabel.vue'
import TSeparator from './TSeparator.vue'

const playgroundTabs: Tab[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

const state = reactive<{ value: string }>({ value: 'all' })

const view = ref('grid')
const viewTabs: Tab[] = [
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
  { label: 'Map', value: 'map' },
]

const range = ref('24h')
const rangeTabs: Tab[] = [
  { label: '1h', value: '1h' },
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: 'All', value: 'all' },
]

const mode = ref('live')
const modeTabs: Tab[] = [
  { label: 'Live', value: 'live' },
  { label: 'Historical', value: 'historical' },
]

const status = ref('active')
const statusTabs: Tab[] = [
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
  { label: 'Revoked', value: 'revoked' },
  { label: 'All', value: 'all' },
]

const priority = ref('all')
const priorityTabs: Tab[] = [
  { label: 'All', value: 'all', count: 42 },
  { label: 'High', value: 'high', icon: 'flame', count: 3 },
  { label: 'Medium', value: 'medium', icon: 'circle-dot', count: 12 },
  { label: 'Low', value: 'low', icon: 'minus', count: 27 },
]

const routingTabs: Tab[] = [
  { label: 'Overview', icon: 'home', to: '/overview' },
  { label: 'Activity', icon: 'activity', to: '/activity' },
  { label: 'Metrics', icon: 'bar-chart-3', to: '/metrics' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const prefixWithDevice = (to: string) => `/devices/abc-123${to}`

const lastAction = ref('')
const actionTabs: Tab[] = [
  { label: 'Refresh', icon: 'refresh-cw', action: () => (lastAction.value = 'Refresh') },
  { label: 'Export', icon: 'download', action: () => (lastAction.value = 'Export') },
  { label: 'Share', icon: 'share-2', action: () => (lastAction.value = 'Share') },
]
</script>
