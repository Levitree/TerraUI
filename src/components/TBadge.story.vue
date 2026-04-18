<template>
  <Story title="TBadge" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="['default', 'type', 'status']"
        />
        <HstSelect
          v-model="state.status"
          title="Status"
          :options="['online', 'offline', 'active', 'inactive']"
        />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TBadge :variant="state.variant" :status="state.status">
          {{ state.label }}
        </TBadge>
      </div>
    </Variant>

    <Variant title="Variants">
      <div class="p-6 bg-bg flex flex-wrap items-center gap-3">
        <TBadge variant="default">Default</TBadge>
        <TBadge variant="type">Type</TBadge>
        <TBadge variant="status" status="online">Online</TBadge>
      </div>
    </Variant>

    <Variant title="Status values">
      <div class="p-6 bg-bg flex flex-wrap items-center gap-3">
        <TBadge variant="status" status="online">Online</TBadge>
        <TBadge variant="status" status="active">Active</TBadge>
        <TBadge variant="status" status="inactive">Inactive</TBadge>
        <TBadge variant="status" status="offline">Offline</TBadge>
      </div>
    </Variant>

    <Variant title="In context">
      <div class="p-6 bg-bg flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-ink">Deployment</span>
          <TBadge variant="type">Production</TBadge>
          <TBadge variant="status" status="online">Live</TBadge>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-ink">Worker</span>
          <TBadge variant="type">Background</TBadge>
          <TBadge variant="status" status="offline">Paused</TBadge>
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TBadge from './TBadge.vue'
import type { BadgeVariant, BadgeStatus } from './TBadge.vue'

const state = reactive<{
  label: string
  variant: BadgeVariant
  status: BadgeStatus
}>({
  label: 'Badge',
  variant: 'default',
  status: 'online',
})
</script>
