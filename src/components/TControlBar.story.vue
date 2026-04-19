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
          <TButton size="sm" color="neutral" icon="filter" label="Filter" />
          <TSeparator orientation="vertical" class="h-5" />
          <TFilterLabel label="Sort" />
          <TButton size="sm" color="ghost" label="Newest" icon-right icon="chevron-down" />
          <TSeparator orientation="vertical" class="h-5" />
          <TButton size="sm" color="ghost" icon="refresh-cw" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="Top position">
      <div class="p-6 bg-bg">
        <TControlBar position="top">
          <TButton size="sm" icon="arrow-left" color="ghost" label="Back" />
          <TSeparator orientation="vertical" class="h-5" />
          <TFilterLabel label="View" />
          <TButton size="sm" color="neutral" label="Grid" active />
          <TButton size="sm" color="neutral" label="List" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="Bottom position">
      <div class="p-6 bg-bg">
        <TControlBar position="bottom">
          <span class="text-xs text-ink-muted">42 items</span>
          <TSeparator orientation="vertical" class="h-5" />
          <TButton size="sm" color="ghost" icon="chevron-left" />
          <span class="text-xs text-ink">Page 1 of 5</span>
          <TButton size="sm" color="ghost" icon="chevron-right" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="No blur">
      <div class="p-6 bg-bg">
        <TControlBar :blur="false">
          <TButton size="sm" icon="save" label="Save" />
          <TButton size="sm" color="neutral" label="Cancel" />
        </TControlBar>
      </div>
    </Variant>

    <Variant title="Dense toolbar">
      <div class="p-6 bg-bg">
        <TControlBar>
          <TFilterLabel label="Filters" />
          <TButton size="sm" color="neutral" label="Status" icon-right icon="chevron-down" />
          <TButton size="sm" color="neutral" label="Owner" icon-right icon="chevron-down" />
          <TButton size="sm" color="neutral" label="Tags" icon-right icon="chevron-down" />
          <TSeparator orientation="vertical" class="h-5" />
          <TButton size="sm" color="ghost" icon="x" label="Clear" />
        </TControlBar>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TControlBar from './TControlBar.vue'
import TButton from './TButton.vue'
import TSeparator from './TSeparator.vue'
import TFilterLabel from './TFilterLabel.vue'

const state = reactive<{
  position: 'top' | 'bottom'
  blur: boolean
}>({
  position: 'bottom',
  blur: true,
})
</script>
