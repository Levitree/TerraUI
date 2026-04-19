import { reactive, ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastColor = ToastType | 'neutral' | 'primary'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration: number
}

export interface ToastOptions {
  type?: ToastType
  title?: string
  message: string
  duration?: number
}

export interface UseToastOptions {
  title?: string
  description?: string
  color?: ToastColor
  icon?: string
  duration?: number
  actions?: Array<{ label: string; onSelect: () => void }>
}

const DEFAULT_DURATION = 5000

// --- module-singleton state ------------------------------------------------

const toasts = ref<Toast[]>([])

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function add(options: ToastOptions): string {
  const id = generateId()
  const toast: Toast = {
    id,
    type: options.type ?? 'info',
    title: options.title,
    message: options.message,
    duration: options.duration ?? DEFAULT_DURATION,
  }

  toasts.value.push(toast)

  if (toast.duration > 0) {
    setTimeout(() => {
      remove(id)
    }, toast.duration)
  }

  return id
}

function remove(id: string): void {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

function clear(): void {
  toasts.value = []
}

function success(message: string, title?: string, duration?: number): string {
  return add({ type: 'success', message, title, duration })
}

function error(message: string, title?: string, duration?: number): string {
  return add({ type: 'error', message, title, duration })
}

function warning(message: string, title?: string, duration?: number): string {
  return add({ type: 'warning', message, title, duration })
}

function info(message: string, title?: string, duration?: number): string {
  return add({ type: 'info', message, title, duration })
}

const coerceType = (color: ToastColor | undefined): ToastType => {
  if (!color) return 'info'
  if (color === 'neutral' || color === 'primary') return 'info'
  return color
}

function addFromUseToast(options: UseToastOptions): string {
  return add({
    type: coerceType(options.color),
    title: options.title,
    message: options.description ?? options.title ?? '',
    duration: options.duration,
  })
}

const api = reactive({
  toasts,
  add: addFromUseToast,
  remove,
  clear,
  success,
  error,
  warning,
  info,
})

export type UseToastReturn = typeof api

export function useToast(): UseToastReturn {
  return api
}
