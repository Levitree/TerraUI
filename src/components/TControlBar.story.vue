<template>
  <Story title="TControlBar" group="layout">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.position"
          title="Position"
          :options="['top', 'bottom']"
        />
        <HstCheckbox v-model="state.blur" title="Backdrop blur" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TControlBar :position="state.position" :blur="state.blur">
          <TButton size="sm" icon="plus" label="New" />
          <TButton size="sm" variant="secondary" icon="filter" label="Filter" />
          <TFilterDivider />
          <TFilterLabel label="Sort" />
          <TButton size="sm" variant="ghost" label="Newest" icon-right icon="chevron-down" />
          <TFilterDivider />
          <TButton size="sm" variant="ghost" icon="refresh-cw" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="Top position">
      <div class="p-6 bg-bg">
        <TControlBar position="top">
          <TButton size="sm" icon="arrow-left" variant="ghost" label="Back" />
          <TFilterDivider />
          <TFilterLabel label="View" />
          <TButton size="sm" variant="secondary" label="Grid" active />
          <TButton size="sm" variant="secondary" label="List" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="Bottom position">
      <div class="p-6 bg-bg">
        <TControlBar position="bottom">
          <span class="text-xs text-ink-muted">42 items</span>
          <TFilterDivider />
          <TButton size="sm" variant="ghost" icon="chevron-left" />
          <span class="text-xs text-ink">Page 1 of 5</span>
          <TButton size="sm" variant="ghost" icon="chevron-right" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="No blur">
      <div class="p-6 bg-bg">
        <TControlBar :blur="false">
          <TButton size="sm" icon="save" label="Save" />
          <TButton size="sm" variant="secondary" label="Cancel" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="Dense toolbar">
      <div class="p-6 bg-bg">
        <TControlBar>
          <TFilterLabel label="Filters" />
          <TButton size="sm" variant="secondary" label="Status" icon-right icon="chevron-down" />
          <TButton size="sm" variant="secondary" label="Owner" icon-right icon="chevron-down" />
          <TButton size="sm" variant="secondary" label="Tags" icon-right icon="chevron-down" />
          <TFilterDivider />
          <TButton size="sm" variant="ghost" icon="x" label="Clear" />
        </TControlBar>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TControlBar from './TControlBar.vue'
import TButton from './TButton.vue'
import TFilterDivider from './TFilterDivider.vue'
import TFilterLabel from './TFilterLabel.vue'

const state = reactive<{
  position: 'top' | 'bottom'
  blur: boolean
}>({
  position: 'bottom',
  blur: true,
})
</script>
