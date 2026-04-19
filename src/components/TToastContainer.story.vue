<template>
  <Story title="TToastContainer" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.type"
          title="Type"
          :options="['success', 'error', 'warning', 'info']"
        />
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.message" title="Message" />
        <HstNumber v-model="state.duration" title="Duration (ms)" />
      </template>

      <div class="p-6 bg-bg min-h-96 relative flex flex-col items-center justify-center gap-3">
        <p class="text-sm text-ink-muted max-w-md text-center">
          <code>TToastContainer</code> is mounted once at the root of your app. It subscribes to the
          toast store and renders each queued toast in the bottom-right corner.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <TButton label="Push toast" icon="send" @click="push" />
          <TButton color="ghost" label="Clear" icon="trash-2" @click="toast.clear()" />
        </div>
        <TToastContainer />
      </div>
    </Variant>

    <Variant title="One of each type">
      <div class="p-6 bg-bg min-h-96 relative flex items-center justify-center gap-3">
        <TButton
          color="success"
          label="Success"
          @click="toast.success('Saved changes', 'Success')"
        />
        <TButton color="error" label="Error" @click="toast.error('Something broke', 'Error')" />
        <TButton color="warn" label="Warning" @click="toast.warning('Heads up', 'Warning')" />
        <TButton color="neutral" label="Info" @click="toast.info('Just so you know', 'Info')" />
        <TToastContainer />
      </div>
    </Variant>

    <Variant title="Burst">
      <div class="p-6 bg-bg min-h-96 relative flex items-center justify-center">
        <TButton label="Push 5 toasts" icon="zap" @click="burst" />
        <TToastContainer />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TToastContainer from './TToastContainer.vue'
import TButton from './TButton.vue'
import { useToast, type ToastType } from '../composables/useToast'

const toast = useToast()

const state = reactive<{
  type: ToastType
  title: string
  message: string
  duration: number
}>({
  type: 'info',
  title: 'Heads up',
  message: 'This toast was pushed via the composable.',
  duration: 4000,
})

const push = () => {
  toast.add({
    color: state.type,
    title: state.title || undefined,
    description: state.message,
    duration: state.duration,
  })
}

const burst = () => {
  const types: ToastType[] = ['success', 'info', 'warning', 'error', 'info']
  types.forEach((type, i) => {
    setTimeout(() => {
      toast.add({
        color: type,
        title: type[0].toUpperCase() + type.slice(1),
        description: `Toast #${i + 1}`,
        duration: 4000,
      })
    }, i * 150)
  })
}
</script>
