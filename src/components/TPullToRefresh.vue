<template>
  <div
    class="relative h-full overflow-hidden"
    @touchstart.passive="onStart"
    @touchmove="onMove"
    @touchend="onEnd"
    @touchcancel="onEnd"
  >
    <!-- Pull indicator, revealed in the gap opened above the content -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 flex items-end justify-center overflow-hidden"
      :style="{ height: `${offset}px` }"
      aria-hidden="true"
    >
      <div class="flex h-8 items-center justify-center">
        <slot name="indicator" :progress="progress" :armed="armed" :refreshing="refreshing">
          <TIcon
            name="loader-2"
            :size="20"
            class="text-ink-muted"
            :class="refreshing ? 'animate-spin' : ''"
            :style="
              refreshing
                ? undefined
                : { transform: `rotate(${progress * 270}deg)`, opacity: Math.max(progress, 0.15) }
            "
          />
        </slot>
      </div>
    </div>

    <!-- Scroll viewport. Translated down by `offset` while pulling / refreshing. -->
    <div
      ref="viewport"
      class="h-full overflow-y-auto overscroll-contain"
      :class="animating ? 'transition-transform duration-200 ease-out' : ''"
      :style="{ transform: `translateY(${offset}px)` }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import TIcon from './TIcon.vue'

const props = withDefaults(
  defineProps<{
    /**
     * Controlled loading flag. Set true while your async refresh runs and
     * false when it settles — the spinner holds open for as long as it's true.
     */
    refreshing?: boolean
    /** Disable the gesture entirely. */
    disabled?: boolean
    /** Pull distance (px) required to arm a refresh on release. */
    threshold?: number
    /** Maximum visual pull distance (px); travel past `threshold` resists. */
    maxPull?: number
  }>(),
  {
    refreshing: false,
    disabled: false,
    threshold: 64,
    maxPull: 96,
  },
)

/** Emitted once when the user releases a pull past `threshold`. */
const emit = defineEmits<{ refresh: [] }>()

defineSlots<{
  /** Scrollable content. The host must give this component a bounded height. */
  default(): unknown
  /** Override the pull indicator. */
  indicator(props: { progress: number; armed: boolean; refreshing: boolean }): unknown
}>()

const viewport = ref<HTMLElement>()
const offset = ref(0)
const animating = ref(false)

let startY = 0
let tracking = false

/** Linear travel up to the threshold, then diminishing returns to `maxPull`. */
function resist(delta: number): number {
  if (delta <= props.threshold) return delta
  const over = delta - props.threshold
  return props.threshold + Math.min(over * 0.4, props.maxPull - props.threshold)
}

const armed = computed(() => offset.value >= props.threshold)
const progress = computed(() => Math.min(offset.value / props.threshold, 1))

function onStart(e: TouchEvent) {
  if (props.disabled || props.refreshing) return
  if (!viewport.value || viewport.value.scrollTop > 0) return
  startY = e.touches[0].clientY
  tracking = true
  animating.value = false
}

function onMove(e: TouchEvent) {
  if (!tracking) return
  const delta = e.touches[0].clientY - startY
  // Pulling up, or the viewport has scrolled — hand the gesture back to native scroll.
  if (delta <= 0 || (viewport.value && viewport.value.scrollTop > 0)) {
    tracking = false
    if (offset.value !== 0) {
      animating.value = true
      offset.value = 0
    }
    return
  }
  e.preventDefault()
  offset.value = resist(delta)
}

async function onEnd() {
  if (!tracking) return
  tracking = false
  animating.value = true
  if (armed.value && !props.disabled) {
    offset.value = props.threshold
    emit('refresh')
    // Uncontrolled usage (parent never sets `refreshing`): snap back so we
    // don't hang the spinner open forever.
    await nextTick()
    if (!props.refreshing) offset.value = 0
  } else {
    offset.value = 0
  }
}

// Controlled usage: follow the flag. Lets a parent both hold the spinner open
// during an async refresh and trigger it programmatically.
watch(
  () => props.refreshing,
  (value) => {
    animating.value = true
    offset.value = value ? props.threshold : 0
  },
)
</script>
