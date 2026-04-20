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

export type ButtonColor =
  | 'neutral'
  | 'success'
  | 'error'
  | 'warn'
  | 'ghost'
  | 'icon'
  | 'white'
  | 'info'
export type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    size?: ButtonSize
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
    size: 'md',
    type: 'button',
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

const colorClasses = computed(() => {
  if (props.color === 'icon') {
    return props.active
      ? 'bg-fill-strong border border-line-strong text-ink'
      : 'bg-fill-subtle border border-line text-ink-secondary not-disabled:hover:bg-fill not-disabled:hover:border-line-strong not-disabled:hover:text-ink'
  }

  if (props.color === 'ghost') {
    return props.active
      ? 'bg-fill-strong text-ink'
      : 'bg-transparent text-ink-muted not-disabled:hover:bg-fill not-disabled:hover:text-ink'
  }

  if (props.color === 'success') {
    return 'bg-success-soft border border-success text-success enabled:hover:bg-success enabled:hover:border-success'
  }

  if (props.color === 'error') {
    return 'bg-danger-soft border border-danger text-danger enabled:hover:bg-danger enabled:hover:border-danger'
  }

  if (props.color === 'warn') {
    return 'bg-warning-soft border border-warning text-warning enabled:hover:bg-warning enabled:hover:border-warning'
  }

  if (props.color === 'info') {
    return 'bg-info-soft border border-info text-info enabled:hover:bg-info enabled:hover:border-success'
  }

  if (props.color === 'white') {
    return props.active
      ? 'bg-ink border border-ink text-ink-inverse not-disabled:hover:bg-ink-secondary'
      : 'bg-ink/90 border border-ink/80 text-ink-inverse not-disabled:hover:bg-ink not-disabled:hover:border-ink'
  }

  return props.active
    ? 'bg-fill-strong border border-line-strong text-ink shadow-[inset_0_0_12px_color-mix(in_srgb,var(--color-ink)_20%,transparent)]'
    : 'bg-fill-subtle border border-line text-ink-secondary not-disabled:hover:bg-fill-strong not-disabled:hover:border-line-strong not-disabled:hover:shadow-[inset_0_0_12px_color-mix(in_srgb,var(--color-ink)_20%,transparent)]'
})

const sizeClasses = computed(() => {
  if (props.color === 'icon') {
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
  if (props.color === 'icon') return 'sm'
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
