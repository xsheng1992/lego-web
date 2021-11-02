import { VNode, h } from 'vue'
import { TextDefaultProps } from './defaultProps'

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
  [P in keyof TextDefaultProps]?: PropToForm
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

export const mapPropsToForms: PropToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: { rows: 3 },
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => e ? `${e}px` : ''
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
  }
}