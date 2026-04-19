<template>
  <Story title="TSeparator" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.orientation"
          title="Orientation"
          :options="['horizontal', 'vertical']"
        />
        <HstText v-model="state.label" title="Label (horizontal only)" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <div v-if="state.orientation === 'horizontal'" class="w-80">
          <TSeparator orientation="horizontal" :label="state.label || undefined" />
        </div>
        <div v-else class="flex items-center gap-4 h-24 text-sm text-ink-secondary">
          <span>Left</span>
          <TSeparator orientation="vertical" />
          <span>Right</span>
        </div>
      </div>
    </Variant>

    <Variant title="Horizontal">
      <div class="p-6 bg-bg flex flex-col gap-6 w-full max-w-md">
        <p class="text-sm text-ink-secondary">Content above the separator.</p>
        <TSeparator />
        <p class="text-sm text-ink-secondary">Content below the separator.</p>
      </div>
    </Variant>

    <Variant title="Horizontal with label">
      <div class="p-6 bg-bg flex flex-col gap-6 w-full max-w-md">
        <TSeparator label="or" />
        <TSeparator label="continue with" />
        <TSeparator label="details" />
      </div>
    </Variant>

    <Variant title="Vertical">
      <div class="p-6 bg-bg flex items-center gap-4 text-sm text-ink h-20">
        <span>Overview</span>
        <TSeparator orientation="vertical" />
        <span>Logs</span>
        <TSeparator orientation="vertical" />
        <span>Settings</span>
      </div>
    </Variant>

    <Variant title="Filter-bar divider (h-5)">
      <!-- Replaces the previous TFilterDivider — always pair vertical orientation
           with a height class that matches the surrounding row. -->
      <div class="p-6 bg-bg">
        <div class="flex items-center gap-3 px-3 py-2 border border-line rounded-sm bg-surface">
          <span class="text-xs uppercase tracking-wider text-ink-muted">Mode</span>
          <span class="text-xs font-medium text-ink">Live</span>
          <TSeparator orientation="vertical" class="h-5" />
          <span class="text-xs uppercase tracking-wider text-ink-muted">Range</span>
          <span class="text-xs font-medium text-ink">24h</span>
          <TSeparator orientation="vertical" class="h-5" />
          <span class="text-xs uppercase tracking-wider text-ink-muted">Region</span>
          <span class="text-xs font-medium text-ink">us-east-1</span>
        </div>
      </div>
    </Variant>

    <Variant title="In a card-like block">
      <div class="p-6 bg-bg flex justify-center">
        <div class="w-80 border border-line rounded-sm bg-surface p-4 flex flex-col gap-3">
          <span class="text-sm font-medium text-ink">Title</span>
          <TSeparator />
          <p class="text-xs text-ink-muted">Body content separated by a subtle rule.</p>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TSeparator from './TSeparator.vue'

const state = reactive<{
  orientation: 'horizontal' | 'vertical'
  label: string
}>({
  orientation: 'horizontal',
  label: '',
})
</script>
