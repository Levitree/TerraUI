<template>
  <div class="relative" ref="containerRef">
    <button
      type="button"
      :disabled="disabled"
      :class="triggerClasses"
      @click.stop="toggle"
      @blur="onBlur"
      @keydown="handleKeydown"
    >
      <span class="truncate" :class="{ 'text-ink-placeholder': !hasSelection }">
        {{ displayLabel }}
      </span>
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
        <div class="max-h-50 overflow-y-auto">
          <button
            v-for="(option, index) in options"
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
              class="mr-2"
              :class="isOptionSelected(option) ? 'text-success' : 'text-ink-subtle'"
            />
            {{ option.label }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import TIcon from '../TIcon.vue'
import { useFormField } from '../../composables/useFormField'

export type TSelectSize = 'sm' | 'md' | 'lg'

export interface TSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    options: TSelectOption[]
    placeholder?: string
    emptyLabel?: string
    multiple?: boolean
    disabled?: boolean
    error?: boolean | string
    size?: TSelectSize
  }>(),
  {
    placeholder: '-- Select --',
    multiple: false,
    disabled: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const field = useFormField<string | string[]>({
  modelValue: () => props.modelValue,
  error: () => props.error,
  emit: (value) => emit('update:modelValue', value),
})

const modelValueRef = computed(() => field.modelValue.value)

const isOpen = ref(false)
const justOpened = ref(false)
const highlightedIndex = ref(-1)
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const floatingStyles = ref<Record<string, string>>({})

const hasSelection = computed(() => {
  if (props.multiple) {
    return Array.isArray(modelValueRef.value) && modelValueRef.value.length > 0
  }
  return modelValueRef.value !== undefined && modelValueRef.value !== ''
})

const displayLabel = computed(() => {
  if (!hasSelection.value) {
    return props.emptyLabel || props.placeholder
  }

  if (props.multiple && Array.isArray(modelValueRef.value)) {
    const count = modelValueRef.value.length
    if (count === 1) {
      const selected = props.options.find((opt) => modelValueRef.value?.includes(String(opt.value)))
      return selected?.label || `${count} selected`
    }
    return `${count} selected`
  }

  const selected = props.options.find((opt) => String(opt.value) === String(modelValueRef.value))
  return selected?.label || props.placeholder
})

const hasError = computed(() => !!field.error.value)

const isOptionSelected = (option: TSelectOption) => {
  if (props.multiple) {
    return Array.isArray(modelValueRef.value) && modelValueRef.value.includes(String(option.value))
  }
  return String(modelValueRef.value) === String(option.value)
}

const updatePosition = () => {
  if (!containerRef.value || !isOpen.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = 200 // max-h-[200px]

  // Determine if dropdown should appear above or below
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
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Mark as just opened to skip the click-outside handler for this event cycle
    justOpened.value = true
    nextTick(() => {
      updatePosition()
      // Set highlighted to current selection
      const currentIndex = props.options.findIndex(
        (opt) => String(opt.value) === String(modelValueRef.value),
      )
      highlightedIndex.value = currentIndex >= 0 ? currentIndex : 0
      // Reset after the current event cycle completes
      setTimeout(() => {
        justOpened.value = false
      }, 0)
    })
  }
}

const close = () => {
  isOpen.value = false
  highlightedIndex.value = -1
}

const selectOption = (option: TSelectOption) => {
  if (option.disabled) return

  if (props.multiple) {
    const currentValues = Array.isArray(modelValueRef.value) ? [...modelValueRef.value] : []
    const valueStr = String(option.value)
    const index = currentValues.indexOf(valueStr)
    if (index >= 0) {
      currentValues.splice(index, 1)
    } else {
      currentValues.push(valueStr)
    }
    field.setValue(currentValues)
  } else {
    field.setValue(String(option.value))
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      toggle()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < props.options.length) {
        selectOption(props.options[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

const onBlur = (event: FocusEvent) => {
  // Delay to allow click on dropdown options
  setTimeout(() => {
    if (
      !containerRef.value?.contains(document.activeElement) &&
      !dropdownRef.value?.contains(document.activeElement)
    ) {
      close()
    }
  }, 150)
  emit('blur', event)
  field.onBlur()
}

const handleClickOutside = (event: MouseEvent) => {
  // Skip if we just opened (same event cycle)
  if (justOpened.value) {
    return
  }
  // Skip if clicking on the trigger button (toggle handles that)
  if (containerRef.value?.contains(event.target as Node)) {
    return
  }
  // Skip if clicking inside the dropdown
  if (dropdownRef.value?.contains(event.target as Node)) {
    return
  }
  close()
}

const handleScroll = () => {
  if (isOpen.value) {
    updatePosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', updatePosition)
})

// Watch for external value changes
watch(
  () => modelValueRef.value,
  () => {
    if (isOpen.value) {
      const currentIndex = props.options.findIndex(
        (opt) => String(opt.value) === String(modelValueRef.value),
      )
      if (currentIndex >= 0) {
        highlightedIndex.value = currentIndex
      }
    }
  },
)

const triggerClasses = computed(() => {
  const classes = [
    'w-full flex items-center justify-between gap-2',
    'bg-fill-subtle border rounded-sm text-ink text-left',
    'focus:outline-none transition-all',
  ]

  if (hasError.value) {
    classes.push('border-danger focus:border-danger')
  } else {
    classes.push('border-line focus:border-line-strong')
  }

  if (props.disabled) {
    classes.push('opacity-30 cursor-not-allowed')
  } else {
    classes.push('cursor-pointer hover:border-line-strong')
  }

  switch (props.size) {
    case 'sm':
      classes.push('px-2 py-1 text-xs')
      break
    case 'lg':
      classes.push('px-4 py-3 text-base')
      break
    default:
      classes.push('px-3 py-2 text-sm')
  }

  return classes.join(' ')
})

const optionClasses = (option: TSelectOption, index: number) => {
  const isSelected = isOptionSelected(option)
  const isHighlighted = index === highlightedIndex.value

  // Match TDropdown menu items: px-3 h-9 text-sm, text-ink-secondary with
  // hover:bg-fill hover:text-ink. Single-select uses bg-fill-strong for the
  // current selection; multi-select shows selection via the square-check icon.
  const classes = [
    'group w-full flex items-center gap-2 px-3 h-9 text-sm text-left transition-colors',
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
