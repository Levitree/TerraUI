<template>
  <Story title="NumericKeypadWindow" group="windows">
    <Variant title="Playground">
      <template #controls>
        <HstNumber v-model="state.initialValue" title="Initial value" />
        <HstNumber v-model="state.min" title="Min" />
        <HstNumber v-model="state.max" title="Max" />
        <HstText v-model="state.suffix" title="Suffix (e.g. °C, %)" />
      </template>

      <div class="p-6 bg-bg min-h-[32rem] flex flex-col items-center gap-4">
        <div class="w-[300px] h-[420px] border border-line-subtle rounded-sm overflow-hidden">
          <NumericKeypadWindow
            :key="`${state.initialValue}-${state.min}-${state.max}-${state.suffix}`"
            :initial-state="{
              initialValue: state.initialValue,
              min: state.min,
              max: state.max,
              suffix: state.suffix || undefined,
              onConfirm: handleConfirm,
              onCancel: handleCancel,
            }"
          />
        </div>
        <div class="text-xs text-ink-muted">
          Last result: <span class="text-ink font-mono">{{ lastResult }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Integers (no decimals)">
      <div class="p-6 bg-bg min-h-[32rem] flex justify-center">
        <div class="w-[300px] h-[420px] border border-line-subtle rounded-sm overflow-hidden">
          <NumericKeypadWindow
            :initial-state="{
              initialValue: 42,
              min: 0,
              max: 100,
              onConfirm: (v) => (lastResult = `int ${v}`),
            }"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Decimals with suffix">
      <div class="p-6 bg-bg min-h-[32rem] flex justify-center">
        <div class="w-[300px] h-[420px] border border-line-subtle rounded-sm overflow-hidden">
          <NumericKeypadWindow
            :initial-state="{
              initialValue: 21.5,
              min: -10,
              max: 40,
              suffix: '°C',
              onConfirm: (v) => (lastResult = `decimal ${v}°C`),
            }"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Percentage">
      <div class="p-6 bg-bg min-h-[32rem] flex justify-center">
        <div class="w-[300px] h-[420px] border border-line-subtle rounded-sm overflow-hidden">
          <NumericKeypadWindow
            :initial-state="{
              initialValue: 75,
              min: 0,
              max: 100,
              suffix: '%',
              onConfirm: (v) => (lastResult = `${v}%`),
            }"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Via window manager">
      <div class="relative p-6 bg-bg min-h-[36rem]">
        <div class="flex flex-col items-start gap-2">
          <p class="text-sm text-ink-muted">
            Open the keypad as a floating window, hosted by
            <code>TWindowsContainer</code>.
          </p>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 text-xs text-ink bg-fill border border-line rounded-sm"
              @click="openKeypad('integer')"
            >
              Open integer
            </button>
            <button
              class="px-3 py-1 text-xs text-ink bg-fill border border-line rounded-sm"
              @click="openKeypad('decimal')"
            >
              Open decimal (°C)
            </button>
            <button
              class="px-3 py-1 text-xs text-ink bg-fill border border-line rounded-sm"
              @click="openKeypad('percent')"
            >
              Open percent
            </button>
            <button
              class="px-3 py-1 text-xs text-ink-muted border border-line-subtle rounded-sm"
              @click="windowManager.closeAll()"
            >
              Close all
            </button>
          </div>
          <div class="text-xs text-ink-muted">
            Last result: <span class="text-ink font-mono">{{ lastResult }}</span>
          </div>
        </div>

        <TWindowsContainer />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import NumericKeypadWindow from './NumericKeypadWindow.vue'
import TWindowsContainer from '../TWindowsContainer.vue'
import { useWindowManager } from '../../composables/useWindowManager'
// Side-effect import: registers the 'numeric-keypad' window type.
import './index'

const state = reactive<{
  initialValue: number
  min: number
  max: number
  suffix: string
}>({
  initialValue: 0,
  min: 0,
  max: 100,
  suffix: '',
})

const lastResult = ref<string>('—')

const handleConfirm = (v: number) => {
  lastResult.value = String(v)
}
const handleCancel = () => {
  lastResult.value = 'cancelled'
}

const windowManager = useWindowManager()

type Preset = 'integer' | 'decimal' | 'percent'

const presets: Record<Preset, { title: string; props: Record<string, unknown> }> = {
  integer: {
    title: 'Enter integer',
    props: { initialValue: 10, min: 0, max: 999 },
  },
  decimal: {
    title: 'Set temperature',
    props: { initialValue: 21.5, min: -10, max: 40, suffix: '°C' },
  },
  percent: {
    title: 'Set brightness',
    props: { initialValue: 75, min: 0, max: 100, suffix: '%' },
  },
}

const openKeypad = (preset: Preset) => {
  const { title, props } = presets[preset]
  windowManager.openWindow('numeric-keypad', {
    title,
    props: {
      ...props,
      onConfirm: (v: number) => {
        lastResult.value = `${preset}: ${v}`
      },
      onCancel: () => {
        lastResult.value = `${preset}: cancelled`
      },
    },
  })
}
</script>
