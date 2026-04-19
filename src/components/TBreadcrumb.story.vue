<template>
  <Story title="TBreadcrumb" group="layout-navigation">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.separator" title="Separator icon" />
        <HstText v-model="state.lastClicked" title="Last action" readonly />
      </template>

      <div class="p-6 bg-bg min-h-20">
        <TBreadcrumb :items="actionItems" :separator="state.separator" />
      </div>
    </Variant>

    <Variant title="With router links">
      <div class="p-6 bg-bg">
        <TBreadcrumb :items="routeItems" />
      </div>
    </Variant>

    <Variant title="With icons">
      <div class="p-6 bg-bg">
        <TBreadcrumb :items="iconItems" />
      </div>
    </Variant>

    <Variant title="Custom separator (slash)">
      <div class="p-6 bg-bg">
        <TBreadcrumb :items="routeItems" separator="slash" />
      </div>
    </Variant>

    <Variant title="Two-level">
      <div class="p-6 bg-bg">
        <TBreadcrumb
          :items="[
            { label: 'Home', icon: 'house', onSelect: () => {} },
            { label: 'Overview' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import TBreadcrumb from './TBreadcrumb.vue'
import type { TBreadcrumbItem } from './TBreadcrumb.vue'

const state = reactive({
  separator: 'chevron-right',
  lastClicked: '—',
})

const actionItems = computed<TBreadcrumbItem[]>(() => [
  { label: 'Workspace', icon: 'layers', onSelect: () => (state.lastClicked = 'Workspace') },
  { label: 'Projects', onSelect: () => (state.lastClicked = 'Projects') },
  { label: 'Terra Core', onSelect: () => (state.lastClicked = 'Terra Core') },
  { label: 'Settings' },
])

const routeItems: TBreadcrumbItem[] = [
  { label: 'Dashboard', to: '/', icon: 'layout-dashboard' },
  { label: 'Devices', to: '/devices' },
  { label: 'TE-00421' },
]

const iconItems: TBreadcrumbItem[] = [
  { label: 'Home', icon: 'house', to: '/' },
  { label: 'Library', icon: 'library', to: '/library' },
  { label: 'Components', icon: 'component', to: '/library/components' },
  { label: 'TBreadcrumb' },
]
</script>
