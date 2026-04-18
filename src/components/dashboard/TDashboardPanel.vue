<template>
  <section :id="id" class="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
    <div v-if="$slots.header" class="shrink-0">
      <slot name="header" />
    </div>
    <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
      <slot name="body">
        <slot />
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
