<template>
  <Story title="TModal" group="overlays">
    <Variant title="Playground">
      <template #controls>
        <HstText v-model="state.title" title="Title" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg', 'xl']" />
        <HstCheckbox v-model="state.dismissible" title="Dismissible" />
        <HstCheckbox v-model="state.fullscreen" title="Fullscreen" />
        <HstCheckbox v-model="state.withFooter" title="With footer" />
      </template>

      <div class="p-6 bg-bg min-h-96 flex items-center justify-center">
        <TButton label="Open Modal" icon="square-arrow-out-up-right" @click="state.open = true" />

        <TModal
          v-model:open="state.open"
          :title="state.title"
          :size="state.size"
          :dismissible="state.dismissible"
          :fullscreen="state.fullscreen"
        >
          <p class="text-sm text-ink-secondary leading-relaxed">
            This is the modal body. You can place any content here — forms, text,
            images, or custom widgets. The backdrop blurs the page behind and
            clicking outside (when dismissible) closes the modal.
          </p>
          <p class="text-sm text-ink-muted mt-3">
            Press <kbd class="px-1.5 py-0.5 bg-fill border border-line rounded-sm text-xs">Esc</kbd>
            to dismiss.
          </p>

          <template v-if="state.withFooter" #footer>
            <div class="flex-1" />
            <TButton variant="ghost" label="Cancel" @click="state.open = false" />
            <TButton label="Confirm" @click="state.open = false" />
          </template>
        </TModal>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div class="p-6 bg-bg min-h-96 flex flex-wrap gap-3">
        <TButton
          v-for="s in sizes"
          :key="s"
          variant="secondary"
          :label="`Open ${s}`"
          @click="openSize(s)"
        />
        <TModal
          v-model:open="sizeOpen"
          :title="`Size: ${currentSize}`"
          :size="currentSize"
        >
          <p class="text-sm text-ink-secondary">
            This modal is rendered at the <strong>{{ currentSize }}</strong> size.
          </p>
        </TModal>
      </div>
    </Variant>

    <Variant title="With useModal">
      <div class="p-6 bg-bg min-h-96 flex items-center justify-center gap-3">
        <TButton label="Open (await result)" icon="check" @click="runConfirm" />
        <span class="text-sm text-ink-muted">Result: {{ confirmResult }}</span>

        <TModal v-model:open="confirmModal.isOpen.value" title="Confirm action">
          <p class="text-sm text-ink-secondary">
            Resolve the promise returned from <code>open()</code> by clicking a button.
          </p>
          <template #footer>
            <div class="flex-1" />
            <TButton variant="ghost" label="Cancel" @click="confirmModal.close(false)" />
            <TButton label="Confirm" @click="confirmModal.close(true)" />
          </template>
        </TModal>
      </div>
    </Variant>

    <Variant title="Without title/footer">
      <div class="p-6 bg-bg min-h-96 flex items-center justify-center">
        <TButton variant="ghost" label="Open minimal" @click="minimalOpen = true" />
        <TModal v-model:open="minimalOpen" :dismissible="true">
          <template #header>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-sm bg-fill flex items-center justify-center">
                <span class="text-sm">T</span>
              </div>
              <span class="text-sm font-medium text-ink">Custom header</span>
            </div>
          </template>
          <p class="text-sm text-ink-secondary">
            You can override <code>#header</code> for fully custom chrome, or omit
            <code>#footer</code> entirely.
          </p>
        </TModal>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TModal from './TModal.vue'
import TButton from './TButton.vue'
import { useModal } from '../composables/useModal'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl']

const state = reactive<{
  open: boolean
  title: string
  size: ModalSize
  dismissible: boolean
  fullscreen: boolean
  withFooter: boolean
}>({
  open: false,
  title: 'Modal title',
  size: 'md',
  dismissible: true,
  fullscreen: false,
  withFooter: true,
})

const sizeOpen = ref(false)
const currentSize = ref<ModalSize>('md')
const openSize = (s: ModalSize) => {
  currentSize.value = s
  sizeOpen.value = true
}

const minimalOpen = ref(false)

const confirmModal = useModal<boolean>(TModal)
const confirmResult = ref<string>('—')
async function runConfirm() {
  const result = await confirmModal.open()
  confirmResult.value = result === undefined ? 'dismissed' : String(result)
}
</script>
