<template>
  <!-- Mobile overlay backdrop -->
  <div
    v-if="ctx.isMobile.value && ctx.sidebarOpen.value"
    class="fixed inset-0 z-40 bg-overlay backdrop-blur-sm md:hidden"
    @click="ctx.toggleSidebar"
  />

  <aside
    :id="id"
    :data-collapsed="collapsed"
    :class="asideClasses"
    :style="asideStyle"
    aria-label="Sidebar"
  >
    <div
      v-if="$slots.header || ctx.isMobile.value"
      class="flex items-center gap-2 h-14 px-4 border-b border-line-subtle shrink-0"
      :class="ui?.header"
    >
      <!-- Mobile slideover gets an auto-injected close button so the user can
           dismiss the overlay without relying on the backdrop tap or the
           navbar hamburger that the slideover now covers. -->
      <TDashboardSidebarCollapse v-if="ctx.isMobile.value" />
      <slot name="header" :collapsed="collapsed" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain" :class="ui?.body">
      <slot :collapsed="collapsed" />
    </div>

    <div
      v-if="$slots.footer"
      class="border-t border-line-subtle shrink-0 px-2 py-2"
      :class="ui?.footer"
    >
      <slot name="footer" :collapsed="collapsed" />
    </div>

    <!-- Desktop resize handle -->
    <div
      v-if="resizable && !ctx.isMobile.value && !collapsed"
      role="separator"
      aria-orientation="vertical"
      class="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-fill transition-colors"
      @mousedown.prevent="startResize"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { DASHBOARD_CONTEXT_KEY } from './context'
import TDashboardSidebarCollapse from './TDashboardSidebarCollapse.vue'

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
    minWidth: 200,
    maxWidth: 400,
    collapsedWidth: 64,
  },
)

const ctx = inject(DASHBOARD_CONTEXT_KEY)
if (!ctx) {
  throw new Error('TDashboardSidebar must be rendered inside TDashboardGroup')
}

const collapsed = computed(() => !ctx.isMobile.value && ctx.sidebarCollapsed.value)

const asideStyle = computed(() => {
  if (ctx.isMobile.value) return undefined
  return { width: `${collapsed.value ? props.collapsedWidth : ctx.sidebarWidth.value}px` }
})

const asideClasses = computed(() => {
  // `relative` and `fixed` both emit `position: *` single-class rules at
  // identical specificity, so cascade order decides the winner. In Tailwind
  // v4's generated CSS `.relative` comes AFTER `.fixed`, which means putting
  // `relative` in the shared base would override the mobile `fixed`, keep the
  // aside in the flex flow, and leave a stuck empty rail on mobile. Scope
  // `relative` to the desktop branch so `fixed` wins on mobile.
  const base = [
    'flex flex-col shrink-0 bg-chrome border-r border-line-subtle transition-[transform,width] duration-200',
  ]
  if (ctx.isMobile.value) {
    base.push('fixed inset-y-0 left-0 z-50 w-64')
    base.push(ctx.sidebarOpen.value ? 'translate-x-0' : '-translate-x-full')
  } else {
    base.push('relative h-full')
  }
  return base.join(' ')
})

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
