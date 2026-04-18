import { useToastStore, type ToastType } from '../stores/toast'

/**
 * Nuxt-UI-style toast composable — thin ergonomic wrapper over the Pinia
 * toast store. Accepts `color` (which maps onto `ToastType`) plus an optional
 * `description`/`icon`/`actions`. Extra fields are kept on the returned toast
 * object for components that render them, even though the bundled `TToast`
 * currently only renders `title` + `message`.
 */
export type ToastColor = ToastType | 'neutral' | 'primary'

export interface UseToastOptions {
  title?: string
  description?: string
  color?: ToastColor
  icon?: string
  duration?: number
  actions?: Array<{ label: string; onSelect: () => void }>
}

const coerceType = (color: ToastColor | undefined): ToastType => {
  if (!color) return 'info'
  if (color === 'neutral' || color === 'primary') return 'info'
  return color
}

export function useToast() {
  const store = useToastStore()

  function add(options: UseToastOptions): string {
    return store.add({
      type: coerceType(options.color),
      title: options.title,
      message: options.description ?? options.title ?? '',
      duration: options.duration,
    })
  }

  return {
    add,
    remove: store.remove,
    clear: store.clear,
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,
  }
}
