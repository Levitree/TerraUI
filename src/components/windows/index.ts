/**
 * Built-in window renderers. Importing this module has the side effect of
 * registering each type with the window manager. Consumers can override a
 * built-in by calling `registerWindowType(name, ...)` after import, or by
 * registering their own types under different names.
 */
import { registerWindowType } from '../../composables/useWindowManager'
import NumericKeypadWindow from './NumericKeypadWindow.vue'

registerWindowType('numeric-keypad', {
  component: NumericKeypadWindow,
  defaultSize: { width: 300, height: 420 },
  defaultTitle: 'Enter Number',
})

export { default as NumericKeypadWindow } from './NumericKeypadWindow.vue'
export type { NumericKeypadInitialState } from './NumericKeypadWindow.vue'
