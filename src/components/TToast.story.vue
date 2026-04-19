<template>
  <Story title="TToast" group="overlays">
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

      <div class="p-6 bg-bg min-h-96 flex items-center justify-center">
        <TToast
          :type="state.type"
          :title="state.title || undefined"
          :message="state.message"
          :duration="state.duration"
        />
      </div>
    </Variant>

    <Variant title="All types">
      <div class="p-6 bg-bg min-h-96 flex flex-col gap-3 items-center">
        <TToast
          type="success"
          title="Deployed"
          message="Your changes are live in production."
          :duration="0"
        />
        <TToast
          type="error"
          title="Build failed"
          message="See logs for the failing step."
          :duration="0"
        />
        <TToast
          type="warning"
          title="Approaching quota"
          message="You've used 80% of your monthly budget."
          :duration="0"
        />
        <TToast
          type="info"
          title="Heads up"
          message="A new version is available."
          :duration="0"
        />
      </div>
    </Variant>

    <Variant title="Wired to toast store">
      <div class="p-6 bg-bg min-h-96 relative flex flex-wrap items-center justify-center gap-3">
        <TButton
          color="success"
          label="Push success"
          icon="check"
          @click="toast.success('Deployed to production', 'Success')"
        />
        <TButton
          color="error"
          label="Push error"
          icon="x"
          @click="toast.error('Could not reach the server', 'Error')"
        />
        <TButton
          color="warn"
          label="Push warning"
          icon="triangle-alert"
          @click="toast.warning('You are nearing your quota', 'Warning')"
        />
        <TButton
          color="neutral"
          label="Push info"
          icon="info"
          @click="toast.info('A new version is available', 'Info')"
        />
        <TToastContainer />
      </div>
    </Variant>

    <Variant title="Without title">
      <div class="p-6 bg-bg min-h-96 flex flex-col gap-3 items-center">
        <TToast type="success" message="Saved." :duration="0" />
        <TToast type="info" message="Nothing to report today." :duration="0" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TToast from './TToast.vue'
import TToastContainer from './TToastContainer.vue'
import TButton from './TButton.vue'
import { useToast } from '../composables/useToast'
import type { ToastType } from '../stores/toast'

const toast = useToast()

const state = reactive<{
  type: ToastType
  title: string
  message: string
  duration: number
}>({
  type: 'success',
  title: 'Deployed',
  message: 'Your changes are live in production.',
  duration: 0,
})
</script>
