<template>
  <nav :class="['flex', orientation === 'vertical' ? 'flex-col gap-0.5' : 'flex-row gap-1']">
    <template v-for="(group, groupIdx) in groupedItems" :key="groupIdx">
      <div v-if="groupIdx > 0" class="my-2 h-px bg-line-subtle" role="separator" />
      <NavItemRenderer
        v-for="item in group"
        :key="item.label"
        :item="item"
        :collapsed="collapsed"
      />
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NavItemRenderer from './internal/NavItemRenderer.vue'

export interface NavItem {
  label: string
  icon?: string
  to?: string
  onSelect?: () => void
  badge?: string | number
  disabled?: boolean
  tooltip?: { text: string }
  collapsible?: boolean
  defaultOpen?: boolean
  children?: NavItem[]
  exact?: boolean
}

const props = withDefaults(
  defineProps<{
    items: NavItem[] | NavItem[][]
    collapsed?: boolean
    orientation?: 'vertical' | 'horizontal'
  }>(),
  {
    collapsed: false,
    orientation: 'vertical',
  },
)

const groupedItems = computed<NavItem[][]>(() => {
  if (props.items.length === 0) return []
  return Array.isArray(props.items[0]) ? (props.items as NavItem[][]) : [props.items as NavItem[]]
})
</script>
