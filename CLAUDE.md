# TerraUI — Claude guidance

Vue 3 + Tailwind v4 component library published as `@terranovasystems/terraui`.

## Adding or modifying a component

Every component in [src/components/](src/components/) (including `forms/`, `dashboard/`, `windows/`) must ship three things together. A component change is not done until all three are updated in the same PR.

1. **The component itself** — `T<Name>.vue` with typed props/emits/slots via `<script setup lang="ts">`.
2. **A Histoire story** — `T<Name>.story.vue` colocated next to the component. Cover: default, variant/size matrix, interactive controls, and relevant edge cases (empty/loading/error/disabled where applicable).
3. **LLM docs** — a per-component Markdown page generated into `dist/llms/components/T<Name>.md`, plus an entry in the root `llms.txt` index. Regenerate via `pnpm build:llms` (the generator reads SFC types through `vue-component-meta` — keep prop/slot/event types explicit so extraction works).

If you add a new public export, also update [src/components/index.ts](src/components/index.ts) and — if types are exposed — re-export them there.

## Story conventions

- One `<Variant>` per meaningful state. Use `initState` for interactive controls.
- Import real composables (`useForm`, `useToast`, etc.) rather than mocking — stories double as integration smoke tests.
- Forms stories must exercise validation (zod) to keep `useForm`/`useFormField` behavior covered.
- Dashboard/Windows stories show composed usage, not isolated components.

## LLM docs conventions

- Each component page includes: import path, props table, slots, events, minimal usage snippet, common compositions.
- `llms.txt` at repo root is the entry index — keep it in sync with the generated per-component pages.
- `dist/llms/components.json` is the machine-readable mirror for agents; do not hand-edit.
- Source of truth is the SFC's TypeScript types. Fix types at the component, not in the generated docs.

## Build and verify

- `pnpm typecheck` — must pass before commit.
- `pnpm lint` — must pass before commit.
- `pnpm story:dev` — local Histoire for visual check.
- `pnpm build` — runs JS, CSS, types, and LLM doc generation; used by `prepublishOnly`.
