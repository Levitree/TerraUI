<template>
  <Story title="TSlider" group="forms">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.min" title="Min" />
        <HstNumber v-model="state.max" title="Max" />
        <HstNumber v-model="state.step" title="Step" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['neutral', 'success', 'error', 'warn']"
        />
        <HstCheckbox v-model="state.showValue" title="Show value" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <div class="p-6 bg-bg min-h-40 max-w-md">
        <TSlider
          v-model="state.value"
          :min="state.min"
          :max="state.max"
          :step="state.step"
          :size="state.size"
          :color="state.color"
          :show-value="state.showValue"
          :disabled="state.disabled"
        />
        <p class="mt-4 text-xs text-ink-muted">Value: {{ state.value }}</p>
      </div>
    </Variant>

    <Variant title="Colors">
      <div class="p-6 bg-bg flex flex-col gap-5 max-w-md">
        <TSlider :model-value="40" color="neutral" show-value />
        <TSlider :model-value="55" color="success" show-value />
        <TSlider :model-value="70" color="warn" show-value />
        <TSlider :model-value="85" color="error" show-value />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-5 max-w-md">
        <TSlider :model-value="30" size="sm" />
        <TSlider :model-value="50" size="md" />
        <TSlider :model-value="70" size="lg" />
      </div>
    </Variant>

    <Variant title="Range (dual thumb)">
      <div class="p-6 bg-bg max-w-md">
        <TSlider v-model="range" :min="0" :max="100" color="neutral" show-value />
        <p class="mt-3 text-xs text-ink-muted">Value: {{ range }}</p>
      </div>
    </Variant>

    <Variant title="Custom formatter">
      <div class="p-6 bg-bg max-w-md">
        <TSlider
          v-model="price"
          :min="0"
          :max="500"
          :step="5"
          color="success"
          show-value
          :formatter="(v) => `$${v}`"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div class="p-6 bg-bg max-w-md">
        <TSlider :model-value="60" disabled show-value />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TSlider from './TSlider.vue'
import type { TSliderColor, TSliderSize } from './TSlider.vue'

const state = reactive<{
  value: number
  min: number
  max: number
  step: number
  size: TSliderSize
  color: TSliderColor
  showValue: boolean
  disabled: boolean
}>({
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  color: 'neutral',
  showValue: true,
  disabled: false,
})

const range = ref<[number, number]>([25, 75])
const price = ref(120)
</script>
