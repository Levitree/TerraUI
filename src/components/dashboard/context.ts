import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface DashboardContext {
  /** Whether the sidebar is currently visible. Always true on desktop; toggleable on mobile. */
  sidebarOpen: Ref<boolean>
  /** Desktop-only: whether the sidebar is collapsed to its icon-rail width. */
  sidebarCollapsed: Ref<boolean>
  /** Current sidebar width in px (desktop). Persisted to localStorage. */
  sidebarWidth: Ref<number>
  /** True when viewport is below the mobile breakpoint (default <1024px). */
  isMobile: ComputedRef<boolean>
  toggleSidebar: () => void
  toggleCollapsed: () => void
}

export const DASHBOARD_CONTEXT_KEY: InjectionKey<DashboardContext> = Symbol('TerraUI:Dashboard')
