import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './src/styles/index.css'

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(createPinia())
  app.use(
    createRouter({
      history: createWebHistory(),
      routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
    }),
  )
})
