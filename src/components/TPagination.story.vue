<template>
  <Story title="TPagination" group="layout-navigation">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.total" title="Total items" />
        <HstNumber v-model="state.perPage" title="Per page" />
        <HstNumber v-model="state.siblingCount" title="Sibling count" />
        <HstText v-model="state.itemLabel" title="Item label" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.showEdges" title="Show edge arrows" />
        <HstCheckbox v-model="state.showSummary" title="Show summary" />
      </template>

      <div class="p-6 bg-bg">
        <TPagination
          v-model:page="state.page"
          v-model:per-page="state.perPage"
          :total="state.total"
          :sibling-count="state.siblingCount"
          :item-label="state.itemLabel"
          :size="state.size"
          :show-edges="state.showEdges"
          :show-summary="state.showSummary"
        />
        <p class="mt-4 text-xs text-ink-muted">
          Page: {{ state.page }} · Per page: {{ state.perPage }}
        </p>
      </div>
    </Variant>

    <Variant title="Few pages">
      <div class="p-6 bg-bg">
        <TPagination :page="2" :total="30" :per-page="10" item-label="device" />
      </div>
    </Variant>

    <Variant title="Many pages (with ellipsis)">
      <div class="p-6 bg-bg">
        <TPagination :page="7" :total="1248" :per-page="25" item-label="device" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-6">
        <TPagination :page="3" :total="120" :per-page="10" size="sm" />
        <TPagination :page="3" :total="120" :per-page="10" size="md" />
        <TPagination :page="3" :total="120" :per-page="10" size="lg" />
      </div>
    </Variant>

    <Variant title="Without summary or selector">
      <div class="p-6 bg-bg">
        <TPagination
          :page="5"
          :total="200"
          :per-page="10"
          :show-summary="false"
          :page-sizes="[]"
        />
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
  perPage: number
  siblingCount: number
  itemLabel: string
  size: TPaginationSize
  showEdges: boolean
  showSummary: boolean
}>({
  page: 4,
  total: 1248,
  perPage: 25,
  siblingCount: 1,
  itemLabel: 'device',
  size: 'md',
  showEdges: true,
  showSummary: true,
})
</script>
