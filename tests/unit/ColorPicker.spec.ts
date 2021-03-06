import { mount, VueWrapper } from '@vue/test-utils'
import rgbHex from 'rgb-hex'
import ColorPicker from '@/components/ColorPicker.vue'

const colorList: string[] = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#8c8c8c', '#000000', '']
let wrapper: VueWrapper<any>

describe('ColorPicker component', () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: '#ffffff',
        colors: colorList
      }
    })
  })

  it('should render the correct interface', () => {
    // 测试左侧是否为 input，类型和值是否正确
    expect(wrapper.find('input').exists()).toBeTruthy()
    const input = wrapper.get('input').element
    expect(input.type).toBe('color')
    expect(input.value).toBe('#ffffff')
    // 测试右侧是否有颜色的列表
    expect(wrapper.find('.color-list').exists()).toBeTruthy()
    expect(wrapper.findAll('.color-list-item')).toHaveLength(colorList.length)
    // 检查一个元素的 css backgroundColor 属性是否相等对应的颜色
    const firstItem = wrapper.get('li:first-child div').element as HTMLElement
    const color = '#' + rgbHex(firstItem.style.backgroundColor)
    expect(color).toBe(colorList[0])
    // 测试最后一个元素是否有特殊类名
    const lastItem = wrapper.get('li:last-child div').element as HTMLElement
    expect(lastItem.classList.contains('transparent')).toBeTruthy()
  })

  it('should send the correct event when change input', async () => {
    // 测试 input 修改后，是否发送对应的事件和对应的值
    const blackHex = '#000000'
    const input = wrapper.get('input')
    await input.setValue(blackHex)
    expect(wrapper.emitted()).toHaveProperty('change')
    const events = wrapper.emitted('change')
    expect(events && events[0]).toEqual([blackHex])
  })

  it('should send the correct event when clicking the color list', async () => {
    // 测试 input 修改后，是否发送对应的事件和对应的值
    const color = colorList[1]
    await wrapper.get('li:nth-child(2)').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('change')
    const events = wrapper.emitted('change')
    expect(events && events[1]).toEqual([color])
  })
})