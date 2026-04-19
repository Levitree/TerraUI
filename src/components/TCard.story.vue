<template>
  <Story title="TCard" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Title" />
        <HstCheckbox v-model="state.noPadding" title="No padding" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TCard
          :title="state.title || undefined"
          :no-padding="state.noPadding"
          class="w-80"
        >
          <p class="text-sm text-ink-secondary">
            Cards group related content and actions. They support optional
            header and footer slots alongside a default body slot.
          </p>
        </TCard>
      </div>
    </Variant>

    <Variant title="Title prop">
      <div class="p-6 bg-bg flex justify-center">
        <TCard title="Worker Status" class="w-80">
          <p class="text-sm text-ink-secondary">Body content goes here.</p>
        </TCard>
      </div>
    </Variant>

    <Variant title="Header slot">
      <div class="p-6 bg-bg flex justify-center">
        <TCard class="w-80">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-base font-bold tracking-wide text-ink">Deployment</span>
              <span class="text-xs text-ink-muted">just now</span>
            </div>
          </template>
          <p class="text-sm text-ink-secondary">
            Composed header with a title and a timestamp.
          </p>
        </TCard>
      </div>
    </Variant>

    <Variant title="Header + footer">
      <div class="p-6 bg-bg flex justify-center">
        <TCard title="Confirm action" class="w-80">
          <p class="text-sm text-ink-secondary">
            This operation cannot be undone. Please confirm before continuing.
          </p>
          <template #footer>
            <div class="flex items-center justify-end gap-2">
              <button class="text-xs text-ink-muted">Cancel</button>
              <button class="text-xs font-medium text-ink">Confirm</button>
            </div>
          </template>
        </TCard>
      </div>
    </Variant>

    <Variant title="No padding">
      <div class="p-6 bg-bg flex justify-center">
        <TCard title="Full-bleed body" no-padding class="w-80">
          <div class="bg-fill-subtle px-4 py-6 text-sm text-ink-secondary">
            Body renders edge-to-edge without inner padding.
          </div>
        </TCard>
      </div>
    </Variant>

    <Variant title="In context">
      <div class="p-6 bg-bg grid grid-cols-2 gap-4">
        <TCard title="CPU">
          <div class="text-2xl font-bold text-ink">42%</div>
          <div class="text-xs text-ink-muted">8 cores, 3.2 GHz</div>
        </TCard>
        <TCard title="Memory">
          <div class="text-2xl font-bold text-ink">6.1 GB</div>
          <div class="text-xs text-ink-muted">of 16 GB used</div>
        </TCard>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TCard from './TCard.vue'

const state = reactive<{
  title: string
  noPadding: boolean
}>({
  title: 'Card title',
  noPadding: false,
})
</script>
