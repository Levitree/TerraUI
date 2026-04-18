<template>
  <Story title="TDropdown" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstSelect v-model="state.align" title="Align" :options="['left', 'right']" />
      </template>

      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdown :align="state.align">
          <template #trigger="{ open }">
            <TButton
              label="Open Dropdown"
              icon="chevron-down"
              icon-right
              :active="open"
            />
          </template>
          <template #default="{ close }">
            <div class="p-3 w-56">
              <div class="text-xs font-bold tracking-wider uppercase text-ink-muted mb-2">
                Account
              </div>
              <div class="flex flex-col gap-1 text-sm text-ink-secondary">
                <button class="text-left px-2 py-1.5 rounded-sm hover:bg-fill" @click="close">
                  Profile
                </button>
                <button class="text-left px-2 py-1.5 rounded-sm hover:bg-fill" @click="close">
                  Settings
                </button>
                <button class="text-left px-2 py-1.5 rounded-sm hover:bg-fill" @click="close">
                  Sign out
                </button>
              </div>
            </div>
          </template>
        </TDropdown>
      </div>
    </Variant>

    <Variant title="Alignment">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-between">
        <TDropdown align="left">
          <template #trigger>
            <TButton label="Align left" icon="chevron-down" icon-right />
          </template>
          <div class="p-3 w-48 text-sm text-ink-secondary">
            Aligned to the left edge of the trigger.
          </div>
        </TDropdown>

        <TDropdown align="right">
          <template #trigger>
            <TButton label="Align right" icon="chevron-down" icon-right />
          </template>
          <div class="p-3 w-48 text-sm text-ink-secondary">
            Aligned to the right edge of the trigger.
          </div>
        </TDropdown>
      </div>
    </Variant>

    <Variant title="Rich content">
      <div class="p-6 bg-bg min-h-96 relative flex items-start justify-center">
        <TDropdown>
          <template #trigger>
            <TButton variant="secondary" label="Workspace" icon="layers" />
          </template>
          <template #default="{ close }">
            <div class="w-64 p-3">
              <div class="flex items-center gap-2 pb-3 border-b border-line-subtle">
                <div class="w-8 h-8 rounded-sm bg-fill flex items-center justify-center text-ink">
                  T
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-ink">Terranova</span>
                  <span class="text-xs text-ink-muted">Production</span>
                </div>
              </div>
              <div class="pt-2 flex flex-col gap-1 text-sm text-ink-secondary">
                <button class="text-left px-2 py-1.5 rounded-sm hover:bg-fill" @click="close">
                  Switch workspace
                </button>
                <button class="text-left px-2 py-1.5 rounded-sm hover:bg-fill" @click="close">
                  Invite members
                </button>
              </div>
            </div>
          </template>
        </TDropdown>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TDropdown from './TDropdown.vue'
import TButton from './TButton.vue'

const state = reactive<{
  align: 'left' | 'right'
}>({
  align: 'left',
})
</script>
