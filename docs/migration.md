# Migration guide

## `0.7.x` → next (Pinia removed)

TerraUI no longer depends on [Pinia]. The toast system was the only piece using
it; it has been rewritten as a plain module-singleton composable, matching the
pattern `useWindowManager` already used.

### What you need to change

1. **Uninstall Pinia** if TerraUI was the only reason you had it:

   ```bash
   pnpm remove pinia
   ```

   If other code in your app uses Pinia, leave it installed — nothing else
   changes for you. Remove `app.use(createPinia())` from `main.ts` only if
   you're dropping Pinia entirely.

2. **Replace `useToastStore()` with `useToast()`.** The method surface is
   compatible — `add`, `remove`, `clear`, `success`, `error`, `warning`, `info`
   all behave the same. The reactive `toasts` array is now on the composable's
   return value:

   ```diff
   - import { useToastStore } from '@terranovasystems/terraui/stores'
   + import { useToast } from '@terranovasystems/terraui/composables'

   - const store = useToastStore()
   - store.success('Saved')
   - const list = store.toasts
   + const toast = useToast()
   + toast.success('Saved')
   + const list = toast.toasts
   ```

3. **Drop any import from `@terranovasystems/terraui/stores`.** The `./stores`
   subpath export has been removed; so have the `useToastStore`, `Toast`,
   `ToastType`, and `ToastOptions` names from the `./stores` path. The same
   types are now re-exported from `@terranovasystems/terraui/composables`:

   ```diff
   - import type { ToastType } from '@terranovasystems/terraui/stores'
   + import type { ToastType } from '@terranovasystems/terraui/composables'
   ```

### What stays the same

- `<TToastContainer />` is still the host. Mount it once in your root layout
  exactly as before.
- The `useToast()` signature — `useToast().add({ color, title, description,
duration })` and the convenience helpers — is unchanged.
- Toast state is still a single app-wide singleton; stacking, auto-dismiss,
  and `clear()` work identically.

### New API surface

```ts
import { useToast } from '@terranovasystems/terraui/composables'

const toast = useToast()

// Structured (Nuxt-UI-shaped)
toast.add({
  color: 'success', // 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary'
  title: 'Deployed',
  description: 'Live in production.',
  duration: 4000, // 0 disables auto-dismiss
})

// Convenience helpers
toast.success('Saved changes', 'Success')
toast.error('Upload failed', 'Error')
toast.warning('Quota almost used', 'Heads up')
toast.info('New version available')

toast.remove(id)
toast.clear()
toast.toasts // Reactive array of live toasts (for custom hosts)
```

[Pinia]: https://pinia.vuejs.org/
