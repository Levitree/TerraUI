<template>
  <Story title="TDashboardGroup" group="dashboard">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.storageKey" title="Storage key" />
        <HstNumber v-model="state.mobileBreakpoint" title="Mobile breakpoint (px)" />
        <HstNumber v-model="state.defaultWidth" title="Default sidebar width (px)" />
        <HstCheckbox v-model="state.defaultCollapsed" title="Default collapsed" />
      </template>

      <div class="bg-bg min-h-[32rem]">
        <TDashboardGroup
          :key="`${state.storageKey}-${state.mobileBreakpoint}-${state.defaultWidth}-${state.defaultCollapsed}`"
          :storage-key="state.storageKey"
          :mobile-breakpoint="state.mobileBreakpoint"
          :default-width="state.defaultWidth"
          :default-collapsed="state.defaultCollapsed"
        >
          <TDashboardSidebar id="sb">
            <template #header="{ collapsed }">
              <div class="flex items-center gap-2">
                <TDashboardSidebarCollapse />
                <span
                  v-if="!collapsed"
                  class="text-sm font-bold tracking-wider uppercase text-ink"
                  >TerraUI</span
                >
              </div>
            </template>
            <nav class="p-2 flex flex-col gap-1">
              <button
                v-for="n in navItems"
                :key="n.label"
                class="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-ink-muted hover:bg-fill hover:text-ink"
              >
                <TIcon :name="n.icon" size="sm" />
                <span class="truncate">{{ n.label }}</span>
              </button>
            </nav>
          </TDashboardSidebar>

          <TDashboardPanel id="panel">
            <template #header>
              <TDashboardNavbar title="Group playground" description="Resize and collapse" />
            </template>
            <div class="p-6 space-y-3">
              <p class="text-sm text-ink-muted">
                The <code>TDashboardGroup</code> provides the layout shell and a shared
                context used by the sidebar + collapse controls.
              </p>
              <p class="text-sm text-ink-muted">
                Drag the sidebar's right edge to resize; the collapse control toggles
                the icon-rail state.
              </p>
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>

    <Variant title="Composed shell">
      <div class="bg-bg min-h-[36rem]">
        <TDashboardGroup storage-key="terraui.story.composed">
          <TDashboardSidebar id="sb">
            <template #header="{ collapsed }">
              <div class="flex items-center gap-2 w-full">
                <TDashboardSidebarCollapse />
                <span
                  v-if="!collapsed"
                  class="text-sm font-bold tracking-wider uppercase text-ink"
                  >Fleet Ops</span
                >
              </div>
            </template>
            <nav class="p-2 flex flex-col gap-1">
              <button
                v-for="n in navItems"
                :key="n.label"
                class="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-ink-muted hover:bg-fill hover:text-ink"
                :class="{ 'bg-fill text-ink': n.active }"
              >
                <TIcon :name="n.icon" size="sm" />
                <span class="truncate">{{ n.label }}</span>
              </button>
            </nav>
            <template #footer="{ collapsed }">
              <div class="flex items-center gap-2 px-2 py-1 text-ink-muted">
                <TIcon name="user" size="sm" />
                <span v-if="!collapsed" class="text-xs truncate">aiden@terranova.inc</span>
              </div>
            </template>
          </TDashboardSidebar>

          <TDashboardPanel id="panel">
            <template #header>
              <TDashboardNavbar title="Devices" description="12 online / 3 offline">
                <template #leading>
                  <TDashboardSidebarCollapse />
                </template>
                <template #right>
                  <button
                    class="px-2 py-1 text-xs text-ink-muted hover:text-ink border border-line-subtle rounded-sm"
                  >
                    Refresh
                  </button>
                  <button
                    class="px-2 py-1 text-xs text-ink bg-fill border border-line rounded-sm"
                  >
                    + Add
                  </button>
                </template>
              </TDashboardNavbar>
            </template>

            <div class="p-6 grid grid-cols-2 gap-4">
              <div
                v-for="i in 6"
                :key="i"
                class="p-4 border border-line-subtle rounded-sm bg-chrome"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-ink">Node {{ i }}</span>
                  <span class="text-xs text-ink-muted">online</span>
                </div>
                <p class="text-xs text-ink-muted mt-2">us-west-2 / edge</p>
              </div>
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TDashboardGroup from './TDashboardGroup.vue'
import TDashboardSidebar from './TDashboardSidebar.vue'
import TDashboardSidebarCollapse from './TDashboardSidebarCollapse.vue'
import TDashboardPanel from './TDashboardPanel.vue'
import TDashboardNavbar from './TDashboardNavbar.vue'
import TIcon from '../TIcon.vue'

const state = reactive<{
  storageKey: string
  mobileBreakpoint: number
  defaultWidth: number
  defaultCollapsed: boolean
}>({
  storageKey: 'terraui.story.group',
  mobileBreakpoint: 1024,
  defaultWidth: 260,
  defaultCollapsed: false,
})

const navItems: { label: string; icon: string; active?: boolean }[] = [
  { label: 'Overview', icon: 'home' },
  { label: 'Devices', icon: 'cpu', active: true },
  { label: 'Alerts', icon: 'bell' },
  { label: 'Reports', icon: 'bar-chart-3' },
  { label: 'Settings', icon: 'settings' },
]
</script>
