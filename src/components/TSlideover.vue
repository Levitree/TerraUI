<template>
  <Teleport to="body">
    <!-- Backdrop — fades in/out, separate Transition so Vue can track the
         transitionend on the backdrop itself. -->
    <Transition name="slideover-backdrop" appear>
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-overlay backdrop-blur-sm"
        @click="handleBackdropClick"
      />
    </Transition>

    <!-- Panel — slides in/out from the anchor side. The transition lives on
         the element that Vue's Transition tracks so transitionend fires
         correctly and Vue doesn't skip the leave animation. -->
    <Transition :name="transitionName" appear>
      <div
        v-if="open"
        ref="contentRef"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        class="fixed z-50"
        :class="contentClasses"
        :style="contentStyle"
        @keydown.esc="handleEscape"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

export type SlideoverSide = 'left' | 'right' | 'top' | 'bottom'

const props = withDefaults(
  defineProps<{
    open: boolean
    side?: SlideoverSide
    dismissible?: boolean
    /** Inline size (width for left/right, height for top/bottom). Accepts any CSS length. */
    size?: string
    /** Extra classes applied to the content surface (the slideover panel). */
    contentClass?: string
  }>(),
  {
    side: 'right',
    dismissible: true,
    size: undefined,
    contentClass: undefined,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const contentRef = ref<HTMLElement | null>(null)

const transitionName = computed(() => `slideover-${props.side}`)

const contentClasses = computed(() => {
  const base = [
    'flex flex-col bg-chrome shadow-2xl focus:outline-none overflow-hidden',
    props.contentClass,
  ]
  // Anchor to one edge + span the perpendicular axis; border sits on the
  // opposite edge so it reads as an inner divider.
  if (props.side === 'left') base.push('inset-y-0 left-0 border-r border-line-subtle')
  if (props.side === 'right') base.push('inset-y-0 right-0 border-l border-line-subtle')
  if (props.side === 'top') base.push('inset-x-0 top-0 border-b border-line-subtle')
  if (props.side === 'bottom') base.push('inset-x-0 bottom-0 border-t border-line-subtle')
  return base.filter(Boolean).join(' ')
})

const contentStyle = computed<Record<string, string> | undefined>(() => {
  if (!props.size) return undefined
  const isHorizontal = props.side === 'left' || props.side === 'right'
  const dim: Record<string, string> = {}
  dim[isHorizontal ? 'width' : 'height'] = props.size
  return dim
})

const close = () => {
  if (props.dismissible) emit('update:open', false)
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

const handleBackdropClick = () => {
  close()
}

// Lock body scroll while open. Guarded for SSR.
watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      nextTick(() => contentRef.value?.focus())
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

const globalEscapeHandler = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open && props.dismissible) close()
}

onMounted(() => {
  document.addEventListener('keydown', globalEscapeHandler)
})

onUnmounted(() => {
  document.removeEventListener('keydown', globalEscapeHandler)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<style scoped>
/* Backdrop fade */
.slideover-backdrop-enter-active,
.slideover-backdrop-leave-active {
  transition: opacity 200ms ease;
}
.slideover-backdrop-enter-from,
.slideover-backdrop-leave-to {
  opacity: 0;
}

/* Panel slide — one transition rule per side, both enter + leave. */
.slideover-left-enter-active,
.slideover-left-leave-active,
.slideover-right-enter-active,
.slideover-right-leave-active,
.slideover-top-enter-active,
.slideover-top-leave-active,
.slideover-bottom-enter-active,
.slideover-bottom-leave-active {
  transition: transform 200ms ease;
}

.slideover-left-enter-from,
.slideover-left-leave-to {
  transform: translateX(-100%);
}
.slideover-right-enter-from,
.slideover-right-leave-to {
  transform: translateX(100%);
}
.slideover-top-enter-from,
.slideover-top-leave-to {
  transform: translateY(-100%);
}
.slideover-bottom-enter-from,
.slideover-bottom-leave-to {
  transform: translateY(100%);
}
</style>
