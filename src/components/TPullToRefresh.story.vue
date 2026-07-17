<template>
  <Story title="TPullToRefresh" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstNumber v-model="state.threshold" title="Threshold (px)" />
        <HstButton title="Simulate refresh" @click="simulate(state)" />
      </template>

      <p class="mb-3 text-xs text-ink-muted">
        Pull-to-refresh is a touch gesture — use your browser's device emulation (touch mode) to
        drag, or hit "Simulate refresh" to preview the spinner state.
      </p>

      <div class="h-72 w-full max-w-md rounded-sm border border-line-subtle bg-surface">
        <TPullToRefresh
          :refreshing="state.refreshing"
          :disabled="state.disabled"
          :threshold="state.threshold"
          @refresh="simulate(state)"
        >
          <ul class="divide-y divide-line-subtle">
            <li v-for="row in state.rows" :key="row" class="px-4 py-3 text-sm text-ink-secondary">
              {{ row }}
            </li>
          </ul>
        </TPullToRefresh>
      </div>
    </Variant>

    <Variant title="Refreshing">
      <div class="h-72 w-full max-w-md rounded-sm border border-line-subtle bg-surface">
        <TPullToRefresh refreshing>
          <ul class="divide-y divide-line-subtle">
            <li v-for="row in staticRows" :key="row" class="px-4 py-3 text-sm text-ink-secondary">
              {{ row }}
            </li>
          </ul>
        </TPullToRefresh>
      </div>
    </Variant>

    <Variant title="Custom indicator">
      <div class="h-72 w-full max-w-md rounded-sm border border-line-subtle bg-surface">
        <TPullToRefresh :refreshing="custom.refreshing" @refresh="simulate(custom)">
          <template #indicator="{ progress, armed, refreshing }">
            <span class="text-[0.65rem] font-bold tracking-wider uppercase text-ink-muted">
              {{ refreshing ? 'Refreshing…' : armed ? 'Release to refresh' : 'Pull down' }}
              <span class="font-mono normal-case">{{ Math.round(progress * 100) }}%</span>
            </span>
          </template>
          <ul class="divide-y divide-line-subtle">
            <li v-for="row in staticRows" :key="row" class="px-4 py-3 text-sm text-ink-secondary">
              {{ row }}
            </li>
          </ul>
        </TPullToRefresh>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TPullToRefresh from './TPullToRefresh.vue'

type Demo = { refreshing: boolean; disabled: boolean; threshold: number; rows: string[] }

const staticRows = [
  'Sensor node A-01',
  'Sensor node A-02',
  'Sensor node A-03',
  'VFD pump 1',
  'VFD pump 2',
]

const state = reactive<Demo>({
  refreshing: false,
  disabled: false,
  threshold: 64,
  rows: [...staticRows],
})

const custom = reactive<Demo>({
  refreshing: false,
  disabled: false,
  threshold: 64,
  rows: [...staticRows],
})

let batch = 0

// Stand-in for an async fetch: hold the spinner briefly, then prepend a row.
function simulate(target: Demo) {
  if (target.refreshing) return
  target.refreshing = true
  const n = ++batch
  setTimeout(() => {
    target.rows = [`Refreshed batch ${n}`, ...target.rows]
    target.refreshing = false
  }, 1200)
}
</script>
