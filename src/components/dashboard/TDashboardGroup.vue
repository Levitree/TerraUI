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

// Initialize with deterministic defaults so server-render and initial client
// render agree. Real persisted values + viewport width are applied in
// onMounted to avoid hydration mismatches.
const hydrated = ref(false)
const sidebarOpen = ref(true)
const sidebarCollapsed = ref(props.defaultCollapsed)
const sidebarWidth = ref(props.defaultWidth)
const viewportWidth = ref(props.mobileBreakpoint)

const isMobile = computed(() => viewportWidth.value < props.mobileBreakpoint)

// On mobile, the sidebar starts closed. On desktop, always open.
// Not `immediate` — initial state is set in onMounted after hydration so the
// server's DOM (which assumes desktop) matches the client's first paint.
watch(isMobile, (mobile) => {
  sidebarOpen.value = !mobile
})

const syncViewport = () => {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  const persisted = readPersisted()
  if (typeof persisted.collapsed === 'boolean') {
    sidebarCollapsed.value = persisted.collapsed
  }
  if (typeof persisted.width === 'number') {
    sidebarWidth.value = persisted.width
  }
  viewportWidth.value = window.innerWidth
  sidebarOpen.value = !isMobile.value
  hydrated.value = true
  window.addEventListener('resize', syncViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport)
})

watch([sidebarWidth, sidebarCollapsed], ([width, collapsed]) => {
  if (typeof window === 'undefined') return
  if (!hydrated.value) return
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
