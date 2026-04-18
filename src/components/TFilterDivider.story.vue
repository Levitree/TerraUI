<template>
  <Story title="TFilterDivider" group="layout">
    <Variant title="Playground">
      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TFilterDivider />
      </div>
    </Variant>

    <Variant title="In a filter row">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TFilterLabel label="Status" />
        <span class="text-sm text-ink">Active</span>
        <TFilterDivider />
        <TFilterLabel label="Owner" />
        <span class="text-sm text-ink">Aiden</span>
        <TFilterDivider />
        <TFilterLabel label="Sort" />
        <span class="text-sm text-ink">Newest</span>
      </div>
    </Variant>

    <Variant title="Between buttons">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TButton size="sm" variant="ghost" label="Bold" icon="bold" />
        <TButton size="sm" variant="ghost" label="Italic" icon="italic" />
        <TFilterDivider />
        <TButton size="sm" variant="ghost" icon="align-left" />
        <TButton size="sm" variant="ghost" icon="align-center" />
        <TButton size="sm" variant="ghost" icon="align-right" />
        <TFilterDivider />
        <TButton size="sm" variant="ghost" icon="link" />
      </div>
    </Variant>

    <Variant title="Multiple dividers">
      <div class="p-6 bg-bg flex items-center gap-3">
        <span class="text-sm text-ink">A</span>
        <TFilterDivider />
        <span class="text-sm text-ink">B</span>
        <TFilterDivider />
        <span class="text-sm text-ink">C</span>
        <TFilterDivider />
        <span class="text-sm text-ink">D</span>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TFilterDivider from './TFilterDivider.vue'
import TFilterLabel from './TFilterLabel.vue'
import TButton from './TButton.vue'
</script>
