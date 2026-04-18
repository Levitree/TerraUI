<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @keydown.esc="handleEscape"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-overlay backdrop-blur-sm" @click="handleBackdropClick" />

        <!-- Modal -->
        <div
          ref="modalRef"
          role="dialog"
          aria-modal="true"
          :class="[
            'relative flex flex-col bg-chrome backdrop-blur-sm border border-line rounded-sm shadow-2xl overflow-hidden',
            modalClasses,
          ]"
        >
          <!-- Full-content override: callers pass a custom shell (e.g. a TCard). -->
          <template v-if="$slots.content">
            <slot name="content" />
          </template>
          <template v-else>
            <!-- Header -->
            <div class="px-6 py-4 border-b border-line-subtle bg-fill-subtle">
              <slot name="header">
                <div class="flex items-center justify-between w-full">
                  <h3 class="text-lg font-bold tracking-wide uppercase text-ink">
                    {{ title }}
                  </h3>
                  <button
                    v-if="dismissible"
                    @click="close"
                    class="flex items-center justify-center w-8 h-8 rounded-sm text-ink-muted hover:text-ink hover:bg-fill transition-all"
                  >
                    <TIcon name="x" size="sm" />
                  </button>
                </div>
              </slot>
            </div>

            <!-- Body content -->
            <div class="px-6 py-6 overflow-y-auto flex-1">
              <slot name="body">
                <slot />
              </slot>
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-line-subtle bg-fill-subtle flex gap-3"
            >
              <slot name="footer" />
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import TIcon from './TIcon.vue'

interface ModalProps {
  open: boolean
  title?: string
  dismissible?: boolean
  fullscreen?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<ModalProps>(), {
  dismissible: true,
  size: 'md',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const modalRef = ref<HTMLElement | null>(null)

const close = () => {
  if (props.dismissible) {
    emit('update:open', false)
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.dismissible) {
    close()
  }
}

const handleBackdropClick = () => {
  if (props.dismissible) {
    close()
  }
}

// Lock body scroll when modal is open. Guarded against SSR where `document`
// is not available; immediate:true would otherwise throw during server render.
watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        modalRef.value?.focus()
      })
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

// Global escape key handler
const globalEscapeHandler = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open && props.dismissible) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', globalEscapeHandler)
})

onUnmounted(() => {
  document.removeEventListener('keydown', globalEscapeHandler)
  document.body.style.overflow = ''
})

const modalClasses = computed(() => {
  if (props.fullscreen) return 'w-screen h-screen max-w-none max-h-none'

  switch (props.size) {
    case 'sm':
      return 'w-full max-w-md max-h-[90vh]'
    case 'lg':
      return 'w-full max-w-4xl max-h-[90vh]'
    case 'xl':
      return 'w-full max-w-6xl max-h-[90vh]'
    default:
      return 'w-full max-w-2xl max-h-[90vh]'
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
