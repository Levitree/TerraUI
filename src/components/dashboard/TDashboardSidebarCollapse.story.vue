<template>
  <Story title="TDashboardSidebarCollapse" group="dashboard">
    <Variant title="Playground">
      <div class="bg-bg min-h-[28rem]">
        <TDashboardGroup storage-key="terraui.story.collapse.playground">
          <TDashboardSidebar id="sb">
            <template #header="{ collapsed }">
              <div class="flex items-center gap-2">
                <TDashboardSidebarCollapse />
                <span v-if="!collapsed" class="text-sm font-bold tracking-wider uppercase text-ink"
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
              <TDashboardNavbar title="Playground" description="Toggle the sidebar">
                <template #leading>
                  <TDashboardSidebarCollapse />
                </template>
              </TDashboardNavbar>
            </template>
            <div class="p-6 text-sm text-ink-muted">
              Click the collapse control (in either the sidebar header or the navbar leading slot)
              to toggle the icon-rail state.
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>

    <Variant title="Expanded state">
      <div class="bg-bg min-h-[24rem]">
        <TDashboardGroup storage-key="terraui.story.collapse.expanded" :default-collapsed="false">
          <TDashboardSidebar id="sb">
            <template #header="{ collapsed }">
              <div class="flex items-center gap-2">
                <TDashboardSidebarCollapse />
                <span v-if="!collapsed" class="text-sm font-bold tracking-wider uppercase text-ink"
                  >Expanded</span
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
            <div class="p-6 text-sm text-ink-muted">
              Icon: <code>panel-left-close</code>. Click to collapse.
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>

    <Variant title="Collapsed state">
      <div class="bg-bg min-h-[24rem]">
        <TDashboardGroup storage-key="terraui.story.collapse.collapsed" :default-collapsed="true">
          <TDashboardSidebar id="sb">
            <template #header="{ collapsed }">
              <div class="flex items-center justify-center w-full">
                <TDashboardSidebarCollapse />
                <span
                  v-if="!collapsed"
                  class="ml-2 text-sm font-bold tracking-wider uppercase text-ink"
                  >Collapsed</span
                >
              </div>
            </template>
            <template #default="{ collapsed }">
              <nav class="p-2 flex flex-col gap-1">
                <button
                  v-for="n in navItems"
                  :key="n.label"
                  class="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-ink-muted hover:bg-fill hover:text-ink"
                  :class="{ 'justify-center': collapsed }"
                >
                  <TIcon :name="n.icon" size="sm" />
                  <span v-if="!collapsed" class="truncate">{{ n.label }}</span>
                </button>
              </nav>
            </template>
          </TDashboardSidebar>

          <TDashboardPanel id="panel">
            <div class="p-6 text-sm text-ink-muted">
              Icon: <code>panel-left-open</code>. Click to expand.
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>

    <Variant title="In navbar leading slot">
      <div class="bg-bg min-h-[24rem]">
        <TDashboardGroup storage-key="terraui.story.collapse.navbar">
          <TDashboardSidebar id="sb">
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
              <TDashboardNavbar title="Home" description="collapse in navbar">
                <template #leading>
                  <TDashboardSidebarCollapse />
                </template>
              </TDashboardNavbar>
            </template>
            <div class="p-6 text-sm text-ink-muted">
              The collapse button is also commonly placed in the navbar leading slot so users can
              always reach it — regardless of the sidebar's width.
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TDashboardGroup from './TDashboardGroup.vue'
import TDashboardSidebar from './TDashboardSidebar.vue'
import TDashboardSidebarCollapse from './TDashboardSidebarCollapse.vue'
import TDashboardPanel from './TDashboardPanel.vue'
import TDashboardNavbar from './TDashboardNavbar.vue'
import TIcon from '../TIcon.vue'

const navItems = [
  { label: 'Overview', icon: 'home' },
  { label: 'Devices', icon: 'cpu' },
  { label: 'Alerts', icon: 'bell' },
  { label: 'Reports', icon: 'bar-chart-3' },
  { label: 'Settings', icon: 'settings' },
]
</script>
