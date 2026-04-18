<template>
  <div class="inline-flex items-center gap-2">
    <input
      v-for="(_, i) in slots"
      :key="i"
      :ref="(el) => setSlotRef(el as HTMLInputElement | null, i)"
      :value="slots[i]"
      :type="type === 'number' ? 'tel' : 'text'"
      :inputmode="type === 'number' ? 'numeric' : undefined"
      :autocomplete="otp ? 'one-time-code' : undefined"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="1"
      class="bg-fill-subtle border-line text-ink focus:border-line-strong h-11 w-10 rounded-sm border text-center text-lg font-semibold transition-colors focus:outline-none disabled:opacity-40"
      @input="onInput($event, i)"
      @keydown="onKeydown($event, i)"
      @paste="onPaste($event, i)"
      @focus="onFocus($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    length?: number
    type?: 'text' | 'number'
    otp?: boolean
    disabled?: boolean
    placeholder?: string
  }>(),
  { length: 6, type: 'text', otp: false, disabled: false, placeholder: '○' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  complete: [value: string]
}>()

const toArray = (v: string | string[] | undefined, n: number): string[] => {
  const arr = Array.isArray(v) ? [...v] : (v ?? '').split('')
  while (arr.length < n) arr.push('')
  return arr.slice(0, n)
}

const slots = ref<string[]>(toArray(props.modelValue, props.length))

watch(
  () => props.modelValue,
  (next) => {
    const nextArr = toArray(next, props.length)
    if (nextArr.join('') !== slots.value.join('')) slots.value = nextArr
  },
)

const refs = ref<(HTMLInputElement | null)[]>([])
const setSlotRef = (el: HTMLInputElement | null, i: number) => {
  refs.value[i] = el
}

const emitChange = () => {
  const joined = slots.value.join('')
  if (Array.isArray(props.modelValue)) emit('update:modelValue', [...slots.value])
  else emit('update:modelValue', joined)
  if (joined.length === props.length && !slots.value.includes('')) emit('complete', joined)
}

const focusSlot = (i: number) => {
  nextTick(() => {
    refs.value[i]?.focus()
    refs.value[i]?.select()
  })
}

const onInput = (e: Event, i: number) => {
  const target = e.target as HTMLInputElement
  const raw = target.value
  const char = raw.slice(-1)
  slots.value[i] = char
  target.value = char
  emitChange()
  if (char && i < props.length - 1) focusSlot(i + 1)
}

const onKeydown = (e: KeyboardEvent, i: number) => {
  if (e.key === 'Backspace' && !slots.value[i] && i > 0) {
    slots.value[i - 1] = ''
    emitChange()
    focusSlot(i - 1)
    e.preventDefault()
  } else if (e.key === 'ArrowLeft' && i > 0) {
    focusSlot(i - 1)
    e.preventDefault()
  } else if (e.key === 'ArrowRight' && i < props.length - 1) {
    focusSlot(i + 1)
    e.preventDefault()
  }
}

const onPaste = (e: ClipboardEvent, i: number) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text') ?? ''
  const chars = text.slice(0, props.length - i).split('')
  for (let j = 0; j < chars.length; j++) {
    slots.value[i + j] = chars[j] ?? ''
  }
  emitChange()
  const next = Math.min(i + chars.length, props.length - 1)
  focusSlot(next)
}

const onFocus = (e: FocusEvent) => {
  ;(e.target as HTMLInputElement).select()
}
</script>
