<template>
  <div class="flex flex-col h-full p-3 gap-3 bg-page">
    <div
      class="shrink-0 px-3 py-3 border border-line rounded-sm bg-fill-subtle flex items-baseline justify-end gap-2 min-h-14"
    >
      <span class="font-mono text-2xl text-ink tabular-nums break-all text-right">
        {{ displayText || '0' }}
      </span>
      <span v-if="suffix" class="text-sm text-ink-muted">{{ suffix }}</span>
    </div>

    <div class="flex-1 grid grid-cols-4 grid-rows-4 gap-2">
      <button v-for="k in digitKeys" :key="k" :class="keyClass" @click="pressDigit(k)">
        {{ k }}
      </button>
      <button :class="keyClass" @click="backspace"><TIcon name="arrow-left" size="sm" /></button>

      <button :class="keyClass" @click="clearAll">
        <span class="text-[0.65rem] font-bold tracking-wider">Clr</span>
      </button>

      <button :class="keyClass" :disabled="buffer.includes('.')" @click="pressDot">.</button>

      <button :class="cancelKeyClass" @click="cancel"><TIcon name="x" size="sm" /></button>
      <button :class="[keyClass, 'col-span-2']" @click="pressDigit('0')">0</button>
      <button :class="confirmKeyClass" @click="confirm"><TIcon name="check" size="sm" /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowManager } from '../../composables/useWindowManager'
import TIcon from '../TIcon.vue'

export interface NumericKeypadInitialState {
  windowId?: string
  initialValue?: number
  min?: number
  max?: number
  suffix?: string
  onConfirm?: (value: number) => void
  onCancel?: () => void
}

const props = defineProps<{
  initialState?: NumericKeypadInitialState
}>()

const formatInitial = (v: number | undefined): string => {
  if (v === undefined || v === null || Number.isNaN(v)) return ''
  return String(v)
}

const buffer = ref(formatInitial(props.initialState?.initialValue))
const suffix = computed(() => props.initialState?.suffix)

const digitKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

const displayText = computed(() => buffer.value)

const keyClass =
  'flex items-center justify-center rounded-sm bg-fill-subtle border border-line text-ink font-mono text-xl hover:bg-fill hover:border-line-strong active:bg-fill-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all'

const cancelKeyClass =
  'flex items-center justify-center rounded-sm bg-danger border border-danger text-danger text-lg hover:bg-danger active:bg-danger transition-all'

const confirmKeyClass =
  'flex items-center justify-center rounded-sm bg-success border border-success text-success text-lg hover:bg-success active:bg-success transition-all'

function pressDigit(d: string) {
  if (buffer.value === '0') buffer.value = ''
  buffer.value += d
}

function pressDot() {
  if (buffer.value === '') buffer.value = '0'
  if (!buffer.value.includes('.')) buffer.value += '.'
}

function backspace() {
  buffer.value = buffer.value.slice(0, -1)
}

function clearAll() {
  buffer.value = ''
}

function clamp(v: number): number {
  let x = v
  if (props.initialState?.min !== undefined) x = Math.max(props.initialState.min, x)
  if (props.initialState?.max !== undefined) x = Math.min(props.initialState.max, x)
  return x
}

function confirm() {
  const parsed = parseFloat(buffer.value)
  if (!Number.isNaN(parsed)) {
    props.initialState?.onConfirm?.(clamp(parsed))
  }
  close()
}

function cancel() {
  props.initialState?.onCancel?.()
  close()
}

function close() {
  const id = props.initialState?.windowId
  if (!id) return
  useWindowManager().closeWindow(id)
}
</script>
