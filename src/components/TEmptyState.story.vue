<template>
  <Story title="TEmptyState" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.icon" title="Icon (lucide name)" />
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.hint" title="Hint" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TEmptyState
          :icon="state.icon || undefined"
          :title="state.title || undefined"
          :hint="state.hint || undefined"
          :size="state.size"
        />
      </div>
    </Variant>

    <Variant title="No data">
      <div class="p-6 bg-bg">
        <TEmptyState
          icon="inbox"
          title="No items yet"
          hint="Items you create will appear here."
        />
      </div>
    </Variant>

    <Variant title="No search results">
      <div class="p-6 bg-bg">
        <TEmptyState
          icon="search-x"
          title="No results"
          hint="Try a different query or clear your filters."
        />
      </div>
    </Variant>

    <Variant title="Error">
      <div class="p-6 bg-bg">
        <TEmptyState
          icon="alert-triangle"
          title="Something went wrong"
          hint="We couldn't load this resource. Please try again in a moment."
        />
      </div>
    </Variant>

    <Variant title="With action">
      <div class="p-6 bg-bg">
        <TEmptyState
          icon="rocket"
          title="No deployments"
          hint="Ship your first deployment to get started."
        >
          <template #actions>
            <button
              class="px-3 py-1.5 text-xs font-bold tracking-wider uppercase border border-line rounded-sm bg-fill-subtle hover:bg-fill text-ink"
            >
              Deploy
            </button>
            <button
              class="px-3 py-1.5 text-xs font-bold tracking-wider uppercase border border-line-subtle rounded-sm hover:bg-fill-subtle text-ink-secondary"
            >
              Read docs
            </button>
          </template>
        </TEmptyState>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TEmptyState size="sm" icon="inbox" title="Small" hint="Compact padding" />
        <TEmptyState size="md" icon="inbox" title="Medium" hint="Default padding" />
        <TEmptyState size="lg" icon="inbox" title="Large" hint="Roomy padding" />
      </div>
    </Variant>

    <Variant title="Minimal">
      <div class="p-6 bg-bg">
        <TEmptyState title="Nothing here" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TEmptyState from './TEmptyState.vue'

const state = reactive<{
  icon: string
  title: string
  hint: string
  size: 'sm' | 'md' | 'lg'
}>({
  icon: 'inbox',
  title: 'No items',
  hint: 'Items you create will appear here.',
  size: 'md',
})
</script>
