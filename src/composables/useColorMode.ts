import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'

/**
 * Lightweight color-mode store shared by TerraUI consumers.
 *
 * TerraUI token CSS (`src/styles/tokens/colors.css`) keys off the
 * `data-theme` attribute on `<html>`:
 *   - no attribute → follow `prefers-color-scheme` (system preference)
 *   - `data-theme="light"` → force light
 *   - `data-theme="dark"`  → force dark
 *
 * The user's choice is persisted to localStorage under `preferences.theme`
 * with values `auto` | `light` | `dark`. Call `initializeColorMode()` once
 * at startup (before mount) to avoid a flash of the wrong theme.
 */

export type ColorMode = 'auto' | 'light' | 'dark'
export type ResolvedColorMode = 'light' | 'dark'

const STORAGE_KEY = 'preferences.theme'

function readStoredPreference(): ColorMode {
  if (typeof localStorage === 'undefined') return 'auto'
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

function resolveSystemPreference(): ResolvedColorMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyToDocument(preference: ColorMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (preference === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', preference)
}

// Module-level singletons so every caller observes the same reactive state.
const preference: Ref<ColorMode> = ref(readStoredPreference())
const systemPreference: Ref<ResolvedColorMode> = ref(resolveSystemPreference())

let listenersAttached = false
function attachListenersOnce(): void {
  if (listenersAttached) return
  if (typeof window === 'undefined' || !window.matchMedia) return

  const mql = window.matchMedia('(prefers-color-scheme: light)')
  const onChange = (e: MediaQueryListEvent) => {
    systemPreference.value = e.matches ? 'light' : 'dark'
  }
  mql.addEventListener('change', onChange)

  // Keep tabs in sync when the user changes their preference elsewhere.
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      const next = readStoredPreference()
      if (next !== preference.value) preference.value = next
    })
  }

  listenersAttached = true
}

// Persist + apply whenever the preference changes (writes from setPreference
// or direct mutation both flow through here).
watch(
  preference,
  (next) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* localStorage unavailable (e.g. Safari private) — DOM still gets updated */
      }
    }
    applyToDocument(next)
  },
  { flush: 'sync' },
)

/**
 * Apply the stored preference to `<html>` immediately. Call this from
 * `main.ts` (or a Nuxt client plugin) before the app mounts so there's no
 * flash of the wrong theme on first paint.
 */
export function initializeColorMode(): void {
  attachListenersOnce()
  applyToDocument(preference.value)
}

export interface UseColorModeReturn {
  /** User preference — writable. Assigning to it persists + re-applies. */
  preference: Ref<ColorMode>
  /** Resolved mode actually applied (`auto` collapsed to light/dark). */
  value: ComputedRef<ResolvedColorMode>
  /** Explicit setter — equivalent to `preference.value = next`. */
  setPreference: (next: ColorMode) => void
}

export function useColorMode(): UseColorModeReturn {
  attachListenersOnce()

  const value = computed<ResolvedColorMode>(() =>
    preference.value === 'auto' ? systemPreference.value : preference.value,
  )

  function setPreference(next: ColorMode): void {
    preference.value = next
  }

  return { preference, value, setPreference }
}
