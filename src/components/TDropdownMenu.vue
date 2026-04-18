<template>
  <div ref="rootRef" class="relative inline-block">
    <div ref="triggerRef" @click="toggle">
      <slot :open="isOpen" />
    </div>
    <Teleport to="body">
      <Transition name="tdropdown">
        <div
          v-if="isOpen"
          ref="floatingRef"
          role="menu"
          :style="floatingStyles"
          :class="[
            'z-50 min-w-48 bg-elevated border border-line rounded-sm shadow-xl py-1 overflow-hidden',
            ui?.content,
          ]"
        >
          <template v-for="(group, gi) in groupedItems" :key="gi">
            <div v-if="gi > 0" role="separator" class="my-1 h-px bg-line-subtle" />
            <template v-for="(item, ii) in group" :key="ii">
              <div
                v-if="item.type === 'separator'"
                role="separator"
                class="my-1 h-px bg-line-subtle"
              />

              <div
                v-else-if="item.type === 'label'"
                role="presentation"
                class="flex items-center gap-2 px-3 py-1.5 text-[0.6rem] font-bold tracking-wider uppercase text-ink-muted"
              >
                <TAvatar
                  v-if="item.avatar"
                  :src="item.avatar.src"
                  :text="item.avatar.text"
                  size="xs"
                />
                <span>{{ item.label }}</span>
              </div>

              <component
                v-else
                :is="item.to && item.type !== 'checkbox' ? 'a' : 'button'"
                role="menuitem"
                :type="item.to && item.type !== 'checkbox' ? undefined : 'button'"
                :href="item.to && item.type !== 'checkbox' ? item.to : undefined"
                :disabled="item.disabled || undefined"
                :class="itemClasses(item)"
                @click="handleSelect(item, $event)"
              >
                <TIcon v-if="item.icon" :name="item.icon" size="sm" class="shrink-0" />
                <span class="flex-1 text-left truncate">{{ item.label }}</span>
                <TIcon
                  v-if="item.type === 'checkbox' && item.checked"
                  name="check"
                  size="sm"
                  class="shrink-0 text-success"
                />
              </component>
            </template>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { autoUpdate, flip, offset, shift, useFloating, type Placement } from '@floating-ui/vue'
import TAvatar from './TAvatar.vue'
import TIcon from './TIcon.vue'

export type TDropdownMenuItemColor = 'primary' | 'success' | 'warning' | 'error' | 'neutral'

export type TDropdownMenuItem =
  | { type: 'label'; label: string; avatar?: { text: string; src?: string } }
  | { type: 'separator' }
  | {
      type?: 'link' | 'checkbox'
      label: string
      icon?: string
      onSelect?: (event: Event) => void
      color?: TDropdownMenuItemColor
      disabled?: boolean
      to?: string
      checked?: boolean
    }

export interface TDropdownMenuContent {
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  collisionPadding?: number
  /** Gap between trigger and menu. Defaults to 4px. */
  sideOffset?: number
}

const props = withDefaults(
  defineProps<{
    items: TDropdownMenuItem[] | TDropdownMenuItem[][]
    content?: TDropdownMenuContent
    ui?: { content?: string }
  }>(),
  { content: () => ({ side: 'bottom', align: 'start' }) },
)

const router = useRouter()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)

const groupedItems = computed<TDropdownMenuItem[][]>(() => {
  if (props.items.length === 0) return []
  return Array.isArray(props.items[0])
    ? (props.items as TDropdownMenuItem[][])
    : [props.items as TDropdownMenuItem[]]
})

// Map our side+align API onto floating-ui's Placement string. Center align
// collapses to the bare side (e.g. 'bottom'), since floating-ui only
// distinguishes start/end on the cross axis.
const placement = computed<Placement>(() => {
  const side = props.content?.side ?? 'bottom'
  const align = props.content?.align ?? 'start'
  if (align === 'center') return side
  return `${side}-${align}` as Placement
})

const padding = computed(() => props.content?.collisionPadding ?? 8)
const sideOffset = computed(() => props.content?.sideOffset ?? 4)

const { floatingStyles } = useFloating(triggerRef, floatingRef, {
  placement,
  // `flip` swaps the side when the preferred one overflows; `shift` nudges
  // along the cross-axis to keep the menu on-screen without hiding the arrow.
  middleware: computed(() => [
    offset(sideOffset.value),
    flip({ padding: padding.value }),
    shift({ padding: padding.value }),
  ]),
  whileElementsMounted: autoUpdate,
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const itemClasses = (
  item: Exclude<TDropdownMenuItem, { type: 'label' } | { type: 'separator' }>,
) => {
  const base = [
    'group w-full flex items-center gap-2 px-3 h-9 text-sm transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ]

  switch (item.color) {
    case 'error':
      base.push('text-danger hover:bg-danger-soft')
      break
    case 'success':
      base.push('text-success hover:bg-success-soft')
      break
    case 'warning':
      base.push('text-warning hover:bg-warning-soft')
      break
    default:
      base.push('text-ink-secondary hover:bg-fill hover:text-ink')
  }

  return base.join(' ')
}

const handleSelect = (
  item: Exclude<TDropdownMenuItem, { type: 'label' } | { type: 'separator' }>,
  event: Event,
) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (item.onSelect) {
    event.preventDefault()
    item.onSelect(event)
  } else if (item.to && item.type !== 'checkbox') {
    event.preventDefault()
    router.push(item.to)
  }

  if (item.type !== 'checkbox') close()
}

// Click-outside needs to account for the teleported floating panel: it lives
// in <body>, not inside rootRef, so a click inside the menu would otherwise
// count as "outside" and immediately close it.
const onDocumentClick = (event: MouseEvent) => {
  if (!isOpen.value) return
  const target = event.target as Node
  if (rootRef.value?.contains(target)) return
  if (floatingRef.value?.contains(target)) return
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
})
</script>

<style scoped>
.tdropdown-enter-active,
.tdropdown-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.tdropdown-enter-from,
.tdropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
