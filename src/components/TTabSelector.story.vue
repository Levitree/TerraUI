<template>
  <Story title="TTabSelector" group="layout">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.value"
          title="Active tab"
          :options="playgroundTabs.map((t) => t.value)"
        />
      </template>

      <div class="p-6 bg-bg min-h-40 flex flex-col items-start gap-4">
        <TTabSelector v-model="state.value" :tabs="playgroundTabs" />
        <div class="text-sm text-ink-muted">Selected: {{ state.value }}</div>
      </div>
    </Variant>

    <Variant title="Three tabs">
      <div class="p-6 bg-bg flex flex-col items-start gap-4">
        <TTabSelector v-model="view" :tabs="viewTabs" />
        <div class="text-sm text-ink">Viewing as <strong>{{ view }}</strong></div>
      </div>
    </Variant>

    <Variant title="Five tabs">
      <div class="p-6 bg-bg flex flex-col items-start gap-4">
        <TTabSelector v-model="range" :tabs="rangeTabs" />
        <div class="text-sm text-ink">Range: <strong>{{ range }}</strong></div>
      </div>
    </Variant>

    <Variant title="In a control bar">
      <div class="p-6 bg-bg">
        <TControlBar position="top">
          <TFilterLabel label="Mode" />
          <TTabSelector v-model="mode" :tabs="modeTabs" />
          <TFilterDivider />
          <TFilterLabel label="Range" />
          <TTabSelector v-model="range" :tabs="rangeTabs" />
        </TControlBar>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TTabSelector from './TTabSelector.vue'
import TControlBar from './TControlBar.vue'
import TFilterLabel from './TFilterLabel.vue'
import TFilterDivider from './TFilterDivider.vue'

const playgroundTabs = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

const state = reactive<{ value: string }>({ value: 'all' })

const view = ref('grid')
const viewTabs = [
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
  { label: 'Map', value: 'map' },
]

const range = ref('24h')
const rangeTabs = [
  { label: '1h', value: '1h' },
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: 'All', value: 'all' },
]

const mode = ref('live')
const modeTabs = [
  { label: 'Live', value: 'live' },
  { label: 'Historical', value: 'historical' },
]
</script>
