<template>
  <span class="text-[0.65rem] font-bold tracking-wider uppercase text-ink-subtle">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>
