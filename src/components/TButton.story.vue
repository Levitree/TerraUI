<template>
  <Story title="TButton" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['neutral', 'success', 'error', 'warn', 'ghost', 'icon', 'white']"
        />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstText v-model="state.icon" title="Icon (lucide name)" />
        <HstCheckbox v-model="state.iconRight" title="Icon right" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstCheckbox v-model="state.active" title="Active" />
        <HstCheckbox v-model="state.fullWidth" title="Full width" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TButton
          :label="state.label"
          :color="state.color"
          :size="state.size"
          :icon="state.icon || undefined"
          :icon-right="state.iconRight"
          :disabled="state.disabled"
          :loading="state.loading"
          :active="state.active"
          :full-width="state.fullWidth"
        />
      </div>
    </Variant>

    <Variant title="Colors">
      <div class="p-6 bg-bg flex flex-wrap gap-3">
        <TButton
          v-for="c in colors"
          :key="c"
          :color="c"
          :label="c"
          :icon="c === 'icon' ? 'settings' : undefined"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TButton size="sm" label="Small" />
        <TButton size="md" label="Medium" />
        <TButton size="lg" label="Large" />
      </div>
    </Variant>

    <Variant title="Icon buttons">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TButton color="icon" size="sm" icon="plus" />
        <TButton color="icon" size="md" icon="plus" />
        <TButton color="icon" size="lg" icon="plus" />
        <TButton color="icon" icon="settings" active />
      </div>
    </Variant>

    <Variant title="With icon">
      <div class="p-6 bg-bg flex flex-wrap gap-3">
        <TButton icon="plus" label="Leading icon" />
        <TButton icon="arrow-right" icon-right label="Trailing icon" />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex flex-wrap gap-3">
        <TButton label="Default" />
        <TButton label="Active" active />
        <TButton label="Disabled" disabled />
        <TButton label="Loading" loading />
      </div>
    </Variant>

    <Variant title="Async click">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TButton label="Click me" :async-click="simulateAsync" />
        <span class="text-xs text-ink-muted">Resolves after ~1.2s</span>
      </div>
    </Variant>

    <Variant title="Full width">
      <div class="p-6 bg-bg w-96">
        <TButton label="Full width" full-width icon="check" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TButton from './TButton.vue'
import type { ButtonColor, ButtonSize } from './TButton.vue'

const colors: ButtonColor[] = [
  'neutral',
  'success',
  'error',
  'warn',
  'ghost',
  'icon',
  'white',
]

const state = reactive<{
  label: string
  color: ButtonColor
  size: ButtonSize
  icon: string
  iconRight: boolean
  disabled: boolean
  loading: boolean
  active: boolean
  fullWidth: boolean
}>({
  label: 'Button',
  color: 'neutral',
  size: 'md',
  icon: '',
  iconRight: false,
  disabled: false,
  loading: false,
  active: false,
  fullWidth: false,
})

const simulateAsync = () => new Promise<void>((resolve) => setTimeout(resolve, 1200))
</script>
