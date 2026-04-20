/**
 * Built-in window renderers. The actual `registerWindowType` calls live in
 * `TWindowsContainer.vue` so the side effect survives library tree-shaking.
 */
export { default as NumericKeypadWindow } from './NumericKeypadWindow.vue'
export type { NumericKeypadInitialState } from './NumericKeypadWindow.vue'
