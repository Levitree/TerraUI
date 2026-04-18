<template>
  <div role="alert" :class="containerClasses">
    <TIcon :name="resolvedIcon" size="sm" :class="iconColorClass" class="mt-0.5 shrink-0" />
    <div class="flex-1 min-w-0">
      <div v-if="title || $slots.title" class="text-xs font-bold tracking-wider uppercase text-ink">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        v-if="description || $slots.description || $slots.default"
        class="text-sm text-ink-secondary leading-relaxed"
        :class="{ 'mt-1': title || $slots.title }"
      >
        <slot name="description">
          <slot>{{ description }}</slot>
        </slot>
      </div>
      <div v-if="$slots.actions" class="mt-3 flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <button
      v-if="closable"
      type="button"
      class="shrink-0 text-ink-muted hover:text-ink transition-colors"
      aria-label="Dismiss"
      @click="$emit('close')"
    >
      <TIcon name="x" size="sm" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TIcon from './TIcon.vue'

export type AlertColor = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary'
export type AlertVariant = 'solid' | 'subtle' | 'outline'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    color?: AlertColor
    variant?: AlertVariant
    icon?: string
    closable?: boolean
  }>(),
  {
    color: 'info',
    variant: 'subtle',
    closable: false,
  },
)

defineEmits<{ close: [] }>()

const DEFAULT_ICONS: Record<AlertColor, string> = {
  success: 'circle-check',
  error: 'circle-alert',
  warning: 'triangle-alert',
  info: 'info',
  neutral: 'info',
  primary: 'info',
}

const resolvedIcon = computed(() => props.icon ?? DEFAULT_ICONS[props.color])

const containerClasses = computed(() => {
  const base = ['flex items-start gap-3 rounded-sm px-4 py-3 border']

  if (props.variant === 'solid') {
    switch (props.color) {
      case 'success':
        return [...base, 'bg-success border-success text-ink-inverse'].join(' ')
      case 'error':
        return [...base, 'bg-danger border-danger text-ink-inverse'].join(' ')
      case 'warning':
        return [...base, 'bg-warning border-warning text-ink-inverse'].join(' ')
      case 'info':
      case 'neutral':
      case 'primary':
      default:
        return [...base, 'bg-elevated border-line text-ink'].join(' ')
    }
  }

  if (props.variant === 'outline') {
    switch (props.color) {
      case 'success':
        return [...base, 'bg-transparent border-success text-ink'].join(' ')
      case 'error':
        return [...base, 'bg-transparent border-danger text-ink'].join(' ')
      case 'warning':
        return [...base, 'bg-transparent border-warning text-ink'].join(' ')
      default:
        return [...base, 'bg-transparent border-line text-ink'].join(' ')
    }
  }

  // subtle (default)
  switch (props.color) {
    case 'success':
      return [...base, 'bg-success-soft border-success/20 text-ink'].join(' ')
    case 'error':
      return [...base, 'bg-danger-soft border-danger/20 text-ink'].join(' ')
    case 'warning':
      return [...base, 'bg-warning-soft border-warning/20 text-ink'].join(' ')
    case 'info':
    case 'neutral':
    case 'primary':
    default:
      return [...base, 'bg-fill-subtle border-line text-ink'].join(' ')
  }
})

const iconColorClass = computed(() => {
  if (props.variant === 'solid') return 'text-ink-inverse'
  switch (props.color) {
    case 'success':
      return 'text-success'
    case 'error':
      return 'text-danger'
    case 'warning':
      return 'text-warning'
    default:
      return 'text-ink-muted'
  }
})
</script>
