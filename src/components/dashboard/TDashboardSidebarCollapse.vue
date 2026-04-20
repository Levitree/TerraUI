<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    :class="[
      'inline-flex items-center justify-center rounded-sm text-ink-muted hover:bg-fill hover:text-ink transition-colors',
      size === 'sm' ? 'w-7 h-7' : 'w-9 h-9',
    ]"
    @click="onClick"
  >
    <TIcon :name="iconName" :size="size" />
  </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import TIcon from '../TIcon.vue'
import { DASHBOARD_CONTEXT_KEY } from './context'

withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  {
    size: 'md',
  },
)

const ctx = inject(DASHBOARD_CONTEXT_KEY)
if (!ctx) {
  throw new Error('TDashboardSidebarCollapse must be rendered inside TDashboardGroup')
}

const iconName = computed(() => {
  if (ctx.isMobile.value) return ctx.sidebarOpen.value ? 'x' : 'menu'
  return ctx.sidebarCollapsed.value ? 'panel-left-open' : 'panel-left-close'
})

const ariaLabel = computed(() => {
  if (ctx.isMobile.value) return ctx.sidebarOpen.value ? 'Close menu' : 'Open menu'
  return ctx.sidebarCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar'
})

const onClick = () => {
  if (ctx.isMobile.value) ctx.toggleSidebar()
  else ctx.toggleCollapsed()
}
</script>
