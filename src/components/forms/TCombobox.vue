<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      :disabled="disabled"
      :class="triggerClasses"
      @click.stop="toggle"
      @keydown="onTriggerKeydown"
    >
      <div class="flex-1 flex items-center gap-1.5 min-w-0 flex-wrap">
        <template v-if="multiple && selectedOptions.length">
          <span
            v-for="opt in selectedOptions"
            :key="String(opt.value)"
            class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-fill border border-line-subtle text-[0.7rem] text-ink"
          >
            {{ opt.label }}
            <button
              type="button"
              class="text-ink-muted hover:text-ink cursor-pointer"
              :aria-label="`Remove ${opt.label}`"
              @click.stop="removeOption(opt)"
            >
              <TIcon name="x" size="xs" />
            </button>
          </span>
        </template>
        <span v-else-if="!multiple && displayLabel" class="truncate text-ink">
          {{ displayLabel }}
        </span>
        <span v-else class="text-ink-placeholder truncate">{{ placeholder }}</span>
      </div>
      <TIcon
        :name="isOpen ? 'chevron-up' : 'chevron-down'"
        size="sm"
        class="text-ink-muted shrink-0"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :style="floatingStyles"
        class="z-100000 min-w-50 bg-elevated border border-line rounded-sm shadow-xl shadow-overlay overflow-hidden"
      >
        <div class="px-2 pt-2 pb-1 border-b border-line-subtle">
          <div class="relative">
            <TIcon
              name="search"
              size="xs"
              class="absolute left-2 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
            />
            <input
              ref="searchRef"
              v-model="query"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full bg-fill-subtle border border-line rounded-sm pl-7 pr-2 py-1.5 text-xs text-ink placeholder-ink-placeholder focus:outline-none focus:border-line-strong"
              @keydown="onSearchKeydown"
              @click.stop
            />
          </div>
        </div>

        <div class="max-h-60 overflow-y-auto py-1">
          <button
            v-for="(option, index) in filteredOptions"
            :key="String(option.value)"
            type="button"
            :disabled="option.disabled"
            :class="optionClasses(option, index)"
            @click.stop="selectOption(option)"
            @mouseenter="highlightedIndex = index"
          >
            <TIcon
              v-if="multiple"
              :name="isOptionSelected(option) ? 'square-check' : 'square'"
              size="sm"
              class="mr-1 shrink-0"
              :class="isOptionSelected(option) ? 'text-success' : 'text-ink-subtle'"
            />
            <TIcon v-else-if="option.icon" :name="option.icon" size="sm" class="mr-1 shrink-0 text-ink-muted" />
            <span class="flex-1 text-left truncate">{{ option.label }}</span>
            <TIcon
              v-if="!multiple && isOptionSelected(option)"
              name="check"
              size="sm"
              class="shrink-0 text-success"
            />
          </button>
          <div
            v-if="!filteredOptions.length"
            class="px-3 py-3 text-center text-xs text-ink-muted"
          >
            {{ emptyLabel }}
          </div>
        </div>

        <div v-if="$slots.footer" class="border-t border-line-subtle px-3 py-2">
          <slot name="footer" :close="close" :query="query" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import TIcon from '../TIcon.vue'
import { useFormField } from '../../composables/useFormField'

export type TComboboxSize = 'sm' | 'md' | 'lg'

export interface TComboboxOption {
  value: string | number
  label: string
  /** Optional Lucide icon rendered before the label (single-select mode). */
  icon?: string
  disabled?: boolean
}

export type TComboboxValue = string | number | (string | number)[]

const props = withDefaults(
  defineProps<{
    modelValue?: TComboboxValue
    options: TComboboxOption[]
    placeholder?: string
    emptyLabel?: string
    searchPlaceholder?: string
    /** Allow selecting multiple options (renders chips in the trigger). */
    multiple?: boolean
    /** Custom filter. Defaults to case-insensitive label prefix + substring match. */
    filter?: (option: TComboboxOption, query: string) => boolean
    disabled?: boolean
    error?: boolean | string
    size?: TComboboxSize
  }>(),
  {
    placeholder: '-- Select --',
    emptyLabel: 'No results',
    searchPlaceholder: 'Search…',
    multiple: false,
    disabled: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: TComboboxValue]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const field = useFormField<TComboboxValue>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => emit('update:modelValue', value),
})

const modelValueRef = computed(() => field.modelValue.value)

const isOpen = ref(false)
const justOpened = ref(false)
const highlightedIndex = ref(-1)
const query = ref('')
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const floatingStyles = ref<Record<string, string>>({})

const normalized = (v: string | number) => String(v)

const isOptionSelected = (option: TComboboxOption) => {
  const raw = modelValueRef.value
  if (Array.isArray(raw)) return raw.some((v) => normalized(v) === normalized(option.value))
  return raw !== undefined && normalized(raw) === normalized(option.value)
}

const selectedOptions = computed(() => {
  const raw = modelValueRef.value
  if (!Array.isArray(raw)) return []
  return props.options.filter((opt) => raw.some((v) => normalized(v) === normalized(opt.value)))
})

const displayLabel = computed(() => {
  if (props.multiple) return ''
  const raw = modelValueRef.value
  if (raw === undefined || raw === '' || Array.isArray(raw)) return ''
  const found = props.options.find((opt) => normalized(opt.value) === normalized(raw))
  return found?.label ?? ''
})

const defaultFilter = (option: TComboboxOption, q: string) => {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  return option.label.toLowerCase().includes(needle)
}

const filteredOptions = computed(() => {
  const filterFn = props.filter ?? defaultFilter
  return props.options.filter((opt) => filterFn(opt, query.value))
})

const updatePosition = () => {
  if (!containerRef.value || !isOpen.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = 320

  const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

  floatingStyles.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    ...(showAbove
      ? { bottom: `${viewportHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  }
}

const toggle = () => {
  if (props.disabled) return
  if (isOpen.value) close()
  else open()
}

const open = () => {
  isOpen.value = true
  justOpened.value = true
  query.value = ''
  nextTick(() => {
    updatePosition()
    searchRef.value?.focus()
    highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1
    setTimeout(() => {
      justOpened.value = false
    }, 0)
  })
}

const close = () => {
  isOpen.value = false
  highlightedIndex.value = -1
}

const selectOption = (option: TComboboxOption) => {
  if (option.disabled) return

  if (props.multiple) {
    const raw = Array.isArray(modelValueRef.value) ? [...modelValueRef.value] : []
    const key = normalized(option.value)
    const existingIndex = raw.findIndex((v) => normalized(v) === key)
    if (existingIndex >= 0) raw.splice(existingIndex, 1)
    else raw.push(option.value)
    field.setValue(raw)
  } else {
    field.setValue(option.value)
    close()
  }
}

const removeOption = (option: TComboboxOption) => {
  if (!props.multiple) return
  const raw = Array.isArray(modelValueRef.value) ? [...modelValueRef.value] : []
  const key = normalized(option.value)
  const next = raw.filter((v) => normalized(v) !== key)
  field.setValue(next)
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
    event.preventDefault()
    open()
  }
}

const onSearchKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return
  const list = filteredOptions.value
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, list.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && list[highlightedIndex.value]) {
        selectOption(list[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
    case 'Backspace':
      if (props.multiple && !query.value && Array.isArray(modelValueRef.value) && modelValueRef.value.length) {
        const raw = [...modelValueRef.value]
        raw.pop()
        field.setValue(raw)
      }
      break
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (justOpened.value) return
  if (containerRef.value?.contains(event.target as Node)) return
  if (dropdownRef.value?.contains(event.target as Node)) return
  close()
}

const handleScroll = () => {
  if (isOpen.value) updatePosition()
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', updatePosition)
})

watch(filteredOptions, (next) => {
  if (highlightedIndex.value >= next.length) {
    highlightedIndex.value = next.length ? 0 : -1
  }
})

const hasError = computed(() => !!field.error.value)

const triggerClasses = computed(() => {
  const classes = [
    'w-full flex items-center justify-between gap-2',
    'bg-fill-subtle border rounded-sm text-ink text-left',
    'focus:outline-none transition-all',
  ]

  if (hasError.value) classes.push('border-danger focus:border-danger')
  else classes.push('border-line focus:border-line-strong')

  if (props.disabled) classes.push('opacity-30 cursor-not-allowed')
  else classes.push('cursor-pointer hover:border-line-strong')

  switch (props.size) {
    case 'sm':
      classes.push('px-2 py-1 text-xs min-h-[30px]')
      break
    case 'lg':
      classes.push('px-4 py-2 text-base min-h-[46px]')
      break
    default:
      classes.push('px-3 py-1.5 text-sm min-h-[38px]')
  }

  return classes.join(' ')
})

const optionClasses = (option: TComboboxOption, index: number) => {
  const isSelected = isOptionSelected(option)
  const isHighlighted = index === highlightedIndex.value
  const classes = [
    'group w-full flex items-center gap-1 px-3 h-9 text-sm text-left transition-colors',
  ]

  if (option.disabled) {
    classes.push('text-ink-disabled cursor-not-allowed opacity-40')
  } else if (isSelected && !props.multiple) {
    classes.push('bg-fill-strong text-ink cursor-pointer')
  } else if (isHighlighted) {
    classes.push('bg-fill text-ink cursor-pointer')
  } else {
    classes.push('text-ink-secondary hover:bg-fill hover:text-ink cursor-pointer')
  }

  return classes.join(' ')
}
</script>
