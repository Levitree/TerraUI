import { fileURLToPath } from 'node:url'
import { dirname, relative, resolve } from 'node:path'
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createChecker, type PropertyMetaSchema } from 'vue-component-meta'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const srcDir = resolve(rootDir, 'src')
const componentsDir = resolve(srcDir, 'components')
const outDir = resolve(rootDir, 'dist/llms')
const componentsOutDir = resolve(outDir, 'components')

mkdirSync(componentsOutDir, { recursive: true })

type ComponentDoc = {
  name: string
  file: string
  importPath: string
  importSource: string
  category: string
  props: PropDoc[]
  slots: SlotDoc[]
  events: EventDoc[]
  exposed: ExposedDoc[]
}

type PropDoc = {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}

type SlotDoc = {
  name: string
  type: string
  description?: string
}

type EventDoc = {
  name: string
  type: string
  description?: string
}

type ExposedDoc = {
  name: string
  type: string
  description?: string
}

function walk(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry)
    const s = statSync(full)
    if (s.isDirectory()) {
      out.push(...walk(full))
    } else if (
      entry.endsWith('.vue') &&
      !entry.endsWith('.story.vue') &&
      /^[A-Z]/.test(entry)
    ) {
      out.push(full)
    }
  }
  return out
}

const PRIMITIVES = new Set([
  'TAlert',
  'TAvatar',
  'TBadge',
  'TButton',
  'TCard',
  'THeading',
  'TIcon',
  'TLogo',
  'TSeparator',
  'TSkeleton',
  'TStatusIndicator',
])
const LAYOUT = new Set([
  'TControlBar',
  'TFilterLabel',
  'TNavLink',
  'TNavbar',
  'TNavigationMenu',
  'TSubNavbar',
  'TTabSelector',
])
const DATA_DISPLAY = new Set([
  'TAccordion',
  'TEmptyState',
  'TLoadingState',
  'TStatTile',
  'TTable',
])
const OVERLAYS = new Set([
  'TDropdown',
  'TFloatingWindow',
  'TModal',
  'TToast',
  'TToastContainer',
  'TWindowsContainer',
])

function categoryFor(file: string, name: string): string {
  const rel = relative(componentsDir, file)
  if (rel.startsWith('forms/')) return 'Forms'
  if (rel.startsWith('dashboard/')) return 'Dashboard Shell'
  if (rel.startsWith('windows/')) return 'Windows'
  if (rel.startsWith('internal/')) return 'Internal'
  if (PRIMITIVES.has(name)) return 'Primitives'
  if (LAYOUT.has(name)) return 'Layout & Navigation'
  if (DATA_DISPLAY.has(name)) return 'Data Display'
  if (OVERLAYS.has(name)) return 'Overlays'
  return 'Components'
}

function renderSchema(schema: PropertyMetaSchema): string {
  if (typeof schema === 'string') return schema
  if (!schema) return 'unknown'
  if (schema.kind === 'enum' && Array.isArray(schema.schema)) {
    return schema.schema.map(renderSchema).join(' | ')
  }
  if (schema.kind === 'array' && Array.isArray(schema.schema)) {
    return `Array<${schema.schema.map(renderSchema).join(' | ')}>`
  }
  return schema.type ?? 'unknown'
}

function escapePipe(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function toMarkdown(doc: ComponentDoc): string {
  const lines: string[] = []
  lines.push(`# ${doc.name}`)
  lines.push('')
  lines.push(`**Category:** ${doc.category}`)
  lines.push('')
  lines.push('## Import')
  lines.push('')
  lines.push('```ts')
  lines.push(`import { ${doc.name} } from '${doc.importSource}'`)
  lines.push('```')
  lines.push('')

  if (doc.props.length) {
    lines.push('## Props')
    lines.push('')
    lines.push('| Name | Type | Required | Default | Description |')
    lines.push('| --- | --- | --- | --- | --- |')
    for (const p of doc.props) {
      lines.push(
        `| \`${p.name}\` | \`${escapePipe(p.type)}\` | ${p.required ? 'yes' : 'no'} | ${p.default ? `\`${escapePipe(p.default)}\`` : '—'} | ${escapePipe(p.description ?? '')} |`,
      )
    }
    lines.push('')
  }

  if (doc.events.length) {
    lines.push('## Events')
    lines.push('')
    lines.push('| Name | Payload | Description |')
    lines.push('| --- | --- | --- |')
    for (const e of doc.events) {
      lines.push(
        `| \`${e.name}\` | \`${escapePipe(e.type)}\` | ${escapePipe(e.description ?? '')} |`,
      )
    }
    lines.push('')
  }

  if (doc.slots.length) {
    lines.push('## Slots')
    lines.push('')
    lines.push('| Name | Bindings | Description |')
    lines.push('| --- | --- | --- |')
    for (const s of doc.slots) {
      lines.push(
        `| \`${s.name}\` | \`${escapePipe(s.type)}\` | ${escapePipe(s.description ?? '')} |`,
      )
    }
    lines.push('')
  }

  if (doc.exposed.length) {
    lines.push('## Exposed')
    lines.push('')
    lines.push('| Name | Type | Description |')
    lines.push('| --- | --- | --- |')
    for (const e of doc.exposed) {
      lines.push(
        `| \`${e.name}\` | \`${escapePipe(e.type)}\` | ${escapePipe(e.description ?? '')} |`,
      )
    }
    lines.push('')
  }

  lines.push('## Usage')
  lines.push('')
  lines.push('```vue')
  lines.push('<template>')
  lines.push(`  <${doc.name} />`)
  lines.push('</template>')
  lines.push('')
  lines.push('<script setup lang="ts">')
  lines.push(`import { ${doc.name} } from '${doc.importSource}'`)
  lines.push('</script>')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

const checker = createChecker(resolve(rootDir, 'tsconfig.json'), {
  forceUseTs: true,
  printer: { newLine: 1 },
})

const files = walk(componentsDir).sort()
const docs: ComponentDoc[] = []

for (const file of files) {
  const name = file.split('/').pop()!.replace(/\.vue$/, '')
  const category = categoryFor(file, name)
  if (category === 'Internal') continue

  let meta
  try {
    meta = checker.getComponentMeta(file)
  } catch (err) {
    console.warn(`Skipping ${name}: ${(err as Error).message}`)
    continue
  }

  const props: PropDoc[] = meta.props
    .filter((p) => !p.global)
    .map((p) => ({
      name: p.name,
      type: p.type,
      required: Boolean(p.required),
      default:
        p.default !== undefined && p.default !== null ? String(p.default) : undefined,
      description: p.description || undefined,
    }))

  const events: EventDoc[] = meta.events.map((e) => ({
    name: e.name,
    type: e.type,
    description: e.description || undefined,
  }))

  const slots: SlotDoc[] = meta.slots.map((s) => ({
    name: s.name,
    type: s.type,
    description: s.description || undefined,
  }))

  const exposed: ExposedDoc[] = meta.exposed.map((e) => ({
    name: e.name,
    type: e.type,
    description: e.description || undefined,
  }))

  const subBarrel = (() => {
    const rel = relative(componentsDir, file)
    if (rel.startsWith('forms/')) return '@terranovasystems/terraui/components'
    if (rel.startsWith('dashboard/')) return '@terranovasystems/terraui/components'
    if (rel.startsWith('windows/')) return '@terranovasystems/terraui/components'
    return '@terranovasystems/terraui/components'
  })()

  const doc: ComponentDoc = {
    name,
    file: relative(rootDir, file),
    importPath: `@terranovasystems/terraui`,
    importSource: subBarrel,
    category,
    props,
    slots,
    events,
    exposed,
  }
  docs.push(doc)
  writeFileSync(resolve(componentsOutDir, `${name}.md`), toMarkdown(doc))
}

writeFileSync(
  resolve(outDir, 'components.json'),
  JSON.stringify(
    docs.map((d) => ({ ...d, file: d.file })),
    null,
    2,
  ),
)

const byCategory = docs.reduce<Record<string, ComponentDoc[]>>((acc, d) => {
  ;(acc[d.category] ??= []).push(d)
  return acc
}, {})

const llmsLines: string[] = []
llmsLines.push('# TerraUI')
llmsLines.push('')
llmsLines.push(
  'Vue 3 + Tailwind v4 component library. Import components from `@terranovasystems/terraui/components` and styles from `@terranovasystems/terraui/styles`.',
)
llmsLines.push('')
llmsLines.push('## Install')
llmsLines.push('')
llmsLines.push('```bash')
llmsLines.push('pnpm add @terranovasystems/terraui')
llmsLines.push('```')
llmsLines.push('')
llmsLines.push('Peer deps: `vue ^3.5`, `pinia ^3`, `vue-router ^5`, `zod ^4`, `@tanstack/vue-table ^8`.')
llmsLines.push('')
llmsLines.push('```ts')
llmsLines.push("import '@terranovasystems/terraui/styles'")
llmsLines.push("import { TButton } from '@terranovasystems/terraui/components'")
llmsLines.push('```')
llmsLines.push('')
llmsLines.push('## Components')
llmsLines.push('')
for (const category of Object.keys(byCategory).sort()) {
  llmsLines.push(`### ${category}`)
  llmsLines.push('')
  for (const d of byCategory[category].sort((a, b) => a.name.localeCompare(b.name))) {
    llmsLines.push(`- [${d.name}](dist/llms/components/${d.name}.md)`)
  }
  llmsLines.push('')
}

writeFileSync(resolve(rootDir, 'llms.txt'), llmsLines.join('\n'))

console.log(`Generated LLM docs for ${docs.length} components → ${relative(rootDir, outDir)}`)
