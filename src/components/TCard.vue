<template>
  <div :class="cardClasses">
    <!-- Header (optional). Uses a plain block container so multi-line slot
         content (e.g. title + description) stacks naturally; consumers that
         want a spread layout add their own `flex justify-between` wrapper. -->
    <div v-if="$slots.header || title" class="px-4 py-3 border-b border-line-subtle bg-fill-subtle">
      <slot name="header">
        <span v-if="title" class="text-base font-bold tracking-wide text-ink">{{ title }}</span>
      </slot>
    </div>

    <!-- Body -->
    <div :class="bodyClasses">
      <slot />
    </div>

    <!-- Footer (optional) -->
    <div v-if="$slots.footer" class="px-4 py-3 border-t border-line-subtle">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    noPadding?: boolean
  }>(),
  {
    noPadding: false,
  },
)

const cardClasses = 'flex flex-col border border-line bg-surface rounded-sm overflow-hidden transition-all'

const bodyClasses = computed(() => {
  const classes = ['flex-1 min-h-0']
  if (!props.noPadding) {
    classes.push('px-4 py-4')
  }
  return classes.join(' ')
})
</script>
