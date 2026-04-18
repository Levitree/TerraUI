<template>
  <Story title="TAccordion" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstCheckbox v-model="state.multiple" title="Allow multiple open" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TAccordion :items="playgroundItems" :multiple="state.multiple">
          <template #overview>
            <p class="text-sm text-ink-secondary">
              High-level summary of the service. This panel opens by default and shows
              metadata you'd want at a glance.
            </p>
          </template>
          <template #config>
            <div class="flex flex-col gap-2 text-sm text-ink-secondary">
              <div class="flex justify-between">
                <span>Region</span><span class="font-mono text-ink">us-east-1</span>
              </div>
              <div class="flex justify-between">
                <span>Runtime</span><span class="font-mono text-ink">node:20</span>
              </div>
              <div class="flex justify-between">
                <span>Memory</span><span class="font-mono text-ink">512 MB</span>
              </div>
            </div>
          </template>
          <template #logs>
            <pre
              class="text-xs font-mono text-ink-secondary bg-fill-subtle p-3 rounded-sm overflow-auto"
            >[12:04:22] server listening on :8080
[12:04:23] db pool ready
[12:04:24] ready to serve requests</pre>
          </template>
          <template #danger>
            <p class="text-sm text-ink-secondary">
              Irreversible actions. Proceed with caution.
            </p>
          </template>
        </TAccordion>
      </div>
    </Variant>

    <Variant title="Single open (default)">
      <div class="p-6 bg-bg">
        <TAccordion :items="basicItems">
          <template #overview>
            <p class="text-sm text-ink-secondary">Only one section can be open at a time.</p>
          </template>
          <template #details>
            <p class="text-sm text-ink-secondary">
              Opening this will collapse the previous section.
            </p>
          </template>
          <template #activity>
            <p class="text-sm text-ink-secondary">Recent activity entries would render here.</p>
          </template>
        </TAccordion>
      </div>
    </Variant>

    <Variant title="Multiple open">
      <div class="p-6 bg-bg">
        <TAccordion :items="basicItems" multiple>
          <template #overview>
            <p class="text-sm text-ink-secondary">With multiple enabled, users can expand
              several sections at once.</p>
          </template>
          <template #details>
            <p class="text-sm text-ink-secondary">Stays open alongside siblings.</p>
          </template>
          <template #activity>
            <p class="text-sm text-ink-secondary">Also stays open.</p>
          </template>
        </TAccordion>
      </div>
    </Variant>

    <Variant title="With icons & badges">
      <div class="p-6 bg-bg">
        <TAccordion :items="richItems" multiple>
          <template #deployments>
            <p class="text-sm text-ink-secondary">4 deployments across production.</p>
          </template>
          <template #alerts>
            <p class="text-sm text-ink-secondary">2 open alerts need review.</p>
          </template>
          <template #members>
            <p class="text-sm text-ink-secondary">12 members belong to this workspace.</p>
          </template>
          <template #archive>
            <p class="text-sm text-ink-secondary">This section is disabled.</p>
          </template>
        </TAccordion>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TAccordion, { type TAccordionItem } from './TAccordion.vue'

const state = reactive<{ multiple: boolean }>({
  multiple: false,
})

const playgroundItems: TAccordionItem[] = [
  { slot: 'overview', label: 'Overview', defaultOpen: true },
  { slot: 'config', label: 'Configuration', icon: 'settings' },
  { slot: 'logs', label: 'Logs', badge: 24 },
  { slot: 'danger', label: 'Danger zone', icon: 'alert-triangle' },
]

const basicItems: TAccordionItem[] = [
  { slot: 'overview', label: 'Overview', defaultOpen: true },
  { slot: 'details', label: 'Details' },
  { slot: 'activity', label: 'Activity' },
]

const richItems: TAccordionItem[] = [
  { slot: 'deployments', label: 'Deployments', icon: 'rocket', badge: 4, defaultOpen: true },
  { slot: 'alerts', label: 'Alerts', icon: 'bell', badge: 2 },
  { slot: 'members', label: 'Members', icon: 'users', badge: 12 },
  { slot: 'archive', label: 'Archive', icon: 'archive', disabled: true },
]
</script>
