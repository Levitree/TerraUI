<template>
  <div
    :class="[
      'shrink-0 px-4 py-1.5 3xl:py-3 bg-chrome',
      blur && 'backdrop-blur-sm',
      position === 'top' ? 'border-b border-line-subtle' : 'border-t border-line-subtle',
    ]"
  >
    <div class="flex items-center gap-3 flex-wrap">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    position?: 'top' | 'bottom'
    blur?: boolean
  }>(),
  {
    position: 'bottom',
    blur: true,
  },
)
</script>
