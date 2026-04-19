<template>
  <Story title="TBadge" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstSelect v-model="state.variant" title="Variant" :options="['outline', 'ghost']" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['success', 'error', 'warn', 'neutral']"
        />
        <HstSelect v-model="state.size" title="Size" :options="['xs', 'sm', 'md']" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TBadge :variant="state.variant" :color="state.color" :size="state.size">
          {{ state.label }}
        </TBadge>
      </div>
    </Variant>

    <Variant title="Variants">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <TBadge v-for="c in colors" :key="c" variant="outline" :color="c">{{ c }}</TBadge>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <TBadge v-for="c in colors" :key="c" variant="ghost" :color="c">{{ c }}</TBadge>
        </div>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TBadge size="xs">Extra small</TBadge>
        <TBadge size="sm">Small</TBadge>
        <TBadge size="md">Medium</TBadge>
      </div>
    </Variant>

    <Variant title="In context">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-ink">Deployment</span>
          <TBadge color="neutral">Production</TBadge>
          <TBadge color="success">Live</TBadge>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-ink">Worker</span>
          <TBadge color="neutral">Background</TBadge>
          <TBadge color="error">Paused</TBadge>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TBadge from './TBadge.vue'
import type { BadgeColor, BadgeSize, BadgeVariant } from './TBadge.vue'

const colors: BadgeColor[] = ['success', 'error', 'warn', 'neutral']

const state = reactive<{
  label: string
  variant: BadgeVariant
  color: BadgeColor
  size: BadgeSize
}>({
  label: 'Badge',
  variant: 'outline',
  color: 'neutral',
  size: 'sm',
})
</script>
