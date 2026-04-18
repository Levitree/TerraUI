<template>
  <RouterLink to="/" :class="wrapperClasses" aria-label="Terranova" title="Terranova">
    <span :class="iconClasses" v-html="IconSvg" />
    <span v-if="wordmark" :class="wordmarkClasses" v-html="WordmarkSvg" />
  </RouterLink>
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
  }>(),
  {
    size: 'md',
    wordmark: true,
    responsiveWordmark: false,
  },
)

const wrapperClasses = computed(() =>
  [
    'inline-flex items-center text-ink rounded-sm cursor-pointer hover:opacity-80 transition-opacity',
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
