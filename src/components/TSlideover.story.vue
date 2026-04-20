<template>
  <Story title="TSlideover" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.side"
          title="Side"
          :options="['left', 'right', 'top', 'bottom']"
        />
        <HstText v-model="state.size" title="Size (CSS length)" />
        <HstCheckbox v-model="state.dismissible" title="Dismissible" />
      </template>

      <div class="p-6 bg-bg min-h-96 flex items-center justify-center">
        <TButton label="Open slideover" icon="panel-left-open" @click="state.open = true" />

        <TSlideover
          v-model:open="state.open"
          :side="state.side"
          :size="state.size || undefined"
          :dismissible="state.dismissible"
        >
          <div class="flex items-center gap-2 h-14 px-4 border-b border-line-subtle">
            <TButton
              icon="x"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Close"
              @click="state.open = false"
            />
            <h2 class="text-sm font-bold tracking-wider uppercase text-ink">Slideover</h2>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-3">
            <p class="text-sm text-ink-secondary leading-relaxed">
              A side panel that slides in from the {{ state.side }}. Tap the backdrop, press
              <kbd class="px-1.5 py-0.5 bg-fill border border-line rounded-sm text-xs">Esc</kbd>, or
              use the close button to dismiss.
            </p>
            <p class="text-sm text-ink-muted">
              Use this as a foundation for mobile menus, settings sheets, form drafts, or any
              contextual panel that shouldn't take up the whole viewport.
            </p>
          </div>
        </TSlideover>
      </div>
    </Variant>

    <Variant title="Sides">
      <div class="p-6 bg-bg min-h-96 flex flex-wrap gap-3">
        <TButton
          v-for="s in sides"
          :key="s"
          color="neutral"
          :label="`Open ${s}`"
          @click="openSide(s)"
        />
        <TSlideover v-model:open="sideOpen" :side="currentSide">
          <div class="flex items-center gap-2 h-14 px-4 border-b border-line-subtle">
            <TButton
              icon="x"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Close"
              @click="sideOpen = false"
            />
            <h2 class="text-sm font-bold tracking-wider uppercase text-ink">
              From {{ currentSide }}
            </h2>
          </div>
          <div class="flex-1 overflow-y-auto p-6 text-sm text-ink-secondary">
            <p>
              Anchored to the <strong>{{ currentSide }}</strong> edge.
            </p>
          </div>
        </TSlideover>
      </div>
    </Variant>

    <Variant title="Non-dismissible (programmatic close)">
      <div class="p-6 bg-bg min-h-96 flex items-center justify-center">
        <TButton label="Open" @click="state.lockedOpen = true" />
        <TSlideover v-model:open="state.lockedOpen" side="right" :dismissible="false">
          <div class="flex items-center gap-2 h-14 px-4 border-b border-line-subtle">
            <h2 class="text-sm font-bold tracking-wider uppercase text-ink">Confirm first</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-3 text-sm text-ink-secondary">
            <p>Backdrop tap and Escape are disabled — the user must click the button below.</p>
          </div>
          <div class="border-t border-line-subtle px-4 py-3 flex justify-end">
            <TButton label="Acknowledge & close" @click="state.lockedOpen = false" />
          </div>
        </TSlideover>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TSlideover, { type SlideoverSide } from './TSlideover.vue'
import TButton from './TButton.vue'

const state = reactive<{
  open: boolean
  lockedOpen: boolean
  side: SlideoverSide
  size: string
  dismissible: boolean
}>({
  open: false,
  lockedOpen: false,
  side: 'right',
  size: '',
  dismissible: true,
})

const sides: SlideoverSide[] = ['left', 'right', 'top', 'bottom']
const sideOpen = ref(false)
const currentSide = ref<SlideoverSide>('left')
const openSide = (s: SlideoverSide) => {
  currentSide.value = s
  sideOpen.value = true
}
</script>
