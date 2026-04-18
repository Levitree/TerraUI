import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyFileSync, cpSync, mkdirSync } from 'node:fs'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'terraui:copy-styles',
      closeBundle() {
        const src = resolve(rootDir, 'src/styles')
        const dest = resolve(rootDir, 'dist/styles')
        mkdirSync(dest, { recursive: true })
        cpSync(src, dest, { recursive: true })
        copyFileSync(
          resolve(rootDir, 'src/styles/tokens/colors.css'),
          resolve(rootDir, 'dist/styles/tokens/colors.css'),
        )
      },
    },
  ],
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(rootDir, 'src/index.ts'),
        'components/index': resolve(rootDir, 'src/components/index.ts'),
        'composables/index': resolve(rootDir, 'src/composables/index.ts'),
        'stores/index': resolve(rootDir, 'src/stores/index.ts'),
        'types/index': resolve(rootDir, 'src/types/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'pinia',
        'vue-router',
        '@tanstack/vue-table',
        'zod',
        'lucide-vue-next',
        /^lucide-vue-next\/.*/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'styles/[name][extname]'
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
