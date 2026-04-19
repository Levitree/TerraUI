<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <TToast
          v-for="t in toast.toasts"
          :key="t.id"
          :type="t.type"
          :title="t.title"
          :message="t.message"
          :duration="t.duration"
          class="pointer-events-auto"
          @close="toast.remove(t.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'
import TToast from './TToast.vue'

const toast = useToast()
</script>
