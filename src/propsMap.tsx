import { VNode } from 'vue'
import { AllComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  subComponent?: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string | VNode; value: any } []
  initalTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  valueProp?: string
  eventName?: string
}

export type PropToForms = {
  [P in keyof AllComponentProps]?: PropToForm
}

const fontFamilyArray = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' }
]

const fontFamilyOptions = fontFamilyArray.map(font => {
  return {
    value: font.value,
    text: <span style={{ fontFamily: font.value }}>{ font.text }</span> as VNode
  }
})

const defaultHandler: PropToForm = {
  component: 'a-input',
  eventName: 'change',
  valueProp: 'value',
  initalTransform: (v: any) => v,
  afterTransform: (e: any) => e
}

const pxToNumberHandler: PropToForm = {
  component: 'a-input-number',
  initalTransform: (v: string) => {
    if (v === '') return ''
    return parseInt(v)
  },
  afterTransform: (e: any) => {
    if (e === 0) return '0'
    return e ? `${e}px` : ''
  }
}

export const mapPropsToForms: PropToForms = {
  // 通用属性 - 尺寸
  width: {
    text: '宽度',
    ...pxToNumberHandler
  },
  height: {
    text: '高度',
    ...pxToNumberHandler
  },
  paddingLeft: {
    text: '左边距',
    ...pxToNumberHandler
  },
  paddingRight: {
    text: '右边距',
    ...pxToNumberHandler
  },
  paddingTop: {
    text: '上边距',
    ...pxToNumberHandler
  },
  paddingBottom: {
    text: '下边距',
    ...pxToNumberHandler
  },
  // 边框
  borderStyle: {
    text: '边框类型',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [
      { text: '无', value: 'none' },
      { text: '实线', value: 'solid' },
      { text: '破折线', value: 'dashed' },
      { text: '点状线', value: 'dotted' },
    ]
  },
  borderColor: {
    text: '边框颜色',
    component: 'color-picker'
  },
  borderWidth: {
    text: '边框宽度',
    component: 'a-slider',
    extraProps: { min: 0, max: 20 },
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => e ? `${e}px` : '0'
  },
  borderRadius: {
    text: '边框圆角',
    component: 'a-slider',
    extraProps: { min: 0, max: 200 },
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => e ? `${e}px` : '0'
  },
  // 阴影和透明度
  opacity: {
    text: '透明度',
    component: 'a-slider',
    extraProps: { min: 0, max: 100, reverse: true },
    initalTransform: (v: string) => parseFloat(v) * 100,
    afterTransform: (e: any) => (e / 100).toString()
  },
  boxShadow: {
    component: 'shadow-picker'
  },
  // 事件类型
  actionType: {
    text: '点击',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [
      { text: '无', value: '' },
      { text: '跳转到URL', value: 'url' },
    ]
  },
  url: {
    text: '链接',
    ...defaultHandler,
    afterTransform: (e: any) => e.target.value
  },
  // 文本属性
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: { rows: 3 },
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    text: '字号',
    ...pxToNumberHandler
  },
  fontWeight: {
    component: 'icon-switch',
    initalTransform: (v: string) => v === 'bold',
    afterTransform: (e: boolean) => e ? 'bold' : 'normal',
    valueProp: 'checked',
    extraProps: { iconName: 'BoldOutlined', tip: '加粗' }
  },
  fontStyle: {
    component: 'icon-switch',
    initalTransform: (v: string) => v === 'italic',
    afterTransform: (e: boolean) => e ? 'italic' : 'normal',
    valueProp: 'checked',
    extraProps: { iconName: 'ItalicOutlined', tip: '斜体' }
  },
  textDecoration: {
    component: 'icon-switch',
    initalTransform: (v: string) => v === 'underline',
    afterTransform: (e: boolean) => e ? 'underline' : 'none',
    valueProp: 'checked',
    extraProps: { iconName: 'UnderlineOutlined', tip: '下划线' }
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: any) => e.toString()
  },
  textAlign: {
    text: '对齐',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { text: '左', value: 'left' },
      { text: '中', value: 'center' },
      { text: '右', value: 'right' }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    text: '字体',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [
      { text: '无', value: '' },
      ...fontFamilyOptions
    ]
  },
  color: {
    text: '文字颜色',
    component: 'color-picker'
  },
  backgroundColor: {
    text: '背景颜色',
    component: 'color-picker'
  },
  // 图片属性
  imageSrc: {
    component: 'image-processer',
    valueProp: 'src'
  }
}