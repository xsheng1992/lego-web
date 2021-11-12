import { mount, VueWrapper } from '@vue/test-utils'
import IconSwitch from '@/components/IconSwitch.vue'

const mockTooltipComponent = {
  template: '<div><slot></slot></div>'
}

const mockButtonComponent = {
  template: '<div :class="type" class="button"><slot name="icon"></slot></div>',
  props: {
    type: String
  }
}

const globalComponents = {
  'a-tooltip': mockTooltipComponent,
  'a-button': mockButtonComponent
}

let wrapper: VueWrapper<any>

describe('IconSwitch component', () => {
  beforeAll(() => {
    wrapper = mount(IconSwitch, {
      props: {
        checked: false,
        iconName: 'BoldOutlined',
        tip: '加粗'
      },
      global: {
        components: globalComponents
      }
    })
  })

  it('should have tooltip', () => {
    expect(wrapper.html()).toContain('加粗')
  })

  it('should rendered icon element', () => {
    expect(wrapper.find('svg').exists()).toBeTruthy()
  })

  it('should send the correct event when click button', async () => {
    await wrapper.get('.button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('change')
    const events = wrapper.emitted('change')
    expect(events && events[0]).toEqual([true])
  })
})