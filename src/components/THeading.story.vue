<template>
  <Story title="THeading" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.subheading" title="Subheading" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <THeading :title="state.title" :subheading="state.subheading || undefined" />
      </div>
    </Variant>

    <Variant title="Title only">
      <div class="p-6 bg-bg">
        <THeading title="Deployments" />
      </div>
    </Variant>

    <Variant title="With subheading">
      <div class="p-6 bg-bg">
        <THeading
          title="Deployments"
          subheading="Track the status of every rollout across your fleet."
        />
      </div>
    </Variant>

    <Variant title="Slot usage">
      <div class="p-6 bg-bg flex flex-col gap-6">
        <THeading>
          <span class="text-ink">Custom <span class="text-success">slot</span> content</span>
          <template #subheading>
            Rich markup is supported inside both slots.
          </template>
        </THeading>
      </div>
    </Variant>

    <Variant title="Stacked examples">
      <div class="p-6 bg-bg flex flex-col gap-6">
        <THeading title="Overview" subheading="A quick summary of your environment." />
        <THeading title="Workers" subheading="Background jobs running across regions." />
        <THeading title="Settings" subheading="Configure tokens, webhooks, and integrations." />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import THeading from './THeading.vue'

const state = reactive<{
  title: string
  subheading: string
}>({
  title: 'Section heading',
  subheading: 'Supporting description text goes here.',
})
</script>
