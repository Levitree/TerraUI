<template>
  <div>
    <component
      :is="item.to && !item.children ? 'a' : 'button'"
      :type="item.to && !item.children ? undefined : 'button'"
      :href="item.to && !item.children ? item.to : undefined"
      :disabled="item.disabled || undefined"
      :aria-current="isActive ? 'page' : undefined"
      :title="collapsed ? (item.tooltip?.text ?? item.label) : undefined"
      :class="triggerClasses"
      @click="handleClick"
    >
      <TIcon v-if="item.icon" :name="item.icon" size="sm" class="shrink-0" />
      <span v-if="!collapsed" class="flex-1 truncate text-left">{{ item.label }}</span>
      <span
        v-if="!collapsed && item.badge !== undefined"
        class="shrink-0 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wider rounded-sm bg-fill text-ink-secondary"
      >
        {{ item.badge }}
      </span>
      <TIcon
        v-if="!collapsed && hasChildren"
        :name="isOpen ? 'chevron-down' : 'chevron-right'"
        size="xs"
        class="shrink-0 text-ink-muted"
      />
    </component>

    <div v-if="hasChildren && isOpen && !collapsed" class="ml-4 mt-0.5 flex flex-col gap-0.5">
      <NavItemRenderer
        v-for="child in item.children"
        :key="child.label"
        :item="child"
        :collapsed="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TIcon from '../TIcon.vue'
import type { NavItem } from '../TNavigationMenu.vue'

const props = defineProps<{
  item: NavItem
  collapsed: boolean
}>()

const route = useRoute()
const router = useRouter()

const hasChildren = computed(() => (props.item.children?.length ?? 0) > 0)

const childIsActive = (item: NavItem): boolean => {
  if (!item.to) return (item.children ?? []).some(childIsActive)
  return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}

const isActive = computed(() => {
  if (props.item.to) {
    return props.item.exact ? route.path === props.item.to : route.path.startsWith(props.item.to)
  }
  return (props.item.children ?? []).some(childIsActive)
})

const isOpen = ref(props.item.defaultOpen ?? isActive.value)

const triggerClasses = computed(() => {
  const base = [
    'group w-full flex items-center gap-2 rounded-sm text-sm font-medium tracking-wider uppercase transition-colors',
    props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ]

  if (isActive.value) {
    base.push('bg-fill text-ink')
  } else {
    base.push('text-ink-secondary hover:bg-fill-subtle hover:text-ink')
  }

  return base.join(' ')
})

const handleClick = (event: Event) => {
  if (props.item.disabled) {
    event.preventDefault()
    return
  }

  if (hasChildren.value && !props.item.to) {
    event.preventDefault()
    isOpen.value = !isOpen.value
    return
  }

  if (props.item.onSelect) {
    event.preventDefault()
    props.item.onSelect()
    return
  }

  if (props.item.to) {
    event.preventDefault()
    router.push(props.item.to)
  }
}
</script>
