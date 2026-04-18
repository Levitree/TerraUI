<template>
  <Story title="TLoadingState" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.inline" title="Inline (no vertical padding)" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TLoadingState
          :label="state.label || undefined"
          :size="state.size"
          :inline="state.inline"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-start gap-6">
        <TLoadingState size="sm" label="Small" />
        <TLoadingState size="md" label="Medium" />
        <TLoadingState size="lg" label="Large" />
      </div>
    </Variant>

    <Variant title="Without label">
      <div class="p-6 bg-bg">
        <TLoadingState />
      </div>
    </Variant>

    <Variant title="Inline">
      <div class="p-6 bg-bg flex items-center gap-3">
        <span class="text-sm text-ink-secondary">Syncing</span>
        <TLoadingState size="sm" inline />
      </div>
    </Variant>

    <Variant title="In a card">
      <div class="p-6 bg-bg">
        <div class="border border-line-subtle bg-surface rounded-sm p-4 max-w-md">
          <div class="text-xs font-bold tracking-wider uppercase text-ink-muted mb-2">
            Recent deployments
          </div>
          <TLoadingState label="Fetching deployments" />
        </div>
      </div>
    </Variant>

    <Variant title="Page loader">
      <div class="p-6 bg-bg">
        <div class="border border-line-subtle bg-surface rounded-sm min-h-64 flex items-center justify-center">
          <TLoadingState size="lg" label="Loading workspace" />
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TLoadingState from './TLoadingState.vue'

const state = reactive<{
  label: string
  size: 'sm' | 'md' | 'lg'
  inline: boolean
}>({
  label: 'Loading',
  size: 'md',
  inline: false,
})
</script>
