<template>
  <Story title="TProgress" group="data-display">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.value" title="Value" />
        <HstNumber v-model="state.max" title="Max" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['neutral', 'success', 'error', 'warn']"
        />
        <HstSelect v-model="state.size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
        <HstText v-model="state.label" title="Label" />
        <HstCheckbox v-model="state.showValue" title="Show value" />
        <HstCheckbox v-model="state.indeterminate" title="Indeterminate" />
      </template>

      <div class="p-6 bg-bg min-h-40">
        <TProgress
          :model-value="state.indeterminate ? null : state.value"
          :max="state.max"
          :color="state.color"
          :size="state.size"
          :label="state.label || undefined"
          :show-value="state.showValue"
        />
      </div>
    </Variant>

    <Variant title="Colors">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TProgress :model-value="70" color="neutral" label="Neutral" show-value />
        <TProgress :model-value="70" color="success" label="Success" show-value />
        <TProgress :model-value="70" color="warn" label="Warning" show-value />
        <TProgress :model-value="70" color="error" label="Error" show-value />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TProgress :model-value="40" size="xs" label="Extra small" />
        <TProgress :model-value="55" size="sm" label="Small" />
        <TProgress :model-value="70" size="md" label="Medium" />
        <TProgress :model-value="85" size="lg" label="Large" />
      </div>
    </Variant>

    <Variant title="Indeterminate">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TProgress :model-value="null" label="Loading" />
        <TProgress :model-value="null" color="success" size="md" />
      </div>
    </Variant>

    <Variant title="Live animation">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <TProgress :model-value="animated" label="Uploading" show-value color="success" />
        <p class="text-xs text-ink-muted">Cycles every ~4s</p>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div class="p-6 bg-bg flex items-end gap-6 h-60">
        <TProgress :model-value="30" orientation="vertical" size="md" color="success" />
        <TProgress :model-value="60" orientation="vertical" size="md" color="warn" />
        <TProgress :model-value="90" orientation="vertical" size="md" color="error" />
        <TProgress :model-value="null" orientation="vertical" size="md" color="neutral" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import TProgress from './TProgress.vue'
import type { ProgressColor, ProgressSize } from './TProgress.vue'

const state = reactive<{
  value: number
  max: number
  color: ProgressColor
  size: ProgressSize
  label: string
  showValue: boolean
  indeterminate: boolean
}>({
  value: 42,
  max: 100,
  color: 'neutral',
  size: 'sm',
  label: 'Progress',
  showValue: true,
  indeterminate: false,
})

const animated = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    animated.value = (animated.value + 5) % 105
  }, 200)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
