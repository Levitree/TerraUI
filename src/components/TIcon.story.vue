<template>
  <Story title="TIcon" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.name" title="Name (lucide / i-lucide-*)" />
        <HstSelect v-model="state.size" title="Size" :options="['xs', 'sm', 'md', 'lg', 'xl']" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'success', 'error', 'warn', 'neutral']"
        />
        <HstNumber v-model="state.strokeWidth" title="Stroke width" :step="0.25" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center text-ink">
        <TIcon
          :name="state.name"
          :size="state.size"
          :stroke-width="state.strokeWidth"
          :color="state.color || undefined"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-center gap-4 text-ink">
        <div v-for="s in sizes" :key="s" class="flex flex-col items-center gap-1">
          <TIcon name="settings" :size="s" />
          <span class="text-[0.65rem] text-ink-muted uppercase tracking-wider">{{ s }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Colors">
      <div class="p-6 bg-bg flex items-center gap-4">
        <TIcon name="circle-check" size="lg" color="success" />
        <TIcon name="circle-alert" size="lg" color="error" />
        <TIcon name="triangle-alert" size="lg" color="warn" />
        <TIcon name="info" size="lg" color="neutral" />
      </div>
    </Variant>

    <Variant title="Common icons">
      <div class="p-6 bg-bg flex flex-wrap gap-5 text-ink">
        <div v-for="n in commonIcons" :key="n" class="flex flex-col items-center gap-1">
          <TIcon :name="n" size="lg" />
          <span class="text-[0.65rem] text-ink-muted">{{ n }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Stroke weights">
      <div class="p-6 bg-bg flex items-center gap-4 text-ink">
        <div v-for="w in [1, 1.5, 1.75, 2, 2.5]" :key="w" class="flex flex-col items-center gap-1">
          <TIcon name="check" size="xl" :stroke-width="w" />
          <span class="text-[0.65rem] text-ink-muted">{{ w }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Numeric size">
      <div class="p-6 bg-bg flex items-center gap-4 text-ink">
        <TIcon name="plus" :size="10" />
        <TIcon name="plus" :size="18" />
        <TIcon name="plus" :size="28" />
        <TIcon name="plus" :size="40" />
        <TIcon name="plus" :size="56" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TIcon from './TIcon.vue'
import type { IconColor, IconSize } from './TIcon.vue'

const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const commonIcons = ['plus', 'check', 'x', 'settings', 'arrow-right', 'loader-2']

const state = reactive<{
  name: string
  size: IconSize
  strokeWidth: number
  color: IconColor | ''
}>({
  name: 'settings',
  size: 'md',
  strokeWidth: 1.75,
  color: '',
})
</script>
