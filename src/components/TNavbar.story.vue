<template>
  <Story title="TNavbar" group="layout">
    <Variant title="Playground">
      <div class="bg-bg min-h-60">
        <TNavbar :items="items" />
        <div class="p-6 text-ink-muted text-sm">
          Page content goes below the navbar.
        </div>
      </div>
    </Variant>

    <Variant title="Minimal (2 items)">
      <div class="bg-bg min-h-40">
        <TNavbar :items="minimalItems" />
      </div>
    </Variant>

    <Variant title="Many items">
      <div class="bg-bg min-h-40">
        <TNavbar :items="manyItems" />
      </div>
    </Variant>

    <Variant title="With default destinations">
      <div class="bg-bg min-h-40">
        <TNavbar :items="itemsWithDefault" />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TNavbar from './TNavbar.vue'
import type { NavigationRoute } from '../types/navigation'

const items: NavigationRoute[] = [
  { label: 'Dashboard', icon: 'home', to: '/dashboard' },
  { label: 'Devices', icon: 'cpu', to: '/devices' },
  { label: 'Alerts', icon: 'bell', to: '/alerts' },
  { label: 'Reports', icon: 'bar-chart-3', to: '/reports' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const minimalItems: NavigationRoute[] = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Account', icon: 'user', to: '/account' },
]

const manyItems: NavigationRoute[] = [
  { label: 'Overview', icon: 'home', to: '/overview' },
  { label: 'Devices', icon: 'cpu', to: '/devices' },
  { label: 'Fleet', icon: 'network', to: '/fleet' },
  { label: 'Alerts', icon: 'bell', to: '/alerts' },
  { label: 'Inbox', icon: 'inbox', to: '/inbox' },
  { label: 'Users', icon: 'users', to: '/users' },
  { label: 'Reports', icon: 'bar-chart-3', to: '/reports' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

const itemsWithDefault: NavigationRoute[] = [
  { label: 'Dashboard', icon: 'home', to: '/dashboard', defaultTo: '/dashboard/overview' },
  { label: 'Devices', icon: 'cpu', to: '/devices', defaultTo: '/devices/all' },
  { label: 'Settings', icon: 'settings', to: '/settings', defaultTo: '/settings/profile' },
]
</script>
