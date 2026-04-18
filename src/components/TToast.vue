<template>
  <div
    :class="toastClasses"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    @click="$emit('close')"
  >
    <div class="flex items-start gap-3">
      <div :class="iconContainerClasses">
        <TIcon :name="iconName" :class="iconColorClass" size="xs" />
      </div>
      <div class="flex flex-col min-w-0 flex-1">
        <div v-if="title" class="text-xs font-bold tracking-wider uppercase text-ink mb-1">
          {{ title }}
        </div>
        <div class="text-sm text-ink-secondary leading-relaxed">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import TIcon from './TIcon.vue'
import type { ToastType } from '../stores/toast'

const props = defineProps<{
  type: ToastType
  title?: string
  message: string
  duration: number
}>()

defineEmits<{
  close: []
}>()

const isPaused = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const pauseTimer = () => {
  if (props.duration > 0 && timeoutId) {
    isPaused.value = true
    clearTimeout(timeoutId)
  }
}

const resumeTimer = () => {
  if (props.duration > 0 && isPaused.value) {
    isPaused.value = false
    // Timer handled by parent store
  }
}

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

const toastClasses = computed(() => {
  const base = [
    'relative w-80 p-4 rounded-sm border shadow-lg backdrop-blur-sm',
    'animate-slide-in',
  ]

  switch (props.type) {
    case 'success':
      return [...base, 'bg-elevated border-success'].join(' ')
    case 'error':
      return [...base, 'bg-elevated border-danger'].join(' ')
    case 'warning':
      return [...base, 'bg-elevated border-warning'].join(' ')
    case 'info':
    default:
      return [...base, 'bg-elevated border-line'].join(' ')
  }
})

const iconContainerClasses = computed(() => {
  const base = 'flex items-center justify-center w-6! h-6! rounded-sm'

  switch (props.type) {
    case 'success':
      return `${base} bg-success-soft`
    case 'error':
      return `${base} bg-danger-soft`
    case 'warning':
      return `${base} bg-warning-soft`
    case 'info':
    default:
      return `${base} bg-fill`
  }
})

const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check'
    case 'error':
      return 'x'
    case 'warning':
      return 'triangle-alert'
    case 'info':
    default:
      return 'info'
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-success'
    case 'error':
      return 'text-danger'
    case 'warning':
      return 'text-warning'
    case 'info':
    default:
      return 'text-ink-muted'
  }
})
</script>
