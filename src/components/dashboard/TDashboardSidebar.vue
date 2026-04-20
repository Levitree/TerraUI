<template>
  <!-- Desktop aside: in-flow sidebar, visible from `lg` breakpoint up. Hidden
       on narrower viewports via CSS so SSR markup is viewport-agnostic. -->
  <aside
    :id="id"
    :data-collapsed="collapsed"
    class="relative hidden lg:flex flex-col shrink-0 bg-chrome border-r border-line-subtle transition-[width] duration-200 h-full"
    :style="{ width: `${collapsed ? collapsedWidth : ctx.sidebarWidth.value}px` }"
    aria-label="Sidebar"
  >
    <div
      v-if="$slots.header"
      class="flex items-center gap-2 h-14 px-4 border-b border-line-subtle shrink-0"
      :class="ui?.header"
    >
      <slot name="header" :collapsed="collapsed" :mobile="false" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain" :class="ui?.body">
      <slot :collapsed="collapsed" :mobile="false" />
    </div>

    <div
      v-if="$slots.footer"
      class="border-t border-line-subtle shrink-0 px-2 py-2"
      :class="ui?.footer"
    >
      <slot name="footer" :collapsed="collapsed" :mobile="false" />
    </div>

    <div
      v-if="resizable && !collapsed"
      role="separator"
      aria-orientation="vertical"
      class="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-fill transition-colors"
      @mousedown.prevent="startResize"
    />
  </aside>

  <!-- Mobile slideover: the sidebar content rendered as a full-height overlay
       that slides in from the left. The auto-injected close button means the
       user never needs to rely on the backdrop tap alone. -->
  <TSlideover
    v-model:open="ctx.sidebarOpen.value"
    side="left"
    :size="`${ctx.sidebarWidth.value}px`"
    content-class="max-w-[85vw] lg:hidden"
  >
    <div
      class="flex items-center gap-2 h-14 px-4 border-b border-line-subtle shrink-0"
      :class="ui?.header"
    >
      <TDashboardSidebarCollapse size="sm" />
      <slot name="header" :collapsed="false" :mobile="true" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain" :class="ui?.body">
      <slot :collapsed="false" :mobile="true" />
    </div>

    <div
      v-if="$slots.footer"
      class="border-t border-line-subtle shrink-0 px-2 py-2"
      :class="ui?.footer"
    >
      <slot name="footer" :collapsed="false" :mobile="true" />
    </div>
  </TSlideover>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { DASHBOARD_CONTEXT_KEY } from './context'
import TDashboardSidebarCollapse from './TDashboardSidebarCollapse.vue'
import TSlideover from '../TSlideover.vue'

const props = withDefaults(
  defineProps<{
    id: string
    collapsible?: boolean
    resizable?: boolean
    minWidth?: number
    maxWidth?: number
    collapsedWidth?: number
    ui?: { header?: string; body?: string; footer?: string }
  }>(),
  {
    collapsible: true,
    resizable: true,
    minWidth: 220,
    maxWidth: 400,
    collapsedWidth: 64,
  },
)

const ctx = inject(DASHBOARD_CONTEXT_KEY)
if (!ctx) {
  throw new Error('TDashboardSidebar must be rendered inside TDashboardGroup')
}

const collapsed = computed(() => ctx.sidebarCollapsed.value)

let startX = 0
let startWidth = 0

const onMove = (e: MouseEvent) => {
  const delta = e.clientX - startX
  const next = Math.min(Math.max(startWidth + delta, props.minWidth), props.maxWidth)
  ctx.sidebarWidth.value = next
}

const onUp = () => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
  document.body.style.userSelect = ''
}

const startResize = (e: MouseEvent) => {
  if (!props.resizable) return
  startX = e.clientX
  startWidth = ctx.sidebarWidth.value
  document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
})
</script>
