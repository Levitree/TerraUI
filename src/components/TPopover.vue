<template>
  <div ref="rootRef" class="relative inline-block">
    <div
      ref="triggerRef"
      @click="onTriggerClick"
      @mouseenter="onTriggerEnter"
      @mouseleave="onTriggerLeave"
    >
      <slot name="trigger" :open="isOpen" :close="close" />
    </div>

    <Teleport to="body">
      <Transition name="tpopover">
        <div
          v-if="isOpen"
          ref="panelRef"
          role="dialog"
          :style="floatingStyles"
          :class="[
            'fixed z-50 max-w-[min(28rem,calc(100vw-1rem))] bg-elevated border border-line rounded-sm shadow-xl overflow-hidden',
            ui?.content,
          ]"
          @mouseenter="onPanelEnter"
          @mouseleave="onPanelLeave"
        >
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useAnchoredOverlay } from '../composables/useAnchoredOverlay'

export type TPopoverMode = 'click' | 'hover'

export interface TPopoverContent {
  /** Which side of the trigger the panel opens toward. Default 'bottom'. */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** Cross-axis edge alignment relative to the trigger. Default 'center'. */
  align?: 'start' | 'center' | 'end'
  /** Gap in px between trigger and panel. Default 6. */
  sideOffset?: number
}

const props = withDefaults(
  defineProps<{
    /** 'click' (default) toggles on click; 'hover' opens on pointer enter. */
    mode?: TPopoverMode
    /** Delay in ms before the hover-mode panel closes on pointer leave. */
    hoverCloseDelay?: number
    /** External open control. Omit to use uncontrolled state. */
    open?: boolean
    content?: TPopoverContent
    ui?: { content?: string }
  }>(),
  {
    mode: 'click',
    hoverCloseDelay: 120,
    content: () => ({ side: 'bottom', align: 'center' }),
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const internalOpen = ref(false)
const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

const { floatingStyles } = useAnchoredOverlay(triggerRef, panelRef, isOpen, {
  side: () => props.content?.side ?? 'bottom',
  align: () => props.content?.align ?? 'center',
  sideOffset: () => props.content?.sideOffset ?? 6,
})

watch(
  () => props.open,
  (value) => {
    if (typeof value === 'boolean') isOpen.value = value
  },
  { immediate: true },
)

watch(internalOpen, (value) => {
  if (typeof props.open !== 'boolean') isOpen.value = value
  emit('update:open', value)
})

const setOpen = (value: boolean) => {
  internalOpen.value = value
  if (typeof props.open === 'boolean') isOpen.value = value
}

const onTriggerClick = () => {
  if (props.mode !== 'click') return
  setOpen(!isOpen.value)
}

const clearHoverTimer = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

const onTriggerEnter = () => {
  if (props.mode !== 'hover') return
  clearHoverTimer()
  setOpen(true)
}

const onTriggerLeave = () => {
  if (props.mode !== 'hover') return
  hoverTimer = setTimeout(() => setOpen(false), props.hoverCloseDelay)
}

const onPanelEnter = () => {
  if (props.mode === 'hover') clearHoverTimer()
}

const onPanelLeave = () => {
  if (props.mode !== 'hover') return
  hoverTimer = setTimeout(() => setOpen(false), props.hoverCloseDelay)
}

const close = () => setOpen(false)

// Placement, flip/shift, and scroll/resize tracking are handled by
// useAnchoredOverlay; this component only owns open/close and dismiss.
const onDocumentClick = (event: MouseEvent) => {
  if (!isOpen.value || props.mode !== 'click') return
  const target = event.target as Node
  if (rootRef.value?.contains(target)) return
  if (panelRef.value?.contains(target)) return
  close()
}

const onEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentClick)
  document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentClick)
  document.removeEventListener('keydown', onEscape)
  clearHoverTimer()
})
</script>

<style scoped>
.tpopover-enter-active,
.tpopover-leave-active {
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
}
.tpopover-enter-from,
.tpopover-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>
