<template>
  <Story title="TDashboardPanel" group="dashboard">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.id" title="Panel id" />
        <HstCheckbox v-model="state.withHeader" title="Header slot" />
        <HstCheckbox v-model="state.longContent" title="Long content (scroll)" />
      </template>

      <div class="bg-bg min-h-[28rem] flex h-[28rem]">
        <TDashboardPanel :id="state.id">
          <template v-if="state.withHeader" #header>
            <TDashboardNavbar title="Panel" description="with header slot" />
          </template>
          <div class="p-6 space-y-3">
            <p class="text-sm text-ink">Panel id: <code>{{ state.id }}</code></p>
            <p class="text-sm text-ink-muted">
              The panel is the primary content region. The header slot stays pinned
              while the body scrolls.
            </p>
            <template v-if="state.longContent">
              <div
                v-for="i in 40"
                :key="i"
                class="p-3 border border-line-subtle rounded-sm text-sm text-ink-muted"
              >
                Scrollable row {{ i }}
              </div>
            </template>
          </div>
        </TDashboardPanel>
      </div>
    </Variant>

    <Variant title="With header">
      <div class="bg-bg min-h-[24rem] flex h-[24rem]">
        <TDashboardPanel id="with-header">
          <template #header>
            <TDashboardNavbar title="Devices" description="live view" />
          </template>
          <div class="p-6 space-y-3">
            <p class="text-sm text-ink-muted">Body content.</p>
          </div>
        </TDashboardPanel>
      </div>
    </Variant>

    <Variant title="Body slot (named)">
      <div class="bg-bg min-h-[24rem] flex h-[24rem]">
        <TDashboardPanel id="named-body">
          <template #header>
            <TDashboardNavbar title="Named body" />
          </template>
          <template #body>
            <div class="p-6 bg-fill-subtle h-full">
              <p class="text-sm text-ink">
                Rendered via the explicit <code>#body</code> slot.
              </p>
            </div>
          </template>
        </TDashboardPanel>
      </div>
    </Variant>

    <Variant title="Scrolling body">
      <div class="bg-bg min-h-[28rem] flex h-[28rem]">
        <TDashboardPanel id="scrolling">
          <template #header>
            <TDashboardNavbar title="Activity log" description="newest first" />
          </template>
          <div class="p-4 space-y-2">
            <div
              v-for="i in 60"
              :key="i"
              class="px-3 py-2 border border-line-subtle rounded-sm text-xs text-ink-muted"
            >
              [{{ new Date().toISOString() }}] event #{{ i }}
            </div>
          </div>
        </TDashboardPanel>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TDashboardPanel from './TDashboardPanel.vue'
import TDashboardNavbar from './TDashboardNavbar.vue'

const state = reactive<{
  id: string
  withHeader: boolean
  longContent: boolean
}>({
  id: 'playground-panel',
  withHeader: true,
  longContent: false,
})
</script>
