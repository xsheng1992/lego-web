import { Module } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { GlobalDataProps } from './index'
import { TextDefaultProps } from '../defaultProps'

export interface ComponentData {
  // 当前元素的属性
  props: { [key: string]: any }
  // 当前元素的id， uuid v4生成
  id: string
  // 业务组件名称 l-text l-image 等
  name: string
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的元素uuid
  currentElement: string
}

export const testComponents: ComponentData[] = [
  { id: uuidv4(), name: 'l-text', props: { text: 'hello', fontSize: '20px', color: 'red', lineHeight: '1', fontFamily: '' } },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '10px', fontWeight: 'bold', lineHeight: '2' } },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello3', fontSize: '15px', textAlign: 'left' } }
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: ''
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(item => item.id === state.currentElement)
    }
  },
  mutations: {
    addComponent: (state, props: Partial<TextDefaultProps>) => {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'l-text',
        props
      }
      state.components.push(newComponent)
    },
    removeComponentById: (state, id: string) => {
      const newComponents = state.components.filter(comp => comp.id !== id)
      state.components = [...newComponents]
    },
    setActive: (state, currentId: string) => {
      state.currentElement = currentId
    }
  }
}

export default editor
