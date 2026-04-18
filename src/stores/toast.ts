import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

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

const DEFAULT_DURATION = 5000

export const useToastStore = defineStore('toast', () => {
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

  function remove(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clear() {
    toasts.value = []
  }

  // Convenience methods
  function success(message: string, title?: string, duration?: number) {
    return add({ type: 'success', message, title, duration })
  }

  function error(message: string, title?: string, duration?: number) {
    return add({ type: 'error', message, title, duration })
  }

  function warning(message: string, title?: string, duration?: number) {
    return add({ type: 'warning', message, title, duration })
  }

  function info(message: string, title?: string, duration?: number) {
    return add({ type: 'info', message, title, duration })
  }

  return {
    toasts,
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info,
  }
})
