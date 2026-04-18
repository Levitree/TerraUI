<template>
  <Story title="TSkeleton" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.width" title="Width (CSS)" />
        <HstText v-model="state.height" title="Height (CSS)" />
        <HstCheckbox v-model="state.circle" title="Circle" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TSkeleton
          :width="state.width || undefined"
          :height="state.height || undefined"
          :circle="state.circle"
        />
      </div>
    </Variant>

    <Variant title="Default (single line)">
      <div class="p-6 bg-bg w-full max-w-md">
        <TSkeleton />
      </div>
    </Variant>

    <Variant title="Text placeholder block">
      <div class="p-6 bg-bg w-full max-w-md flex flex-col gap-2">
        <TSkeleton width="40%" height="1rem" />
        <TSkeleton height="0.75rem" />
        <TSkeleton height="0.75rem" />
        <TSkeleton width="80%" height="0.75rem" />
      </div>
    </Variant>

    <Variant title="Rectangular blocks">
      <div class="p-6 bg-bg flex flex-wrap gap-3">
        <TSkeleton width="4rem" height="2rem" />
        <TSkeleton width="8rem" height="2rem" />
        <TSkeleton width="12rem" height="3rem" />
        <TSkeleton width="16rem" height="6rem" />
      </div>
    </Variant>

    <Variant title="Circle (avatar)">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TSkeleton circle width="1.25rem" height="1.25rem" />
        <TSkeleton circle width="1.75rem" height="1.75rem" />
        <TSkeleton circle width="2.5rem" height="2.5rem" />
        <TSkeleton circle width="3rem" height="3rem" />
        <TSkeleton circle width="4rem" height="4rem" />
      </div>
    </Variant>

    <Variant title="Card placeholder">
      <div class="p-6 bg-bg flex justify-center">
        <div class="w-80 border border-line rounded-sm bg-surface p-4 flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <TSkeleton circle width="2.5rem" height="2.5rem" />
            <div class="flex-1 flex flex-col gap-2">
              <TSkeleton width="60%" height="0.875rem" />
              <TSkeleton width="40%" height="0.75rem" />
            </div>
          </div>
          <TSkeleton height="8rem" />
          <div class="flex flex-col gap-2">
            <TSkeleton height="0.75rem" />
            <TSkeleton width="80%" height="0.75rem" />
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TSkeleton from './TSkeleton.vue'

const state = reactive<{
  width: string
  height: string
  circle: boolean
}>({
  width: '12rem',
  height: '1rem',
  circle: false,
})
</script>
