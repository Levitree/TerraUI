<template>
  <nav aria-label="Breadcrumb" class="flex items-center">
    <ol class="flex items-center gap-1.5 flex-wrap text-xs">
      <li
        v-for="(item, index) in items"
        :key="keyFor(item, index)"
        class="flex items-center gap-1.5"
      >
        <component
          :is="linkTag(item)"
          :href="item.to && !isCurrent(index) ? item.to : undefined"
          :aria-current="isCurrent(index) ? 'page' : undefined"
          :type="linkTag(item) === 'button' ? 'button' : undefined"
          :class="linkClasses(index)"
          @click="handleClick(item, index, $event)"
        >
          <TIcon v-if="item.icon" :name="item.icon" size="xs" class="shrink-0" />
          <span class="truncate">{{ item.label }}</span>
        </component>

        <span
          v-if="index < items.length - 1"
          aria-hidden="true"
          class="text-ink-subtle shrink-0 flex items-center"
        >
          <TIcon :name="separator" size="xs" />
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TIcon from './TIcon.vue'

export interface TBreadcrumbItem {
  label: string
  /** Optional Lucide icon rendered before the label. */
  icon?: string
  /** Route path. Inactive items render as `<a>`; the last item is rendered static. */
  to?: string
  /** Click handler — takes precedence over `to`. */
  onSelect?: (event: Event) => void
}

const props = withDefaults(
  defineProps<{
    items: TBreadcrumbItem[]
    /** Lucide icon name used between items. Default `chevron-right`. */
    separator?: string
  }>(),
  { separator: 'chevron-right' },
)

const router = (() => {
  try {
    return useRouter()
  } catch {
    return null
  }
})()

const isCurrent = (index: number) => index === props.items.length - 1

const keyFor = (item: TBreadcrumbItem, index: number) => item.to ?? `${item.label}-${index}`

const linkTag = (item: TBreadcrumbItem) => {
  if (item.onSelect) return 'button'
  if (item.to) return 'a'
  return 'span'
}

const handleClick = (item: TBreadcrumbItem, index: number, event: Event) => {
  if (isCurrent(index)) return
  if (item.onSelect) {
    event.preventDefault()
    item.onSelect(event)
    return
  }
  if (item.to && router) {
    event.preventDefault()
    router.push(item.to)
  }
}

const linkClasses = computed(() => (index: number) => {
  const base = [
    'inline-flex items-center gap-1.5 rounded-sm font-bold tracking-wider uppercase transition-colors',
  ]
  if (isCurrent(index)) {
    base.push('text-ink cursor-default')
  } else {
    base.push(
      'text-ink-muted hover:text-ink',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-line-strong',
    )
    if (props.items[index].to || props.items[index].onSelect) base.push('cursor-pointer')
  }
  return base.join(' ')
})
</script>
