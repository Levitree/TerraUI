<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <TToast
          v-for="toast in toasts"
          :key="toast.id"
          :type="toast.type"
          :title="toast.title"
          :message="toast.message"
          :duration="toast.duration"
          class="pointer-events-auto"
          @close="toastStore.remove(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '../stores/toast'
import TToast from './TToast.vue'

const toastStore = useToastStore()

const toasts = computed(() => toastStore.toasts)
</script>
