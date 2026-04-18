<template>
  <div
    v-if="orientation === 'vertical'"
    role="separator"
    aria-orientation="vertical"
    class="w-px h-full bg-line-subtle shrink-0"
  />
  <div v-else-if="label" role="separator" class="flex items-center gap-3 w-full">
    <div class="flex-1 h-px bg-line-subtle" />
    <span class="text-[0.65rem] tracking-wider uppercase text-ink-muted">{{ label }}</span>
    <div class="flex-1 h-px bg-line-subtle" />
  </div>
  <div v-else role="separator" class="h-px w-full bg-line-subtle" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    label?: string
  }>(),
  { orientation: 'horizontal' },
)
</script>
