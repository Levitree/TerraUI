<template>
  <Teleport to="body">
    <div
      v-if="internalOpen"
      ref="windowEl"
      class="fixed bg-chrome backdrop-blur-sm border border-line rounded-sm shadow-2xl flex flex-col"
      :style="windowStyle"
      @pointerdown="bringToFront"
    >
      <!-- Header (draggable) -->
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-line-subtle bg-fill-subtle cursor-move select-none shrink-0 touch-none"
        @pointerdown.stop="startDrag"
      >
        <span class="text-sm font-bold tracking-wider uppercase text-ink">
          <slot name="title">{{ title }}</slot>
        </span>
        <div class="flex items-center gap-1">
          <button
            v-if="minimizable"
            class="flex items-center justify-center w-6 h-6 rounded-sm text-ink-muted hover:text-ink hover:bg-fill transition-colors"
            @click.stop="toggleMinimize"
          >
            <TIcon :name="minimized ? 'maximize-2' : 'minus'" size="sm" />
          </button>
          <button
            class="flex items-center justify-center w-6 h-6 rounded-sm text-ink-muted hover:text-ink hover:bg-fill transition-colors"
            @click.stop="close"
          >
            <TIcon name="x" size="sm" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-show="!minimized" class="flex-1 overflow-auto overscroll-contain">
        <slot />
      </div>

      <!-- Footer (optional) -->
      <div
        v-if="!minimized && $slots.footer"
        class="shrink-0 px-4 py-3 border-t border-line-subtle bg-fill-subtle flex items-center gap-2"
      >
        <slot name="footer" />
      </div>

      <!-- Resize handle -->
      <div
        v-if="resizable && !minimized"
        class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-30 hover:opacity-60 transition-opacity touch-none"
        @pointerdown.stop="startResize"
      >
        <svg class="w-full h-full text-ink-muted" viewBox="0 0 16 16" fill="currentColor">
          <path d="M14 14H10V10L14 14ZM14 14H14V6L6 14H14Z" />
        </svg>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import TIcon from './TIcon.vue'

interface Props {
  open: boolean
  title?: string
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
  resizable?: boolean
  minimizable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Window',
  initialX: 100,
  initialY: 100,
  initialWidth: 400,
  initialHeight: 300,
  minWidth: 200,
  minHeight: 150,
  resizable: true,
  minimizable: true,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  move: [x: number, y: number]
  resize: [width: number, height: number]
  focus: []
}>()

// Internal state
const windowEl = ref<HTMLDivElement | null>(null)
const position = ref({ x: props.initialX, y: props.initialY })
const size = ref({ width: props.initialWidth, height: props.initialHeight })
const minimized = ref(false)
const zIndex = ref(1000)

// Dragging state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// Resizing state
const isResizing = ref(false)
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

// Two-way binding for open
const internalOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

// Computed window style
const windowStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  width: minimized.value ? 'auto' : `${size.value.width}px`,
  height: minimized.value ? 'auto' : `${size.value.height}px`,
  zIndex: zIndex.value,
}))

// Z-index management (static counter shared across instances)
let nextZIndex = 1000

const bringToFront = () => {
  nextZIndex++
  zIndex.value = nextZIndex
  emit('focus')
}

const close = () => {
  internalOpen.value = false
}

const toggleMinimize = () => {
  minimized.value = !minimized.value
}

// Drag handlers
const startDrag = (event: PointerEvent) => {
  if (!windowEl.value) return
  // Ignore pointerdowns that bubbled up from the header's buttons (minimize,
  // close). Otherwise `setPointerCapture` on the header swallows the pending
  // click and the buttons appear dead.
  if ((event.target as HTMLElement | null)?.closest('button')) return

  isDragging.value = true
  dragOffset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y,
  }

  const target = event.currentTarget as HTMLElement | null
  target?.setPointerCapture?.(event.pointerId)

  document.addEventListener('pointermove', onDrag)
  document.addEventListener('pointerup', stopDrag)
  document.addEventListener('pointercancel', stopDrag)

  event.preventDefault()
}

const onDrag = (event: PointerEvent) => {
  if (!isDragging.value) return

  const newX = Math.max(0, Math.min(window.innerWidth - 100, event.clientX - dragOffset.value.x))
  const newY = Math.max(0, Math.min(window.innerHeight - 50, event.clientY - dragOffset.value.y))

  position.value = { x: newX, y: newY }
  emit('move', newX, newY)
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('pointermove', onDrag)
  document.removeEventListener('pointerup', stopDrag)
  document.removeEventListener('pointercancel', stopDrag)
}

// Resize handlers
const startResize = (event: PointerEvent) => {
  if (!windowEl.value) return

  isResizing.value = true
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: size.value.width,
    height: size.value.height,
  }

  const target = event.currentTarget as HTMLElement | null
  target?.setPointerCapture?.(event.pointerId)

  document.addEventListener('pointermove', onResize)
  document.addEventListener('pointerup', stopResize)
  document.addEventListener('pointercancel', stopResize)

  event.preventDefault()
}

const onResize = (event: PointerEvent) => {
  if (!isResizing.value) return

  const deltaX = event.clientX - resizeStart.value.x
  const deltaY = event.clientY - resizeStart.value.y

  const newWidth = Math.max(props.minWidth, resizeStart.value.width + deltaX)
  const newHeight = Math.max(props.minHeight, resizeStart.value.height + deltaY)

  size.value = { width: newWidth, height: newHeight }
  emit('resize', newWidth, newHeight)
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('pointermove', onResize)
  document.removeEventListener('pointerup', stopResize)
  document.removeEventListener('pointercancel', stopResize)
}

// Reset position/size when props change
watch(
  () => props.initialX,
  (x) => {
    position.value.x = x
  },
)
watch(
  () => props.initialY,
  (y) => {
    position.value.y = y
  },
)
watch(
  () => props.initialWidth,
  (w) => {
    size.value.width = w
  },
)
watch(
  () => props.initialHeight,
  (h) => {
    size.value.height = h
  },
)

// Bring to front when opened
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      bringToFront()
      minimized.value = false
    }
  },
)

// Cleanup
onBeforeUnmount(() => {
  document.removeEventListener('pointermove', onDrag)
  document.removeEventListener('pointerup', stopDrag)
  document.removeEventListener('pointercancel', stopDrag)
  document.removeEventListener('pointermove', onResize)
  document.removeEventListener('pointerup', stopResize)
  document.removeEventListener('pointercancel', stopResize)
})
</script>
