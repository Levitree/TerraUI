<template>
  <Story title="TDashboardSidebar" group="dashboard">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.id" title="Sidebar id" />
        <HstCheckbox v-model="state.resizable" title="Resizable" />
        <HstCheckbox v-model="state.collapsible" title="Collapsible" />
        <HstNumber v-model="state.minWidth" title="Min width (px)" />
        <HstNumber v-model="state.maxWidth" title="Max width (px)" />
        <HstNumber v-model="state.collapsedWidth" title="Collapsed width (px)" />
        <HstCheckbox v-model="state.withHeader" title="Header slot" />
        <HstCheckbox v-model="state.withFooter" title="Footer slot" />
      </template>

      <div class="bg-bg min-h-[28rem]">
        <TDashboardGroup
          :key="`${state.id}-${state.minWidth}-${state.maxWidth}-${state.collapsedWidth}`"
          storage-key="terraui.story.sidebar"
        >
          <TDashboardSidebar
            :id="state.id"
            :resizable="state.resizable"
            :collapsible="state.collapsible"
            :min-width="state.minWidth"
            :max-width="state.maxWidth"
            :collapsed-width="state.collapsedWidth"
          >
            <template v-if="state.withHeader" #header="{ collapsed }">
              <div class="flex items-center gap-2 w-full">
                <TDashboardSidebarCollapse />
                <span v-if="!collapsed" class="text-sm font-bold tracking-wider uppercase text-ink"
                  >Sidebar</span
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

            <template v-if="state.withFooter" #footer="{ collapsed }">
              <div class="flex items-center gap-2 px-2 py-1 text-ink-muted">
                <TIcon name="user" size="sm" />
                <span v-if="!collapsed" class="text-xs truncate">aiden@terranova.inc</span>
              </div>
            </template>
          </TDashboardSidebar>

          <TDashboardPanel id="panel">
            <div class="p-6 text-sm text-ink-muted">
              Resize the sidebar by dragging its right edge (desktop width only).
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>

    <Variant title="With header + footer">
      <div class="bg-bg min-h-[28rem]">
        <TDashboardGroup storage-key="terraui.story.sidebar.chrome">
          <TDashboardSidebar id="sb">
            <template #header="{ collapsed }">
              <div class="flex items-center gap-2">
                <TDashboardSidebarCollapse />
                <span v-if="!collapsed" class="text-sm font-bold tracking-wider uppercase text-ink"
                  >Fleet</span
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

            <template #footer="{ collapsed }">
              <div class="flex items-center gap-2 px-2 py-1 text-ink-muted">
                <TIcon name="circle-user" size="sm" />
                <span v-if="!collapsed" class="text-xs truncate">Signed in</span>
              </div>
            </template>
          </TDashboardSidebar>

          <TDashboardPanel id="panel">
            <div class="p-6 text-sm text-ink-muted">Panel content.</div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>

    <Variant title="Starts collapsed">
      <div class="bg-bg min-h-[28rem]">
        <TDashboardGroup storage-key="terraui.story.sidebar.collapsed" :default-collapsed="true">
          <TDashboardSidebar id="sb">
            <template #header="{ collapsed }">
              <div class="flex items-center gap-2">
                <TDashboardSidebarCollapse />
                <span v-if="!collapsed" class="text-sm font-bold tracking-wider uppercase text-ink"
                  >Fleet</span
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
              Sidebar boots into its collapsed, icon-rail state. Use the collapse control in the
              header to expand.
            </div>
          </TDashboardPanel>
        </TDashboardGroup>
      </div>
    </Variant>

    <Variant title="Non-resizable, non-collapsible">
      <div class="bg-bg min-h-[28rem]">
        <TDashboardGroup storage-key="terraui.story.sidebar.fixed">
          <TDashboardSidebar id="sb" :resizable="false" :collapsible="false">
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
              Fixed-width sidebar: no drag handle, no collapse control.
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
import TIcon from '../TIcon.vue'

const state = reactive<{
  id: string
  resizable: boolean
  collapsible: boolean
  minWidth: number
  maxWidth: number
  collapsedWidth: number
  withHeader: boolean
  withFooter: boolean
}>({
  id: 'playground-sidebar',
  resizable: true,
  collapsible: true,
  minWidth: 200,
  maxWidth: 400,
  collapsedWidth: 64,
  withHeader: true,
  withFooter: true,
})

const navItems = [
  { label: 'Overview', icon: 'home' },
  { label: 'Devices', icon: 'cpu' },
  { label: 'Alerts', icon: 'bell' },
  { label: 'Reports', icon: 'bar-chart-3' },
  { label: 'Settings', icon: 'settings' },
]
</script>
