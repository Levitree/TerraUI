import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue(), libInjectCss()],
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
    emptyOutDir: false,
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
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
