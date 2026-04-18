<template>
  <Story title="TSubNavbar" group="layout">
    <Variant title="Playground">
      <div class="p-6 bg-bg min-h-40">
        <TSubNavbar :items="items" />
      </div>
    </Variant>

    <Variant title="With active item">
      <div class="p-6 bg-bg">
        <TSubNavbar :items="itemsWithActive" />
      </div>
    </Variant>

    <Variant title="Action items (no routing)">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TSubNavbar :items="actionItems" />
        <span class="text-xs text-ink-muted">Last action: {{ lastAction || 'none' }}</span>
      </div>
    </Variant>

    <Variant title="With path builder">
      <div class="p-6 bg-bg flex flex-col gap-2">
        <TSubNavbar :items="items" :path-builder="prefixWithDevice" />
        <span class="text-xs text-ink-muted">Paths are prefixed with /devices/abc-123</span>
      </div>
    </Variant>

    <Variant title="Empty">
      <div class="p-6 bg-bg min-h-20">
        <TSubNavbar :items="[]" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TSubNavbar from './TSubNavbar.vue'
import type { SubnavItem } from '../types/navigation'

const items: SubnavItem[] = [
  { label: 'Overview', icon: 'home', to: '/overview' },
  { label: 'Activity', icon: 'activity', to: '/activity' },
  { label: 'Metrics', icon: 'bar-chart-3', to: '/metrics' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const itemsWithActive: SubnavItem[] = [
  { label: 'Overview', icon: 'home', to: '/overview' },
  { label: 'Activity', icon: 'activity', to: '/activity', active: true },
  { label: 'Metrics', icon: 'bar-chart-3', to: '/metrics' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const lastAction = ref('')

const actionItems: SubnavItem[] = [
  { label: 'Refresh', icon: 'refresh-cw', action: () => (lastAction.value = 'Refresh') },
  { label: 'Export', icon: 'download', action: () => (lastAction.value = 'Export') },
  { label: 'Share', icon: 'share-2', action: () => (lastAction.value = 'Share') },
]

const prefixWithDevice = (to: string) => `/devices/abc-123${to}`
</script>
