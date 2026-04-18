import { computed, markRaw, reactive, ref, type Component } from 'vue'

/**
 * A floating window in the windowing system. `type` is an arbitrary string key
 * — look up the renderer via {@link getWindowTypeConfig}. Kept open-ended so
 * apps can register their own window types alongside the built-ins shipped by
 * TerraUI.
 */
export interface WindowState {
  id: string
  type: string
  title: string
  deviceId?: string
  props?: Record<string, unknown>
  position: { x: number; y: number }
  size: { width: number; height: number }
  minimized: boolean
  zIndex: number
}

export interface WindowTypeConfig {
  /** Component rendered as the window body. */
  component: Component
  /** Default size if `openWindow` doesn't specify one. */
  defaultSize?: { width: number; height: number }
  /** Default title if `openWindow` doesn't specify one. */
  defaultTitle?: string
}

export interface OpenWindowOptions {
  deviceId?: string
  title?: string
  props?: Record<string, unknown>
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

// --- module-singleton state ------------------------------------------------

const windows = ref<WindowState[]>([])
let nextZIndex = 1000
let windowCounter = 0

const typeRegistry = new Map<string, WindowTypeConfig>()

const FALLBACK_SIZE = { width: 400, height: 300 }
const FALLBACK_TITLE = 'Window'

function getNextPosition(): { x: number; y: number } {
  const baseX = 100
  const baseY = 100
  const offset = 30
  const count = windows.value.length
  return {
    x: baseX + (count % 10) * offset,
    y: baseY + (count % 10) * offset,
  }
}

function generateId(): string {
  windowCounter++
  return `window-${Date.now()}-${windowCounter}`
}

function openWindow(type: string, options?: OpenWindowOptions): string {
  // Deduplicate by deviceId when provided — identical (type, deviceId)
  // pairs reuse the existing window instead of stacking.
  if (options?.deviceId) {
    const existing = windows.value.find((w) => w.type === type && w.deviceId === options.deviceId)
    if (existing) {
      bringToFront(existing.id)
      return existing.id
    }
  }

  const config = typeRegistry.get(type)
  const id = generateId()
  nextZIndex++
  windows.value.push({
    id,
    type,
    title: options?.title ?? config?.defaultTitle ?? FALLBACK_TITLE,
    deviceId: options?.deviceId,
    props: options?.props,
    position: options?.position ?? getNextPosition(),
    size: options?.size ?? config?.defaultSize ?? FALLBACK_SIZE,
    minimized: false,
    zIndex: nextZIndex,
  })
  return id
}

function closeWindow(id: string): void {
  const i = windows.value.findIndex((w) => w.id === id)
  if (i !== -1) windows.value.splice(i, 1)
}

function closeWindowsByType(type: string): void {
  windows.value = windows.value.filter((w) => w.type !== type)
}

function closeAll(): void {
  windows.value = []
}

function bringToFront(id: string): void {
  const win = windows.value.find((w) => w.id === id)
  if (win) {
    nextZIndex++
    win.zIndex = nextZIndex
    win.minimized = false
  }
}

function updatePosition(id: string, x: number, y: number): void {
  const win = windows.value.find((w) => w.id === id)
  if (win) win.position = { x, y }
}

function updateSize(id: string, width: number, height: number): void {
  const win = windows.value.find((w) => w.id === id)
  if (win) win.size = { width, height }
}

function toggleMinimize(id: string): void {
  const win = windows.value.find((w) => w.id === id)
  if (win) win.minimized = !win.minimized
}

function getWindow(id: string): WindowState | undefined {
  return windows.value.find((w) => w.id === id)
}

function hasWindowForDevice(type: string, deviceId: string): boolean {
  return windows.value.some((w) => w.type === type && w.deviceId === deviceId)
}

const openWindows = computed(() => windows.value)
const hasWindows = computed(() => windows.value.length > 0)

// Wrap in reactive() so refs auto-unwrap when accessed as properties.
const api = reactive({
  windows,
  openWindows,
  hasWindows,
  openWindow,
  closeWindow,
  closeWindowsByType,
  closeAll,
  bringToFront,
  updatePosition,
  updateSize,
  toggleMinimize,
  getWindow,
  hasWindowForDevice,
})

export type WindowManagerApi = typeof api

export function useWindowManager(): WindowManagerApi {
  return api
}

// --- registry --------------------------------------------------------------

/**
 * Register a window type. Host apps call this at startup (typically in
 * `main.ts` or inside the root component) so that `openWindow('my-type', ...)`
 * can resolve a renderer. TerraUI registers its built-in types automatically
 * when their modules are imported.
 */
export function registerWindowType(type: string, config: WindowTypeConfig): void {
  typeRegistry.set(type, { ...config, component: markRaw(config.component) })
}

export function registerWindowTypes(config: Record<string, WindowTypeConfig>): void {
  for (const [type, entry] of Object.entries(config)) {
    registerWindowType(type, entry)
  }
}

export function getWindowTypeConfig(type: string): WindowTypeConfig | undefined {
  return typeRegistry.get(type)
}
