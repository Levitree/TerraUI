<template>
  <div class="flex items-center gap-4">
    <div class="flex flex-wrap gap-2.5 flex-1 max-md:flex-nowrap">
      <TButton
        v-for="item in items"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        variant="secondary"
        :active="item.active"
        size="sm"
        class="max-md:flex-1"
        @click="handleItem(item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import TButton from './TButton.vue'
import type { SubnavItem } from '../types/navigation'

const props = defineProps<{
  items: SubnavItem[]
  /**
   * Optional transform applied to `item.to` before navigating. Lets the host
   * app namespace paths (e.g. prefix with a device UUID) without TerraUI
   * knowing about routing specifics.
   */
  pathBuilder?: (to: string) => string
}>()

const router = useRouter()

const handleItem = (item: SubnavItem) => {
  if (item.action) {
    item.action()
    return
  }

  if (item.to) {
    const target = props.pathBuilder ? props.pathBuilder(item.to) : item.to
    router.push(target)
  }
}
</script>
