<template>
  <Story title="TPagination" group="layout-navigation">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.total" title="Total items" />
        <HstNumber v-model="state.itemsPerPage" title="Items per page" />
        <HstNumber v-model="state.siblingCount" title="Sibling count" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.showEdges" title="Show edge arrows" />
      </template>

      <div class="p-6 bg-bg">
        <TPagination
          v-model:page="state.page"
          :total="state.total"
          :items-per-page="state.itemsPerPage"
          :sibling-count="state.siblingCount"
          :size="state.size"
          :show-edges="state.showEdges"
        />
        <p class="mt-4 text-xs text-ink-muted">Page: {{ state.page }}</p>
      </div>
    </Variant>

    <Variant title="Few pages">
      <div class="p-6 bg-bg">
        <TPagination :page="2" :total="30" :items-per-page="10" />
      </div>
    </Variant>

    <Variant title="Many pages (with ellipsis)">
      <div class="p-6 bg-bg">
        <TPagination :page="7" :total="500" :items-per-page="10" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TPagination :page="3" :total="120" :items-per-page="10" size="sm" />
        <TPagination :page="3" :total="120" :items-per-page="10" size="md" />
        <TPagination :page="3" :total="120" :items-per-page="10" size="lg" />
      </div>
    </Variant>

    <Variant title="Without edge arrows">
      <div class="p-6 bg-bg">
        <TPagination :page="5" :total="200" :items-per-page="10" :show-edges="false" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TPagination from './TPagination.vue'
import type { TPaginationSize } from './TPagination.vue'

const state = reactive<{
  page: number
  total: number
  itemsPerPage: number
  siblingCount: number
  size: TPaginationSize
  showEdges: boolean
}>({
  page: 4,
  total: 250,
  itemsPerPage: 10,
  siblingCount: 1,
  size: 'md',
  showEdges: true,
})
</script>
