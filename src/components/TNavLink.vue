<template>
  <a :href="to" :class="linkClasses" @click.prevent="handleClick">
    <i v-if="icon" :class="icon" class="text-base" />
    <span v-if="label">{{ label }}</span>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    to?: string
    active?: boolean
  }>(),
  {
    active: false,
  },
)

const emit = defineEmits<{
  click: []
}>()

const linkClasses = computed(() => {
  const baseClasses =
    'flex items-center gap-2 px-4 py-2 rounded-sm border border-transparent transition-all duration-200 text-sm font-bold tracking-wider uppercase'
  const colorClasses = props.active
    ? 'text-ink bg-fill-strong border-line'
    : 'text-ink-secondary hover:text-ink hover:bg-fill hover:border-line-subtle'

  return `${baseClasses} ${colorClasses}`
})

const handleClick = () => {
  emit('click')
}
</script>
