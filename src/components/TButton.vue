<template>
  <component
    :is="to ? 'a' : 'button'"
    :type="to ? undefined : type"
    :href="to && !isDisabled ? to : undefined"
    :disabled="to ? undefined : isDisabled"
    :aria-disabled="to && isDisabled ? 'true' : undefined"
    :class="buttonClasses"
    @click="handleClick"
  >
    <TIcon v-if="isLoading" name="loader-2" :size="iconSize" class="animate-spin" />
    <TIcon v-else-if="icon && !iconRight" :name="icon" :size="iconSize" />
    <span v-if="label">{{ label }}</span>
    <slot />
    <TIcon v-if="!isLoading && icon && iconRight" :name="icon" :size="iconSize" />
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import TIcon from './TIcon.vue'
import type { IconSize } from './TIcon.vue'

/**
 * Two monochrome colors with opposite polarity, plus the four semantics:
 *  - `neutral`  — tracks the page: light surface in light mode, dark in dark.
 *  - `inverse`  — opposite of the page: dark in light mode, light in dark.
 *                 (This is the old `white` color, correctly named: it is a
 *                 high-contrast *inverse* button, never literally white.)
 *  - info / success / warning / error — semantic hues.
 *
 * Translucency is no longer baked into the color — it lives in `variant`:
 *  - `default` — solid / opaque fill.
 *  - `outline` — transparent fill, colored border + text (good for toggles /
 *                selectable segmented controls; `active` fills with the tint).
 *  - `ghost`   — transparent, no border, hover-tinted (the old `ghost`).
 *
 * Every color × variant has a distinct `active` (pressed / selected) state.
 *
 * Icon-only square buttons are `square` (the old `color="icon"`); they still
 * take a color + variant like any other button.
 */
export type ButtonColor = 'neutral' | 'inverse' | 'info' | 'success' | 'warning' | 'error'
export type ButtonVariant = 'default' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    variant?: ButtonVariant
    size?: ButtonSize
    square?: boolean
    icon?: string
    iconRight?: boolean
    disabled?: boolean
    active?: boolean
    fullWidth?: boolean
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    asyncClick?: () => Promise<void>
    label?: string
    to?: string
  }>(),
  {
    color: 'neutral',
    variant: 'default',
    size: 'md',
    type: 'button',
    square: false,
    fullWidth: false,
    iconRight: false,
    active: false,
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const internalLoading = ref(false)

const isLoading = computed(() => props.loading || internalLoading.value)
const isDisabled = computed(() => props.disabled || isLoading.value)

const router = (() => {
  try {
    return useRouter()
  } catch {
    return null
  }
})()

const handleClick = async (event: MouseEvent) => {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }

  if (props.to && router) {
    event.preventDefault()
    router.push(props.to)
  }

  emit('click', event)

  if (props.asyncClick) {
    internalLoading.value = true
    try {
      await props.asyncClick()
    } finally {
      internalLoading.value = false
    }
  }
}

const baseClasses = computed(() => {
  const classes = [
    'flex items-center justify-center gap-2 whitespace-nowrap',
    'font-bold tracking-wider uppercase',
    'rounded-sm transition-all not-disabled:hover:cursor-pointer',
    'disabled:opacity-30 disabled:cursor-not-allowed',
    'aria-disabled:opacity-30 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
  ]

  if (props.fullWidth) {
    classes.push('w-full')
  }

  return classes.join(' ')
})

// Solid / opaque fill. Colored fills pair with `text-ink-inverse`, which flips
// with the theme; success/warning use the `-strong` fill so the near-white/dark
// label clears AA in both modes. `active` adds an inset "pressed/selected"
// shadow so the state is always visible on the fill.
const solidClasses = computed(() => {
  switch (props.color) {
    case 'inverse':
      return props.active
        ? 'bg-ink-secondary border border-ink-secondary text-ink-inverse shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)]'
        : 'bg-ink border border-ink text-ink-inverse not-disabled:hover:bg-ink-secondary not-disabled:hover:border-ink-secondary'
    case 'success':
      return props.active
        ? 'bg-success-strong border border-success-strong text-ink-inverse shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)]'
        : 'bg-success-strong border border-success-strong text-ink-inverse not-disabled:hover:brightness-110'
    case 'warning':
      return props.active
        ? 'bg-warning-strong border border-warning-strong text-ink-inverse shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)]'
        : 'bg-warning-strong border border-warning-strong text-ink-inverse not-disabled:hover:brightness-110'
    case 'error':
      return props.active
        ? 'bg-danger border border-danger text-ink-inverse shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)]'
        : 'bg-danger border border-danger text-ink-inverse not-disabled:hover:brightness-110'
    case 'info':
      return props.active
        ? 'bg-info border border-info text-ink-inverse shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)]'
        : 'bg-info border border-info text-ink-inverse not-disabled:hover:brightness-110'
    case 'neutral':
    default:
      return props.active
        ? 'bg-fill-strong border border-line-strong text-ink shadow-[inset_0_0_12px_color-mix(in_srgb,var(--color-ink)_20%,transparent)]'
        : 'bg-elevated border border-line text-ink not-disabled:hover:bg-fill-strong not-disabled:hover:border-line-strong'
  }
})

// Transparent fill, colored border + text. Ideal for toggles / segmented
// controls: `active` fills with the matching soft tint so the selected option
// reads clearly. Colored text uses the `-strong` shade where the base fails AA.
const outlineClasses = computed(() => {
  switch (props.color) {
    case 'inverse':
      return props.active
        ? 'bg-fill-strong border border-ink text-ink'
        : 'bg-transparent border border-ink text-ink not-disabled:hover:bg-fill'
    case 'success':
      return props.active
        ? 'bg-success-soft border border-success text-success-strong'
        : 'bg-transparent border border-success text-success-strong not-disabled:hover:bg-success-soft'
    case 'warning':
      return props.active
        ? 'bg-warning-soft border border-warning text-warning-strong'
        : 'bg-transparent border border-warning text-warning-strong not-disabled:hover:bg-warning-soft'
    case 'error':
      return props.active
        ? 'bg-danger-soft border border-danger text-danger'
        : 'bg-transparent border border-danger text-danger not-disabled:hover:bg-danger-soft'
    case 'info':
      return props.active
        ? 'bg-info-soft border border-info text-info'
        : 'bg-transparent border border-info text-info not-disabled:hover:bg-info-soft'
    case 'neutral':
    default:
      return props.active
        ? 'bg-fill-strong border border-line-strong text-ink'
        : 'bg-transparent border border-line text-ink not-disabled:hover:bg-fill not-disabled:hover:border-line-strong'
  }
})

// Transparent, no border, hover-tinted. Resting foregrounds clear WCAG AA on the
// page surface in both modes; `active` fills with the soft tint to show state.
const ghostClasses = computed(() => {
  switch (props.color) {
    case 'inverse':
      return props.active
        ? 'bg-fill-strong text-ink'
        : 'bg-transparent text-ink not-disabled:hover:bg-fill'
    case 'success':
      return props.active
        ? 'bg-success-soft text-success-strong'
        : 'bg-transparent text-success-strong not-disabled:hover:bg-fill'
    case 'warning':
      return props.active
        ? 'bg-warning-soft text-warning-strong'
        : 'bg-transparent text-warning-strong not-disabled:hover:bg-fill'
    case 'error':
      return props.active
        ? 'bg-danger-soft text-danger'
        : 'bg-transparent text-danger not-disabled:hover:bg-fill'
    case 'info':
      return props.active
        ? 'bg-info-soft text-info'
        : 'bg-transparent text-info not-disabled:hover:bg-fill'
    case 'neutral':
    default:
      return props.active
        ? 'bg-fill-strong text-ink'
        : 'bg-transparent text-ink-muted not-disabled:hover:bg-fill not-disabled:hover:text-ink'
  }
})

const colorClasses = computed(() => {
  if (props.variant === 'ghost') return ghostClasses.value
  if (props.variant === 'outline') return outlineClasses.value
  return solidClasses.value
})

const sizeClasses = computed(() => {
  if (props.square) {
    switch (props.size) {
      case 'sm':
        return 'w-6 h-6'
      case 'lg':
        return 'w-10 h-10'
      default:
        return 'w-8 h-8'
    }
  }

  switch (props.size) {
    case 'sm':
      return 'h-[30px] px-3 text-[0.65rem]'
    case 'lg':
      return 'h-[46px] px-6 text-sm'
    default:
      return 'h-[34px] px-4 text-xs'
  }
})

const buttonClasses = computed(
  () => `${baseClasses.value} ${colorClasses.value} ${sizeClasses.value}`,
)

const iconSize = computed<IconSize>(() => {
  if (props.square) return 'sm'
  switch (props.size) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'md'
    default:
      return 'sm'
  }
})
</script>
