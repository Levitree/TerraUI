<template>
  <header
    class="sticky top-0 z-50 py-1.5 px-5 border-b border-line-subtle shadow-2xl bg-chrome backdrop-blur-[18px]"
  >
    <div class="flex items-center gap-5 max-md:flex-wrap">
      <!-- Logo Section -->
      <TLogo size="lg" responsive-wordmark />

      <!-- Navigation Links -->
      <nav class="flex-1 flex items-center gap-1 max-md:order-3 max-md:w-full">
        <TNavLink
          v-for="item in items"
          :key="item.to"
          :label="item.label"
          :icon="item.icon"
          :to="item.to"
          :active="isActive(item.to)"
          @click="handleNavClick(item.to)"
        />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import TNavLink from './TNavLink.vue'
import TLogo from './TLogo.vue'
import type { NavigationRoute } from '../types/navigation'

defineProps<{
  items: NavigationRoute[]
}>()

const router = useRouter()
const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}

const handleNavClick = (to?: string) => {
  if (to) {
    router.push(to)
  }
}
</script>
