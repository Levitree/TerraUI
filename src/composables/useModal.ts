import { markRaw, ref, type Component, type Ref } from 'vue'

export interface ModalHandle<TResult = void> {
  isOpen: Ref<boolean>
  /**
   * Open the modal with an optional props bag. Returns a promise that resolves
   * with whatever `close()` is called with, or `undefined` if the consumer
   * dismisses via `v-model:open="false"`.
   */
  open: (props?: Record<string, unknown>) => Promise<TResult | undefined>
  close: (result?: TResult) => void
  component: Component
  props: Ref<Record<string, unknown>>
}

/**
 * Lightweight modal orchestration. Decouples "should the modal be mounted"
 * from "which component/props/promise does it resolve to" so callers can do:
 *
 *   const deleteModal = useModal<boolean>(DeleteRoleModal)
 *   const confirmed = await deleteModal.open({ role })
 *
 * The consumer still renders the modal once in its template, wired to
 * `component`, `props`, and `isOpen`; calling `close(result)` dismisses it and
 * resolves the outstanding `open()` promise with `result`.
 */
export function useModal<TResult = void>(component: Component): ModalHandle<TResult> {
  const isOpen = ref(false)
  const props = ref<Record<string, unknown>>({})
  let resolver: ((value: TResult | undefined) => void) | null = null

  function open(initialProps: Record<string, unknown> = {}) {
    props.value = initialProps
    isOpen.value = true
    return new Promise<TResult | undefined>((resolve) => {
      resolver = resolve
    })
  }

  function close(result?: TResult) {
    isOpen.value = false
    const pending = resolver
    resolver = null
    pending?.(result)
  }

  return {
    isOpen,
    open,
    close,
    component: markRaw(component),
    props,
  }
}
