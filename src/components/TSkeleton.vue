<template>
  <div :class="skeletonClasses" :style="skeletonStyles" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SkeletonProps {
  width?: string // CSS width (e.g., '100%', '12rem')
  height?: string // CSS height (e.g., '2rem', '200px')
  circle?: boolean // Circular skeleton (avatar)
  class?: string // Additional Tailwind classes
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  circle: false,
})

const skeletonClasses = computed(() => {
  const classes = [
    'animate-pulse',
    'bg-gradient-to-r from-fill-subtle via-fill to-fill-subtle',
    'bg-[length:200%_100%]',
  ]

  if (props.circle) {
    classes.push('rounded-full')
  } else {
    classes.push('rounded-sm')
  }

  // Default size if not specified
  if (!props.width) classes.push('w-full')
  if (!props.height) classes.push('h-4')

  if (props.class) {
    classes.push(props.class)
  }

  return classes.join(' ')
})

const skeletonStyles = computed(() => ({
  width: props.width,
  height: props.height,
  animation: 'shimmer 2s infinite linear',
}))
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
