<template>
  <div ref="rootRef" class="relative inline-block">
    <div @click="toggle">
      <slot name="trigger" :open="isOpen" />
    </div>
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-2 min-w-[12rem] bg-chrome backdrop-blur-sm border border-line rounded-sm shadow-2xl',
          align === 'right' ? 'right-0' : 'left-0',
        ]"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

withDefaults(defineProps<{ align?: 'left' | 'right' }>(), { align: 'left' })

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function onDocumentClick(e: MouseEvent) {
  if (!isOpen.value) return
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    close()
  }
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentClick)
  document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentClick)
  document.removeEventListener('keydown', onEscape)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
