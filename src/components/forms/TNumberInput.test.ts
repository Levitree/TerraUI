import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import TNumberInput from './TNumberInput.vue'

it('prevents stepping a readonly value', async () => {
  const wrapper = mount(TNumberInput, {
    props: {
      modelValue: 5,
      stepper: true,
      readonly: true,
      min: 0,
      max: 10,
    },
  })

  const buttons = wrapper.findAll('button')
  expect(buttons).toHaveLength(2)

  for (const button of buttons) {
    expect(button.element.disabled).toBe(true)
    await button.trigger('click')
  }

  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  expect(wrapper.emitted('blur')).toBeUndefined()
})