<template>
  <div>
    <h2 class="text-lg font-bold tracking-wide text-ink">
      <slot>{{ title }}</slot>
    </h2>
    <p v-if="subheading || $slots.subheading" class="mt-1 text-xs text-ink-muted">
      <slot name="subheading">{{ subheading }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subheading?: string
}>()
</script>
