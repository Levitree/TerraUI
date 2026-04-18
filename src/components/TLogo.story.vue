<template>
  <Story title="TLogo" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstSelect v-model="state.size" title="Size" :options="['md', 'lg']" />
        <HstCheckbox v-model="state.wordmark" title="Wordmark" />
        <HstCheckbox v-model="state.responsiveWordmark" title="Responsive wordmark (hide < md)" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TLogo
          :size="state.size"
          :wordmark="state.wordmark"
          :responsive-wordmark="state.responsiveWordmark"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-center gap-8">
        <TLogo size="md" />
        <TLogo size="lg" />
      </div>
    </Variant>

    <Variant title="Icon only (no wordmark)">
      <div class="p-6 bg-bg flex items-center gap-8">
        <TLogo size="md" :wordmark="false" />
        <TLogo size="lg" :wordmark="false" />
      </div>
    </Variant>

    <Variant title="On a dark surface">
      <div class="p-6 bg-surface flex items-center gap-8 border border-line rounded-sm">
        <TLogo />
        <TLogo :wordmark="false" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TLogo from './TLogo.vue'
import type { LogoSize } from './TLogo.vue'

const state = reactive<{
  size: LogoSize
  wordmark: boolean
  responsiveWordmark: boolean
}>({
  size: 'md',
  wordmark: true,
  responsiveWordmark: false,
})
</script>
