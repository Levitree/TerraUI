<template>
  <div class="bg-surface backdrop-blur-lg rounded-sm border border-line-subtle relative">
    <!-- Header Overlay (for edit mode, etc.) -->
    <slot name="header-overlay" />

    <!-- Header -->
    <div
      class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-fill-subtle transition-colors select-none"
      @click="toggle"
    >
      <div class="flex items-center gap-4">
        <!-- Status Indicator -->
        <TStatusIndicator v-if="status" :status="status" :pulse="status === 'online'" />
        <!-- Chevron (only if no status) -->
        <TIcon
          v-else
          name="chevron-right"
          size="sm"
          class="text-ink-muted transition-transform duration-200"
          :class="{ 'rotate-90': isExpanded }"
        />
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-3">
            <h3 class="text-base font-bold tracking-wide text-ink m-0">
              {{ title }}
            </h3>
            <span
              v-if="count !== undefined"
              class="px-2 py-0.5 text-[0.65rem] font-bold tracking-wider rounded-sm"
              :class="count > 0 ? 'bg-fill text-ink-secondary' : 'bg-fill-subtle text-ink-subtle'"
            >
              {{ count }}
            </span>
          </div>
          <p v-if="description" class="text-xs text-ink-subtle m-0">
            {{ description }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2" @click.stop>
        <slot name="actions" />
        <!-- Chevron toggle button (when status is shown) -->
        <button
          v-if="status"
          class="p-2 flex items-center justify-center border border-line bg-fill-subtle rounded-sm text-ink-muted hover:bg-fill hover:border-line-strong hover:text-ink transition-all"
          @click.stop="toggle"
        >
          <TIcon :name="isExpanded ? 'chevron-up' : 'chevron-down'" size="sm" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-show="isExpanded" class="px-5 pb-5 pt-2 border-t border-line-subtle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TIcon from './TIcon.vue'
import TStatusIndicator from './TStatusIndicator.vue'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    count?: number
    defaultExpanded?: boolean
    status?: 'online' | 'offline'
  }>(),
  {
    defaultExpanded: false,
  },
)

const emit = defineEmits<{
  'update:expanded': [value: boolean]
}>()

const isExpanded = ref(props.defaultExpanded)

const toggle = () => {
  isExpanded.value = !isExpanded.value
  emit('update:expanded', isExpanded.value)
}

// Allow external control via v-model:expanded
watch(
  () => props.defaultExpanded,
  (val) => {
    isExpanded.value = val
  },
)

defineExpose({ isExpanded, toggle })
</script>
