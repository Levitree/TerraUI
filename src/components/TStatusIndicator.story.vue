<template>
  <Story title="TStatusIndicator" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstSelect v-model="state.status" title="Status" :options="statuses" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.pulse" title="Pulse" />
        <HstText v-model="state.title" title="Title (tooltip)" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TStatusIndicator
          :status="state.status"
          :size="state.size"
          :pulse="state.pulse"
          :title="state.title || undefined"
        />
      </div>
    </Variant>

    <Variant title="All statuses">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <div v-for="s in statuses" :key="s" class="flex items-center gap-3">
          <TStatusIndicator :status="s" />
          <span class="text-sm text-ink">{{ s }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-center gap-4">
        <div v-for="size in ['sm', 'md', 'lg'] as const" :key="size" class="flex items-center gap-2">
          <TStatusIndicator status="online" :size="size" />
          <span class="text-xs text-ink-muted uppercase tracking-wider">{{ size }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Pulse animation">
      <div class="p-6 bg-bg flex items-center gap-4">
        <TStatusIndicator status="online" pulse />
        <TStatusIndicator status="warning" pulse />
        <TStatusIndicator status="error" pulse />
        <TStatusIndicator status="connecting" />
        <span class="text-xs text-ink-muted">connecting pulses automatically</span>
      </div>
    </Variant>

    <Variant title="In context (label list)">
      <div class="p-6 bg-bg flex flex-col gap-2 w-64">
        <div class="flex items-center justify-between">
          <span class="text-sm text-ink">api.terranova.dev</span>
          <TStatusIndicator status="online" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-ink">edge-worker-eu</span>
          <TStatusIndicator status="connecting" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-ink">db-replica-02</span>
          <TStatusIndicator status="warning" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-ink">cache-node-07</span>
          <TStatusIndicator status="error" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-ink-muted">legacy-staging</span>
          <TStatusIndicator status="inactive" />
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TStatusIndicator from './TStatusIndicator.vue'
import type { IndicatorStatus, IndicatorSize } from './TStatusIndicator.vue'

const statuses: IndicatorStatus[] = [
  'online',
  'offline',
  'connecting',
  'active',
  'inactive',
  'warning',
  'error',
  'unknown',
  'unconfigured',
]

const state = reactive<{
  status: IndicatorStatus
  size: IndicatorSize
  pulse: boolean
  title: string
}>({
  status: 'online',
  size: 'md',
  pulse: false,
  title: '',
})
</script>
