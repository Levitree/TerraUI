<template>
  <Story title="TDashboardNavbar" group="dashboard">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.description" title="Description" />
        <HstCheckbox v-model="state.withLeading" title="Leading slot" />
        <HstCheckbox v-model="state.withRight" title="Right slot" />
      </template>

      <div class="p-6 bg-bg min-h-96">
        <TDashboardNavbar :title="state.title" :description="state.description">
          <template v-if="state.withLeading" #leading>
            <button
              class="inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-muted hover:bg-fill hover:text-ink"
              aria-label="Menu"
            >
              <TIcon name="menu" size="md" />
            </button>
          </template>
          <template v-if="state.withRight" #right>
            <button
              class="px-2 py-1 text-xs text-ink-muted hover:text-ink border border-line-subtle rounded-sm"
            >
              Refresh
            </button>
            <button class="px-2 py-1 text-xs text-ink bg-fill border border-line rounded-sm">
              + Add
            </button>
          </template>
        </TDashboardNavbar>
      </div>
    </Variant>

    <Variant title="Title + description">
      <div class="p-6 bg-bg min-h-40">
        <TDashboardNavbar
          title="Devices"
          description="12 online / 3 offline"
        />
      </div>
    </Variant>

    <Variant title="Breadcrumbs (title slot)">
      <div class="p-6 bg-bg min-h-40">
        <TDashboardNavbar>
          <template #title>
            <nav class="flex items-center gap-2 text-sm text-ink-muted">
              <a class="hover:text-ink" href="#">Fleet</a>
              <TIcon name="chevron-right" size="sm" />
              <a class="hover:text-ink" href="#">us-west-2</a>
              <TIcon name="chevron-right" size="sm" />
              <span class="text-ink font-bold tracking-wider uppercase">Node 4</span>
            </nav>
          </template>
        </TDashboardNavbar>
      </div>
    </Variant>

    <Variant title="With actions">
      <div class="p-6 bg-bg min-h-40">
        <TDashboardNavbar title="Alerts" description="23 unresolved">
          <template #right>
            <button
              class="inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-muted hover:bg-fill hover:text-ink"
              aria-label="Filter"
            >
              <TIcon name="filter" size="md" />
            </button>
            <button
              class="inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-muted hover:bg-fill hover:text-ink"
              aria-label="Refresh"
            >
              <TIcon name="refresh-cw" size="md" />
            </button>
            <button class="px-3 py-1 text-xs text-ink bg-fill border border-line rounded-sm">
              Resolve all
            </button>
          </template>
        </TDashboardNavbar>
      </div>
    </Variant>

    <Variant title="With nav items">
      <div class="p-6 bg-bg min-h-40">
        <TDashboardNavbar title="Project">
          <nav class="flex items-center gap-1">
            <button
              v-for="(item, i) in navItems"
              :key="item.label"
              class="px-3 py-1 text-xs rounded-sm"
              :class="
                i === 0
                  ? 'bg-fill text-ink border border-line'
                  : 'text-ink-muted hover:text-ink hover:bg-fill'
              "
            >
              {{ item.label }}
            </button>
          </nav>
        </TDashboardNavbar>
      </div>
    </Variant>

    <Variant title="With leading + title + right">
      <div class="p-6 bg-bg min-h-40">
        <TDashboardNavbar title="Settings" description="workspace preferences">
          <template #leading>
            <button
              class="inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-muted hover:bg-fill hover:text-ink"
              aria-label="Back"
            >
              <TIcon name="arrow-left" size="md" />
            </button>
          </template>
          <template #right>
            <button class="px-3 py-1 text-xs text-ink bg-fill border border-line rounded-sm">
              Save
            </button>
          </template>
        </TDashboardNavbar>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TDashboardNavbar from './TDashboardNavbar.vue'
import TIcon from '../TIcon.vue'

const state = reactive<{
  title: string
  description: string
  withLeading: boolean
  withRight: boolean
}>({
  title: 'Dashboard',
  description: 'Live overview',
  withLeading: true,
  withRight: true,
})

const navItems = [
  { label: 'Overview' },
  { label: 'Activity' },
  { label: 'Members' },
  { label: 'Settings' },
]
</script>
