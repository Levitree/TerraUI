<template>
  <Story title="TAvatar" group="primitives">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.src" title="Image src" />
        <HstText v-model="state.text" title="Text (for initials)" />
        <HstText v-model="state.alt" title="Alt text" />
        <HstSelect v-model="state.size" title="Size" :options="['xs', 'sm', 'md', 'lg', 'xl']" />
        <HstSelect v-model="state.color" title="Color" :options="['primary', 'neutral']" />
      </template>

      <div class="p-6 bg-bg min-h-40 flex items-center justify-center">
        <TAvatar
          :src="state.src || undefined"
          :text="state.text || undefined"
          :alt="state.alt || undefined"
          :size="state.size"
          :color="state.color"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TAvatar v-for="s in sizes" :key="s" :size="s" text="Aiden Bai" />
      </div>
    </Variant>

    <Variant title="Colors">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TAvatar color="neutral" text="AB" />
        <TAvatar color="primary" text="AB" />
      </div>
    </Variant>

    <Variant title="With image">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TAvatar
          v-for="s in sizes"
          :key="s"
          :size="s"
          src="https://i.pravatar.cc/128?img=5"
          alt="Avatar"
        />
      </div>
    </Variant>

    <Variant title="Initials fallback">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TAvatar text="Aiden" />
        <TAvatar text="Aiden Bai" />
        <TAvatar text="Terranova Labs" color="primary" />
        <TAvatar text="Jane Doe" size="lg" />
      </div>
    </Variant>

    <Variant title="Icon fallback (no src, no text)">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TAvatar v-for="s in sizes" :key="s" :size="s" />
      </div>
    </Variant>

    <Variant title="Broken image falls back">
      <div class="p-6 bg-bg flex items-center gap-3">
        <TAvatar src="https://example.invalid/broken.png" text="Aiden Bai" />
        <span class="text-xs text-ink-muted">Falls back to initials when the image fails to load.</span>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TAvatar from './TAvatar.vue'
import type { AvatarSize, AvatarColor } from './TAvatar.vue'

const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const state = reactive<{
  src: string
  text: string
  alt: string
  size: AvatarSize
  color: AvatarColor
}>({
  src: '',
  text: 'Aiden Bai',
  alt: '',
  size: 'md',
  color: 'neutral',
})
</script>
