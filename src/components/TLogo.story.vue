<template>
  <Story title="TLogo" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstSelect v-model="state.size" title="Size" :options="['md', 'lg']" />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="['both', 'icon', 'wordmark']"
        />
        <HstCheckbox v-model="state.responsiveWordmark" title="Responsive wordmark (hide < md)" />
        <HstCheckbox v-model="state.linked" title="Link to /" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TLogo
          :size="state.size"
          :variant="state.variant"
          :responsive-wordmark="state.responsiveWordmark"
          :to="state.linked ? '/' : undefined"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-center gap-8">
        <TLogo size="md" to="/" />
        <TLogo size="lg" to="/" />
      </div>
    </Variant>

    <Variant title="Icon only">
      <div class="p-6 bg-bg flex items-center gap-8">
        <TLogo size="md" variant="icon" to="/" />
        <TLogo size="lg" variant="icon" to="/" />
      </div>
    </Variant>

    <Variant title="Wordmark only">
      <div class="p-6 bg-bg flex items-center gap-8">
        <TLogo size="md" variant="wordmark" to="/" />
        <TLogo size="lg" variant="wordmark" to="/" />
      </div>
    </Variant>

    <Variant title="Non-linked (auth / marketing screens)">
      <div class="p-6 bg-bg flex flex-col items-start gap-3">
        <TLogo size="lg" />
        <span class="text-xs text-ink-muted">
          Without a `to` prop, TLogo renders as a plain, non-interactive span — useful on screens
          that don't have a router or shouldn't navigate on click.
        </span>
      </div>
    </Variant>

    <Variant title="On a dark surface">
      <div class="p-6 bg-surface flex items-center gap-8 border border-line rounded-sm">
        <TLogo to="/" />
        <TLogo variant="icon" to="/" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TLogo from './TLogo.vue'
import type { LogoSize, LogoVariant } from './TLogo.vue'

const state = reactive<{
  size: LogoSize
  variant: LogoVariant
  responsiveWordmark: boolean
  linked: boolean
}>({
  size: 'md',
  variant: 'both',
  responsiveWordmark: false,
  linked: true,
})
</script>
