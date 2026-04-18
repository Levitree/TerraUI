<template>
  <header class="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-line-subtle bg-chrome">
    <div v-if="$slots.leading" class="flex items-center gap-2">
      <slot name="leading" />
    </div>

    <div class="flex-1 min-w-0 flex items-baseline gap-3">
      <slot name="title">
        <h1 v-if="title" class="text-sm font-bold tracking-wider uppercase text-ink truncate">
          {{ title }}
        </h1>
      </slot>
      <p v-if="description" class="text-xs text-ink-muted truncate">{{ description }}</p>
    </div>

    <div v-if="$slots.right" class="flex items-center gap-2">
      <slot name="right" />
    </div>

    <slot />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>
