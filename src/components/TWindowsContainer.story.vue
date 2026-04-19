<template>
  <Story title="TWindowsContainer" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Window title" />
      </template>

      <div class="p-6 bg-bg min-h-96 relative flex flex-col items-center justify-center gap-3">
        <p class="text-sm text-ink-muted max-w-md text-center">
          <code>TWindowsContainer</code> mounts one <code>TFloatingWindow</code> per entry in the
          window manager. Open one with <code>useWindowManager().openWindow(type)</code>.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <TButton label="Open Window" icon="app-window" @click="openDemo" />
          <TButton
            color="neutral"
            label="Close all"
            icon="x"
            :disabled="!windowManager.hasWindows"
            @click="windowManager.closeAll()"
          />
        </div>
        <span class="text-xs text-ink-muted"> Open: {{ windowManager.windows.length }} </span>

        <TWindowsContainer />
      </div>
    </Variant>

    <Variant title="Multiple types">
      <div class="p-6 bg-bg min-h-96 relative flex items-center justify-center gap-3">
        <TButton label="Open Inspector" icon="search" @click="openInspector" />
        <TButton color="neutral" label="Open Notes" icon="notebook" @click="openNotes" />

        <TWindowsContainer />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
/* eslint-disable vue/one-component-per-file -- story file defines demo components inline */
import { defineComponent, h, reactive, onMounted } from 'vue'
import TWindowsContainer from './TWindowsContainer.vue'
import TButton from './TButton.vue'
import { registerWindowType, useWindowManager } from '../composables/useWindowManager'

const windowManager = useWindowManager()

const state = reactive<{
  title: string
}>({
  title: 'Demo Window',
})

const DemoPanel = defineComponent({
  name: 'DemoPanel',
  props: { initialState: { type: Object, default: () => ({}) } },
  setup(props) {
    return () =>
      h('div', { class: 'p-4 flex flex-col gap-2 text-sm text-ink-secondary' }, [
        h('p', null, 'This is a window rendered by TWindowsContainer.'),
        h(
          'p',
          { class: 'text-ink-muted' },
          `windowId: ${String((props.initialState as { windowId?: string }).windowId ?? '—')}`,
        ),
      ])
  },
})

const InspectorPanel = defineComponent({
  name: 'InspectorPanel',
  setup() {
    return () =>
      h('div', { class: 'p-4 text-sm text-ink-secondary' }, [
        h(
          'div',
          { class: 'font-bold uppercase tracking-wider text-xs text-ink mb-2' },
          'Inspector',
        ),
        h('p', null, 'Inspect the selected entity here.'),
      ])
  },
})

const NotesPanel = defineComponent({
  name: 'NotesPanel',
  setup() {
    return () =>
      h('div', { class: 'p-4 text-sm text-ink-secondary' }, [
        h('div', { class: 'font-bold uppercase tracking-wider text-xs text-ink mb-2' }, 'Notes'),
        h('p', null, 'Jot anything down. Content scrolls when it overflows.'),
      ])
  },
})

onMounted(() => {
  registerWindowType('story-demo', {
    component: DemoPanel,
    defaultTitle: 'Demo Window',
    defaultSize: { width: 380, height: 220 },
  })
  registerWindowType('story-inspector', {
    component: InspectorPanel,
    defaultTitle: 'Inspector',
    defaultSize: { width: 360, height: 260 },
  })
  registerWindowType('story-notes', {
    component: NotesPanel,
    defaultTitle: 'Notes',
    defaultSize: { width: 360, height: 260 },
  })
})

const openDemo = () => {
  windowManager.openWindow('story-demo', { title: state.title })
}

const openInspector = () => {
  windowManager.openWindow('story-inspector')
}

const openNotes = () => {
  windowManager.openWindow('story-notes')
}
</script>
