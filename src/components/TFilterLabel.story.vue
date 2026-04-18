<template>
  <Story title="TFilterLabel" group="layout">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TFilterLabel :label="state.label" />
      </div>
    </Variant>

    <Variant title="Via slot">
      <div class="p-6 bg-bg flex items-center justify-center">
        <TFilterLabel>
          Custom Slot Content
        </TFilterLabel>
      </div>
    </Variant>

    <Variant title="In a filter row">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TFilterLabel label="Status" />
        <span class="text-sm text-ink">Active</span>
        <TFilterDivider />
        <TFilterLabel label="Tag" />
        <span class="text-sm text-ink">Production</span>
        <TFilterDivider />
        <TFilterLabel label="Sort" />
        <span class="text-sm text-ink">Newest first</span>
      </div>
    </Variant>

    <Variant title="With buttons">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TFilterLabel label="View as" />
        <TButton size="sm" variant="secondary" label="Grid" active />
        <TButton size="sm" variant="secondary" label="List" />
        <TFilterDivider />
        <TFilterLabel label="Group by" />
        <TButton size="sm" variant="ghost" label="Owner" icon-right icon="chevron-down" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TFilterLabel from './TFilterLabel.vue'
import TFilterDivider from './TFilterDivider.vue'
import TButton from './TButton.vue'

const state = reactive<{
  label: string
}>({
  label: 'Filter',
})
</script>
