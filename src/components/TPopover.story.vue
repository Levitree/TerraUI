<template>
  <Story title="TPopover" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="state.side"
          title="Side"
          :options="['top', 'right', 'bottom', 'left']"
        />
        <HstSelect v-model="state.align" title="Align" :options="['start', 'center', 'end']" />
        <HstSelect v-model="state.mode" title="Mode" :options="['click', 'hover']" />
        <HstNumber v-model="state.sideOffset" title="Side offset (px)" />
      </template>

      <div class="p-12 bg-bg min-h-96 flex items-center justify-center">
        <TPopover
          :mode="state.mode"
          :content="{ side: state.side, align: state.align, sideOffset: state.sideOffset }"
        >
          <template #trigger="{ open }">
            <TButton label="Toggle popover" icon="message-circle" :active="open" />
          </template>

          <div class="w-72 p-4 flex flex-col gap-3 text-sm">
            <div class="flex items-center gap-2">
              <TIcon name="sparkles" size="sm" class="text-ink" />
              <span class="font-bold tracking-wider uppercase text-[0.65rem]">Quick tip</span>
            </div>
            <p class="text-ink-secondary leading-relaxed">
              Popovers teleport to body and stay viewport-anchored, so they clear overflow ancestors
              without extra work.
            </p>
          </div>
        </TPopover>
      </div>
    </Variant>

    <Variant title="Hover — tooltip style">
      <div class="p-12 bg-bg min-h-60 flex items-center justify-center gap-6">
        <TPopover mode="hover" :content="{ side: 'top' }">
          <template #trigger>
            <TButton color="ghost" label="Hover me" icon="info" />
          </template>
          <div class="px-3 py-2 text-xs text-ink">Showing details on hover.</div>
        </TPopover>

        <TPopover mode="hover" :content="{ side: 'right' }">
          <template #trigger>
            <TButton color="icon" icon="help-circle" />
          </template>
          <div class="w-56 p-3 text-xs text-ink-secondary">
            Popover can render any content — tooltips, keyboard shortcuts, richer cards.
          </div>
        </TPopover>
      </div>
    </Variant>

    <Variant title="Form inside a popover">
      <div class="p-12 bg-bg min-h-96 flex items-center justify-center">
        <TPopover :content="{ side: 'bottom', align: 'end' }">
          <template #trigger>
            <TButton label="Edit profile" icon="pencil" />
          </template>
          <template #default="{ close }">
            <div class="w-72 p-4 flex flex-col gap-3">
              <label class="text-[0.6rem] font-bold tracking-wider uppercase text-ink-muted">
                Display name
              </label>
              <input
                v-model="name"
                class="bg-fill-subtle border border-line rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-line-strong"
              />
              <div class="flex items-center justify-end gap-2">
                <TButton color="ghost" size="sm" label="Cancel" @click="close" />
                <TButton color="success" size="sm" label="Save" @click="close" />
              </div>
            </div>
          </template>
        </TPopover>
      </div>
    </Variant>

    <Variant title="All sides">
      <div class="p-12 bg-bg min-h-96 grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
        <TPopover v-for="side in sides" :key="side" :content="{ side }">
          <template #trigger>
            <TButton :label="side" />
          </template>
          <div class="px-3 py-2 text-xs text-ink">side = {{ side }}</div>
        </TPopover>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TPopover from './TPopover.vue'
import TButton from './TButton.vue'
import TIcon from './TIcon.vue'

const sides = ['top', 'right', 'bottom', 'left'] as const

const state = reactive<{
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'start' | 'center' | 'end'
  mode: 'click' | 'hover'
  sideOffset: number
}>({
  side: 'bottom',
  align: 'center',
  mode: 'click',
  sideOffset: 6,
})

const name = ref('Aiden')
</script>
