<template>
  <Story title="TCollapsibleSection" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.description" title="Description" />
        <HstNumber v-model="state.count" title="Count" />
        <HstCheckbox v-model="state.defaultExpanded" title="Default expanded" />
        <HstSelect
          v-model="state.status"
          title="Status"
          :options="['', 'online', 'offline']"
        />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TCollapsibleSection
          :title="state.title"
          :description="state.description || undefined"
          :count="Number.isFinite(state.count) ? state.count : undefined"
          :default-expanded="state.defaultExpanded"
          :status="state.status || undefined"
        >
          <p class="text-sm text-ink-secondary">
            This is the body content. You can put any markup here - forms, tables,
            descriptive text, or nested components.
          </p>
        </TCollapsibleSection>
      </div>
    </Variant>

    <Variant title="Collapsed (default)">
      <div class="p-6 bg-bg">
        <TCollapsibleSection title="Advanced options" description="Rarely changed settings">
          <p class="text-sm text-ink-secondary">Hidden until expanded.</p>
        </TCollapsibleSection>
      </div>
    </Variant>

    <Variant title="Expanded by default">
      <div class="p-6 bg-bg">
        <TCollapsibleSection
          title="Primary configuration"
          description="Core settings for this resource"
          default-expanded
        >
          <div class="flex flex-col gap-2 text-sm text-ink-secondary">
            <div>Name: <span class="font-mono text-ink">terra-api</span></div>
            <div>Environment: <span class="font-mono text-ink">production</span></div>
            <div>Owner: <span class="font-mono text-ink">platform-team</span></div>
          </div>
        </TCollapsibleSection>
      </div>
    </Variant>

    <Variant title="With count badge">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TCollapsibleSection title="Active deployments" :count="8" default-expanded>
          <p class="text-sm text-ink-secondary">8 services currently running.</p>
        </TCollapsibleSection>
        <TCollapsibleSection title="Archived" :count="0">
          <p class="text-sm text-ink-secondary">Nothing archived yet.</p>
        </TCollapsibleSection>
      </div>
    </Variant>

    <Variant title="With status indicator">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TCollapsibleSection
          title="terra-api"
          description="Main API service"
          status="online"
          default-expanded
        >
          <p class="text-sm text-ink-secondary">All endpoints reachable.</p>
        </TCollapsibleSection>
        <TCollapsibleSection title="terra-worker" description="Background jobs" status="offline">
          <p class="text-sm text-ink-secondary">Worker is paused.</p>
        </TCollapsibleSection>
      </div>
    </Variant>

    <Variant title="With actions slot">
      <div class="p-6 bg-bg">
        <TCollapsibleSection
          title="Environment variables"
          description="12 keys configured"
          default-expanded
        >
          <template #actions>
            <button
              class="px-2 py-1 text-xs font-bold tracking-wider uppercase border border-line rounded-sm hover:bg-fill-subtle text-ink-secondary"
            >
              Edit
            </button>
            <button
              class="px-2 py-1 text-xs font-bold tracking-wider uppercase border border-line rounded-sm hover:bg-fill-subtle text-ink-secondary"
            >
              Add
            </button>
          </template>
          <div class="flex flex-col gap-1 font-mono text-xs text-ink-secondary">
            <div>DATABASE_URL=***</div>
            <div>API_KEY=***</div>
            <div>LOG_LEVEL=info</div>
          </div>
        </TCollapsibleSection>
      </div>
    </Variant>

    <Variant title="Nested sections">
      <div class="p-6 bg-bg">
        <TCollapsibleSection title="Infrastructure" :count="3" default-expanded>
          <div class="flex flex-col gap-2">
            <TCollapsibleSection title="Compute" status="online">
              <p class="text-sm text-ink-secondary">3 nodes healthy.</p>
            </TCollapsibleSection>
            <TCollapsibleSection title="Storage" status="online">
              <p class="text-sm text-ink-secondary">Object store reachable.</p>
            </TCollapsibleSection>
            <TCollapsibleSection title="Network" status="offline">
              <p class="text-sm text-ink-secondary">Edge router is degraded.</p>
            </TCollapsibleSection>
          </div>
        </TCollapsibleSection>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TCollapsibleSection from './TCollapsibleSection.vue'

const state = reactive<{
  title: string
  description: string
  count: number
  defaultExpanded: boolean
  status: '' | 'online' | 'offline'
}>({
  title: 'Section title',
  description: 'A short description of what lives here',
  count: 3,
  defaultExpanded: true,
  status: '',
})
</script>
