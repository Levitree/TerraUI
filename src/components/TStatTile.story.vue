<template>
  <Story title="TStatTile" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.value" title="Value" />
        <HstText v-model="state.unit" title="Unit" />
      </template>

      <div class="p-6 bg-bg min-h-40 grid grid-cols-2 gap-3 max-w-sm">
        <TStatTile :label="state.label" :value="state.value" :unit="state.unit || undefined" />
      </div>
    </Variant>

    <Variant title="Dashboard grid">
      <div class="p-6 bg-bg">
        <div class="grid grid-cols-4 gap-3 max-w-3xl">
          <TStatTile label="Requests" value="1.24M" unit="req" />
          <TStatTile label="Errors" value="312" />
          <TStatTile label="P95 latency" value="84" unit="ms" />
          <TStatTile label="Uptime" value="99.98" unit="%" />
        </div>
      </div>
    </Variant>

    <Variant title="With trend slot">
      <div class="p-6 bg-bg">
        <div class="grid grid-cols-3 gap-3 max-w-2xl">
          <TStatTile label="Revenue">
            <span class="text-ink">$24,812</span>
            <span class="ml-2 text-[0.65rem] text-status-online">+12.4%</span>
          </TStatTile>
          <TStatTile label="Active users">
            <span class="text-ink">8,421</span>
            <span class="ml-2 text-[0.65rem] text-status-online">+3.1%</span>
          </TStatTile>
          <TStatTile label="Churn">
            <span class="text-ink">1.8%</span>
            <span class="ml-2 text-[0.65rem] text-status-offline">+0.3%</span>
          </TStatTile>
        </div>
      </div>
    </Variant>

    <Variant title="With icons">
      <div class="p-6 bg-bg">
        <div class="grid grid-cols-3 gap-3 max-w-2xl">
          <TStatTile label="CPU">
            <span class="inline-flex items-center gap-1.5 justify-center">
              <TIcon name="cpu" size="xs" class="text-ink-muted" />
              <span>42</span>
              <span class="text-[0.6rem] font-normal text-ink-muted">%</span>
            </span>
          </TStatTile>
          <TStatTile label="Memory">
            <span class="inline-flex items-center gap-1.5 justify-center">
              <TIcon name="memory-stick" size="xs" class="text-ink-muted" />
              <span>6.2</span>
              <span class="text-[0.6rem] font-normal text-ink-muted">GB</span>
            </span>
          </TStatTile>
          <TStatTile label="Network">
            <span class="inline-flex items-center gap-1.5 justify-center">
              <TIcon name="network" size="xs" class="text-ink-muted" />
              <span>128</span>
              <span class="text-[0.6rem] font-normal text-ink-muted">Mb/s</span>
            </span>
          </TStatTile>
        </div>
      </div>
    </Variant>

    <Variant title="Fleet dashboard">
      <div class="p-6 bg-bg">
        <div class="grid grid-cols-6 gap-3 max-w-4xl">
          <TStatTile label="Nodes" value="24" />
          <TStatTile label="Online" value="22" />
          <TStatTile label="Degraded" value="1" />
          <TStatTile label="Offline" value="1" />
          <TStatTile label="Regions" value="4" />
          <TStatTile label="Load" value="0.42" />
        </div>
      </div>
    </Variant>

    <Variant title="Value-only (no unit)">
      <div class="p-6 bg-bg">
        <div class="grid grid-cols-4 gap-3 max-w-2xl">
          <TStatTile label="Open PRs" value="14" />
          <TStatTile label="Merged today" value="7" />
          <TStatTile label="Reviewers" value="9" />
          <TStatTile label="Draft" value="3" />
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TStatTile from './TStatTile.vue'
import TIcon from './TIcon.vue'

const state = reactive<{
  label: string
  value: string
  unit: string
}>({
  label: 'Requests',
  value: '1.24M',
  unit: 'req',
})
</script>
