<template>
  <div class="flex items-center border border-line rounded-sm overflow-hidden">
    <button
      v-for="(tab, index) in tabs"
      :key="tab.value"
      class="px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all"
      :class="[
        modelValue === tab.value
          ? 'bg-fill text-ink'
          : 'bg-fill-subtle text-ink-muted hover:bg-fill hover:text-ink',
        index < tabs.length - 1 ? 'border-r border-line' : '',
      ]"
      @click="emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  value: string
}

defineProps<{
  modelValue: string
  tabs: Tab[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
