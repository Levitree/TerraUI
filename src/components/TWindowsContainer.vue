<template>
  <TFloatingWindow
    v-for="win in windowManager.windows"
    :key="win.id"
    :open="true"
    :title="resolveTitle(win)"
    :initial-x="win.position.x"
    :initial-y="win.position.y"
    :initial-width="win.size.width"
    :initial-height="win.size.height"
    @update:open="(v: boolean) => !v && windowManager.closeWindow(win.id)"
    @move="(x: number, y: number) => windowManager.updatePosition(win.id, x, y)"
    @resize="(w: number, h: number) => windowManager.updateSize(win.id, w, h)"
    @focus="windowManager.bringToFront(win.id)"
  >
    <component
      :is="resolveComponent(win)"
      v-if="resolveComponent(win)"
      v-bind="resolveProps(win)"
    />
    <div v-else class="p-4 text-ink-subtle text-center text-sm">
      No renderer registered for window type "{{ win.type }}"
    </div>
  </TFloatingWindow>
</template>

<script setup lang="ts">
import TFloatingWindow from './TFloatingWindow.vue'
import {
  getWindowTypeConfig,
  useWindowManager,
  type WindowState,
} from '../composables/useWindowManager'

const props = defineProps<{
  /**
   * Optional override to compute the title for a window. If not provided, the
   * window's own `title` is used. Useful for apps that want to resolve a
   * display label from their own store (e.g. a camera name keyed by
   * `win.deviceId`).
   */
  titleResolver?: (win: WindowState) => string
}>()

const windowManager = useWindowManager()

const resolveTitle = (win: WindowState) =>
  props.titleResolver ? props.titleResolver(win) : win.title

const resolveComponent = (win: WindowState) => getWindowTypeConfig(win.type)?.component

const resolveProps = (win: WindowState): Record<string, unknown> => ({
  initialState: { ...(win.props ?? {}), windowId: win.id, deviceId: win.deviceId },
})
</script>
