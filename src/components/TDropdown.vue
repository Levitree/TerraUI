<template>
  <div ref="rootRef" class="relative inline-block">
    <div ref="triggerRef" @click="toggle">
      <slot name="trigger" :open="isOpen" />
    </div>
    <Teleport to="body">
      <Transition name="tdropdown">
        <div
          v-if="isOpen"
          ref="menuRef"
          role="menu"
          :style="floatingStyles"
          :class="[
            'fixed z-50 min-w-48 max-w-[min(24rem,calc(100vw-1rem))] bg-elevated border border-line rounded-sm shadow-xl overflow-hidden',
            items ? 'py-1' : '',
            ui?.content,
          ]"
        >
          <!-- Items mode: structured menu rendering. -->
          <template v-if="items">
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
                  <span class="flex-1 min-w-0 text-left truncate">{{ item.label }}</span>
                  <TIcon
                    v-if="item.type === 'checkbox' && item.checked"
                    name="check"
                    size="sm"
                    class="shrink-0 text-success"
                  />
                </component>
              </template>
            </template>
          </template>

          <!-- Custom content mode: default slot, receives close fn. -->
          <slot v-else :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TAvatar from './TAvatar.vue'
import TIcon from './TIcon.vue'
import { useAnchoredOverlay } from '../composables/useAnchoredOverlay'

export type TDropdownItemColor = 'success' | 'error' | 'warn' | 'neutral'

export type TDropdownItem =
  | { type: 'label'; label: string; avatar?: { text: string; src?: string } }
  | { type: 'separator' }
  | {
      type?: 'link' | 'checkbox'
      label: string
      icon?: string
      onSelect?: (event: Event) => void
      color?: TDropdownItemColor
      disabled?: boolean
      to?: string
      checked?: boolean
    }

export interface TDropdownContent {
  /** Which side of the trigger the menu opens toward. Default 'bottom'. */
  side?: 'top' | 'bottom'
  /** Cross-axis edge alignment relative to the trigger. Default 'start'. */
  align?: 'start' | 'center' | 'end'
  /** Gap in px between trigger and menu. Default 4. */
  sideOffset?: number
}

const props = withDefaults(
  defineProps<{
    /** Menu items. When provided, the default slot is ignored. */
    items?: TDropdownItem[] | TDropdownItem[][]
    content?: TDropdownContent
    ui?: { content?: string }
  }>(),
  { content: () => ({ side: 'bottom', align: 'start' }) },
)

const router = useRouter()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const { floatingStyles } = useAnchoredOverlay(triggerRef, menuRef, isOpen, {
  side: () => props.content?.side ?? 'bottom',
  align: () => props.content?.align ?? 'start',
  sideOffset: () => props.content?.sideOffset ?? 4,
})

const groupedItems = computed<TDropdownItem[][]>(() => {
  if (!props.items || props.items.length === 0) return []
  return Array.isArray(props.items[0])
    ? (props.items as TDropdownItem[][])
    : [props.items as TDropdownItem[]]
})

// Teleport + position: fixed = menu is viewport-relative, so it can't be
// clipped or trigger scroll in any ancestor (including overflow-hidden
// sidebars and overflow-auto tables). Placement, flip/shift, and scroll/resize
// tracking are handled by useAnchoredOverlay.
const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const itemClasses = (item: Exclude<TDropdownItem, { type: 'label' } | { type: 'separator' }>) => {
  const base = [
    'group w-full flex items-center gap-2 px-3 h-9 text-sm transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ]

  switch (item.color) {
    case 'error':
      base.push('text-danger hover:bg-danger-soft')
      break
    case 'success':
      base.push('text-success-strong hover:bg-success-soft')
      break
    case 'warn':
      base.push('text-warning-strong hover:bg-warning-soft')
      break
    default:
      base.push('text-ink-secondary hover:bg-fill hover:text-ink')
  }

  return base.join(' ')
}

const handleSelect = (
  item: Exclude<TDropdownItem, { type: 'label' } | { type: 'separator' }>,
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

// Click-outside must accept both the root (trigger side) and the teleported
// menu, since the menu is no longer a DOM descendant of root.
const onDocumentClick = (event: MouseEvent) => {
  if (!isOpen.value) return
  const target = event.target as Node
  if (rootRef.value?.contains(target)) return
  if (menuRef.value?.contains(target)) return
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
