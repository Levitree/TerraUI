<template>
  <div class="flex h-dvh w-full overflow-hidden bg-page text-ink">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { DASHBOARD_CONTEXT_KEY } from './context'

const props = withDefaults(
  defineProps<{
    /** Storage key for persisted sidebar width + collapsed state. */
    storageKey?: string
    /** Viewport breakpoint below which the sidebar behaves as a mobile overlay. */
    mobileBreakpoint?: number
    defaultWidth?: number
    defaultCollapsed?: boolean
  }>(),
  {
    storageKey: 'terraui.dashboard',
    mobileBreakpoint: 1024,
    defaultWidth: 260,
    defaultCollapsed: false,
  },
)

interface PersistedState {
  width?: number
  collapsed?: boolean
}

const readPersisted = (): PersistedState => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(props.storageKey)
    return raw ? (JSON.parse(raw) as PersistedState) : {}
  } catch {
    return {}
  }
}

const persisted = readPersisted()

const sidebarOpen = ref(true)
const sidebarCollapsed = ref(persisted.collapsed ?? props.defaultCollapsed)
const sidebarWidth = ref(persisted.width ?? props.defaultWidth)
const viewportWidth = ref(typeof window === 'undefined' ? 1920 : window.innerWidth)

const isMobile = computed(() => viewportWidth.value < props.mobileBreakpoint)

// On mobile, the sidebar starts closed. On desktop, always open.
watch(
  isMobile,
  (mobile) => {
    sidebarOpen.value = !mobile
  },
  { immediate: true },
)

const syncViewport = () => {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', syncViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport)
})

watch([sidebarWidth, sidebarCollapsed], ([width, collapsed]) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      props.storageKey,
      JSON.stringify({ width, collapsed } satisfies PersistedState),
    )
  } catch {
    // Storage may be unavailable (private mode, quota); drop the write silently.
  }
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleCollapsed = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

provide(DASHBOARD_CONTEXT_KEY, {
  sidebarOpen,
  sidebarCollapsed,
  sidebarWidth,
  isMobile,
  toggleSidebar,
  toggleCollapsed,
})
</script>
