<template>
  <Story title="TNavLink" group="layout">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.icon" title="Icon (CSS class)" />
        <HstText v-model="state.to" title="Href" />
        <HstCheckbox v-model="state.active" title="Active" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TNavLink
          :label="state.label"
          :icon="state.icon || undefined"
          :to="state.to || undefined"
          :active="state.active"
          @click="onClick"
        />
      </div>
    </Variant>

    <Variant title="States">
      <div class="p-6 bg-bg flex items-center gap-2">
        <TNavLink label="Default" />
        <TNavLink label="Active" active />
      </div>
    </Variant>

    <Variant title="Label only">
      <div class="p-6 bg-bg flex items-center gap-2">
        <TNavLink label="Overview" />
        <TNavLink label="Devices" active />
        <TNavLink label="Analytics" />
        <TNavLink label="Settings" />
      </div>
    </Variant>

    <Variant title="In a nav row">
      <div class="p-6 bg-bg">
        <nav class="flex items-center gap-1">
          <TNavLink label="Dashboard" active />
          <TNavLink label="Devices" />
          <TNavLink label="Alerts" />
          <TNavLink label="Reports" />
          <TNavLink label="Settings" />
        </nav>
      </div>
    </Variant>

    <Variant title="Click handler">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TNavLink label="Click me" @click="clickCount++" />
        <span class="text-sm text-ink-muted">Clicked {{ clickCount }} times</span>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TNavLink from './TNavLink.vue'

const state = reactive<{
  label: string
  icon: string
  to: string
  active: boolean
}>({
  label: 'Dashboard',
  icon: '',
  to: '#',
  active: false,
})

const clickCount = ref(0)

const onClick = () => {
  // no-op in playground
}
</script>
