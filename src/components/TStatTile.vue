<template>
  <div class="bg-surface border border-line-subtle rounded-sm px-3 py-2 text-center">
    <div class="text-[0.6rem] font-bold tracking-wider text-ink-subtle mb-1 uppercase">
      {{ label }}
    </div>
    <div class="text-sm font-mono font-bold text-ink">
      <slot>{{ value }}</slot>
      <span v-if="unit" class="text-[0.6rem] font-normal text-ink-muted ml-0.5">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string | number
  unit?: string
}>()
</script>
