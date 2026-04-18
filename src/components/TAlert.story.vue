<template>
  <Story title="TAlert" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.description" title="Description" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['success', 'error', 'warning', 'info', 'neutral', 'primary']"
        />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="['solid', 'subtle', 'outline']"
        />
        <HstText v-model="state.icon" title="Icon (lucide name, optional)" />
        <HstCheckbox v-model="state.closable" title="Closable" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TAlert
          :title="state.title || undefined"
          :description="state.description"
          :color="state.color"
          :variant="state.variant"
          :icon="state.icon || undefined"
          :closable="state.closable"
        />
      </div>
    </Variant>

    <Variant title="Colors (subtle)">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TAlert
          v-for="c in colors"
          :key="c"
          :color="c"
          :title="c"
          description="The quick brown fox jumps over the lazy dog."
        />
      </div>
    </Variant>

    <Variant title="Solid variant">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TAlert
          v-for="c in colors"
          :key="c"
          variant="solid"
          :color="c"
          :title="c"
          description="Solid background emphasizes severity."
        />
      </div>
    </Variant>

    <Variant title="Outline variant">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TAlert
          v-for="c in colors"
          :key="c"
          variant="outline"
          :color="c"
          :title="c"
          description="Outline keeps the surface transparent."
        />
      </div>
    </Variant>

    <Variant title="Without title">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TAlert color="info" description="A concise message without a title." />
        <TAlert color="success" description="Deployment completed successfully." />
        <TAlert color="error" description="Something went wrong. Please try again." />
      </div>
    </Variant>

    <Variant title="Closable">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TAlert
          color="warning"
          title="Heads up"
          description="This alert can be dismissed."
          closable
        />
      </div>
    </Variant>

    <Variant title="With actions slot">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TAlert color="info" title="Update available" description="Version 0.4.0 is ready to install.">
          <template #actions>
            <button class="text-xs font-medium text-ink underline">Install</button>
            <button class="text-xs font-medium text-ink-muted">Later</button>
          </template>
        </TAlert>
      </div>
    </Variant>

    <Variant title="Custom icon">
      <div class="p-6 bg-bg flex flex-col gap-3">
        <TAlert color="primary" icon="sparkles" title="New feature" description="Try the redesigned inspector." />
        <TAlert color="neutral" icon="bell" title="Reminder" description="You have 3 unread notifications." />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TAlert from './TAlert.vue'
import type { AlertColor, AlertVariant } from './TAlert.vue'

const colors: AlertColor[] = ['success', 'error', 'warning', 'info', 'neutral', 'primary']

const state = reactive<{
  title: string
  description: string
  color: AlertColor
  variant: AlertVariant
  icon: string
  closable: boolean
}>({
  title: 'Heads up',
  description: 'Something you should know about.',
  color: 'info',
  variant: 'subtle',
  icon: '',
  closable: false,
})
</script>
