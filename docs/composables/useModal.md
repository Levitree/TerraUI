# useModal

Lightweight promise-based modal orchestration. Decouples _should the modal be
mounted_ from _which component, with which props, resolving which promise_ —
useful for `await`-style confirmation flows and ad-hoc dialogs.

## Import

```ts
import { useModal, type ModalHandle } from '@terranovasystems/terraui/composables'
```

## Signature

```ts
function useModal<TResult = void>(component: Component): ModalHandle<TResult>
```

`useModal` returns a handle **scoped to the component that calls it** — each
call produces an independent modal instance. It does _not_ share state the way
`useToast` does; this keeps multiple concurrent modals isolated.

## Return value

| Name        | Type                                                                 | Description                                                                                                                                         |
| ----------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen`    | `Ref<boolean>`                                                       | Bind to `v-model:open` on `TModal` (or your own wrapper).                                                                                           |
| `open`      | `(props?: Record<string, unknown>) => Promise<TResult \| undefined>` | Opens the modal with optional props. Resolves with whatever `close(result)` is called with, or `undefined` if dismissed via `v-model:open="false"`. |
| `close`     | `(result?: TResult) => void`                                         | Dismisses the modal and resolves the outstanding `open()` promise with `result`.                                                                    |
| `component` | `Component`                                                          | The component to render inside the modal slot (marked `markRaw`).                                                                                   |
| `props`     | `Ref<Record<string, unknown>>`                                       | The props bag passed to the rendered component. Updated each time `open(props)` is called.                                                          |

## Usage

### Await a confirmation

```vue
<script setup lang="ts">
import { useModal } from '@terranovasystems/terraui/composables'
import { TModal, TButton } from '@terranovasystems/terraui/components'
import DeleteRoleModal from './DeleteRoleModal.vue'

const deleteModal = useModal<boolean>(DeleteRoleModal)

async function confirmDelete(role: Role) {
  const confirmed = await deleteModal.open({ role })
  if (confirmed) await api.roles.delete(role.id)
}
</script>

<template>
  <TButton label="Delete" @click="confirmDelete(role)" />

  <TModal v-model:open="deleteModal.isOpen.value" title="Delete role">
    <component :is="deleteModal.component" v-bind="deleteModal.props.value" />
  </TModal>
</template>
```

### Inside the mounted component

The component passed to `useModal` receives whatever props you pass to
`open(props)`. To resolve the outstanding promise, call `close(result)` on the
same handle — typically via an emit or a closure passed through props:

```vue
<!-- DeleteRoleModal.vue -->
<script setup lang="ts">
const props = defineProps<{
  role: Role
  onResolve: (confirmed: boolean) => void
}>()
</script>

<template>
  <div class="flex gap-2 justify-end">
    <TButton color="ghost" label="Cancel" @click="onResolve(false)" />
    <TButton color="error" label="Delete" @click="onResolve(true)" />
  </div>
</template>
```

```ts
// at the call site, pass a resolver as a prop:
const confirmed = await deleteModal.open({
  role,
  onResolve: (v: boolean) => deleteModal.close(v),
})
```

### Multiple modals

Call `useModal` once per modal — each returns its own isolated handle:

```ts
const deleteModal = useModal<boolean>(DeleteRoleModal)
const editModal = useModal<Role>(EditRoleModal)

// Can be open simultaneously; resolutions don't cross-contaminate.
```

## Notes

- The handle is **not** a singleton. State lives in the calling component's
  setup scope; when the component unmounts, the handle goes with it. For
  app-wide overlays (e.g. a global command palette) store the handle on a
  shared parent and pass it down via props or `provide` / `inject`.
- `open()` resolves with `undefined` when the modal is closed by something
  other than `close(result)` — for example, setting `v-model:open` to `false`
  externally. Check for `undefined` if dismissal needs to be distinguished
  from an explicit "no" result.
- `component` is `markRaw`'d automatically, so there's no reactive overhead
  from the component definition itself.
