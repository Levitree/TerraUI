import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: 'histoire.setup.ts',
  storyMatch: ['src/**/*.story.vue'],
  theme: {
    title: 'TerraUI',
    colors: {
      primary: {
        50: '#f5f7fa',
        100: '#e4e9f2',
        200: '#c7d0e0',
        300: '#9aa8c1',
        400: '#6a7a97',
        500: '#4a5878',
        600: '#374361',
        700: '#2a3350',
        800: '#1d2440',
        900: '#121830',
      },
    },
    defaultColorScheme: 'dark',
  },
  tree: {
    groups: [
      { id: 'primitives', title: 'Primitives' },
      { id: 'layout', title: 'Layout & Navigation' },
      { id: 'data', title: 'Data Display' },
      { id: 'overlays', title: 'Overlays' },
      { id: 'forms', title: 'Forms' },
      { id: 'dashboard', title: 'Dashboard Shell' },
      { id: 'windows', title: 'Windows' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
