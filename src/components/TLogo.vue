<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[wrapperClasses, 'cursor-pointer hover:opacity-80 transition-opacity']"
    aria-label="Terranova"
    title="Terranova"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span :class="iconClasses" :style="iconStyle" v-html="IconSvg" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span v-if="wordmark" :class="wordmarkClasses" :style="wordmarkStyle" v-html="WordmarkSvg" />
  </RouterLink>
  <span v-else :class="wrapperClasses" aria-label="Terranova" title="Terranova">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span :class="iconClasses" :style="iconStyle" v-html="IconSvg" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span v-if="wordmark" :class="wordmarkClasses" :style="wordmarkStyle" v-html="WordmarkSvg" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import IconSvg from '../assets/Icon.svg?raw'
import WordmarkSvg from '../assets/Wordmark.svg?raw'

export type LogoSize = 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    size?: LogoSize
    wordmark?: boolean
    responsiveWordmark?: boolean
    /** When set, the logo renders as a RouterLink to this path. Otherwise it renders as a non-interactive span. */
    to?: string
  }>(),
  {
    size: 'md',
    wordmark: true,
    responsiveWordmark: false,
  },
)

const wrapperClasses = computed(() =>
  [
    'inline-flex items-center text-ink rounded-sm',
    props.size === 'md' ? 'gap-2 3xl:gap-3' : 'gap-3',
  ].join(' '),
)

const iconClasses = computed(() =>
  [
    'inline-flex items-center justify-center',
    props.size === 'md' ? 'w-9 h-9 3xl:w-12 3xl:h-12' : 'w-12 h-12',
  ].join(' '),
)

const wordmarkClasses = computed(() =>
  [
    'inline-flex items-center w-auto',
    props.size === 'md' ? 'h-5 3xl:h-7' : 'h-7',
    props.responsiveWordmark ? 'max-md:hidden' : '',
  ]
    .filter(Boolean)
    .join(' '),
)

// Explicit aspect-ratios derived from the SVG viewBoxes. Safari otherwise
// falls back to the SVGs' intrinsic mm dimensions when the wrapper is
// `w-auto`, blowing out the wordmark width.
const iconStyle = { aspectRatio: '1 / 1' }
const wordmarkStyle = { aspectRatio: '219.17659 / 21.110899' }
</script>

<style scoped>
span :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
span :deep(path) {
  fill: currentColor !important;
}
</style>
