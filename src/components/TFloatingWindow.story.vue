<template>
  <Story title="TFloatingWindow" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Title" />
        <HstNumber v-model="state.initialX" title="Initial X" />
        <HstNumber v-model="state.initialY" title="Initial Y" />
        <HstNumber v-model="state.initialWidth" title="Initial width" />
        <HstNumber v-model="state.initialHeight" title="Initial height" />
        <HstCheckbox v-model="state.resizable" title="Resizable" />
        <HstCheckbox v-model="state.minimizable" title="Minimizable" />
        <HstCheckbox v-model="state.withFooter" title="With footer" />
      </template>

      <div class="p-6 bg-bg min-h-96 relative flex items-center justify-center">
        <TButton
          label="Open Floating Window"
          icon="app-window"
          @click="state.open = true"
        />

        <TFloatingWindow
          v-model:open="state.open"
          :title="state.title"
          :initial-x="state.initialX"
          :initial-y="state.initialY"
          :initial-width="state.initialWidth"
          :initial-height="state.initialHeight"
          :resizable="state.resizable"
          :minimizable="state.minimizable"
        >
          <div class="p-4 text-sm text-ink-secondary">
            <p>
              Drag the header to move. Drag the bottom-right handle to resize.
              Click anywhere to bring the window to the front.
            </p>
            <p class="mt-2 text-ink-muted">
              Content scrolls if it overflows the window bounds.
            </p>
          </div>

          <template v-if="state.withFooter" #footer>
            <div class="flex-1 text-xs text-ink-muted">Footer</div>
            <TButton size="sm" variant="ghost" label="Cancel" @click="state.open = false" />
            <TButton size="sm" label="OK" @click="state.open = false" />
          </template>
        </TFloatingWindow>
      </div>
    </Variant>

    <Variant title="Multiple windows">
      <div class="p-6 bg-bg min-h-96 relative flex items-center justify-center gap-3">
        <TButton label="Open A" @click="openA = true" />
        <TButton label="Open B" variant="secondary" @click="openB = true" />

        <TFloatingWindow
          v-model:open="openA"
          title="Window A"
          :initial-x="120"
          :initial-y="120"
          :initial-width="320"
          :initial-height="200"
        >
          <div class="p-4 text-sm text-ink-secondary">
            I am window A. Click me to bring me to the front.
          </div>
        </TFloatingWindow>

        <TFloatingWindow
          v-model:open="openB"
          title="Window B"
          :initial-x="220"
          :initial-y="180"
          :initial-width="320"
          :initial-height="200"
        >
          <div class="p-4 text-sm text-ink-secondary">
            I am window B. We share a z-index stack.
          </div>
        </TFloatingWindow>
      </div>
    </Variant>

    <Variant title="Non-resizable">
      <div class="p-6 bg-bg min-h-96 relative flex items-center justify-center">
        <TButton label="Open fixed-size" @click="fixedOpen = true" />
        <TFloatingWindow
          v-model:open="fixedOpen"
          title="Fixed size"
          :initial-width="280"
          :initial-height="160"
          :resizable="false"
          :minimizable="false"
        >
          <div class="p-4 text-sm text-ink-secondary">
            This window cannot be resized or minimized.
          </div>
        </TFloatingWindow>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TFloatingWindow from './TFloatingWindow.vue'
import TButton from './TButton.vue'

const state = reactive<{
  open: boolean
  title: string
  initialX: number
  initialY: number
  initialWidth: number
  initialHeight: number
  resizable: boolean
  minimizable: boolean
  withFooter: boolean
}>({
  open: false,
  title: 'Floating Window',
  initialX: 160,
  initialY: 140,
  initialWidth: 420,
  initialHeight: 280,
  resizable: true,
  minimizable: true,
  withFooter: true,
})

const openA = ref(false)
const openB = ref(false)
const fixedOpen = ref(false)
</script>
