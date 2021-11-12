import store from '@/store/index'
import { testData } from '@/store/templates'
import { testComponents, ComponentData } from '@/store/editor'
import { TextDefaultProps } from '@/defaultProps'
import { clone, last } from 'lodash-es'

const cloneComponents = clone(testComponents)

describe('test vuex store', () => {
  it('should have three modules', () => {
    expect(store.state).toHaveProperty('user')
    expect(store.state).toHaveProperty('templates')
    expect(store.state).toHaveProperty('editor')
  })

  describe('test user module', () => {
    it('test login mutation', () => {
      store.commit('login')
      expect(store.state.user.isLogin).toBeTruthy()
    })
    it('test logout mutation', () => {
      store.commit('logout')
      expect(store.state.user.isLogin).toBeFalsy()
    })
  })

  describe('test template module', () => {
    it('should have default templates', () => {
      expect(store.state.templates.data).toHaveLength(testData.length)
    })
    it('should get the correct template by Id', () => {
      const selectedTemplate = store.getters.getTemplateById(1)
      expect(selectedTemplate.title).toBe('test title 1')
    })
  })

  describe('test editor module', () => {
    it('should have default components', () => {
      expect(store.state.editor.components).toHaveLength(cloneComponents.length)
    })
    it('should get current component when set active one component', () => {
      const targetComponent = cloneComponents[0]
      store.commit('setActive', targetComponent.id)
      expect(store.state.editor.currentElement).toBe(targetComponent.id)
      const currentComponent = store.getters.getCurrentElement
      expect(currentComponent).toEqual(targetComponent)
    })
    it('add component should works fine', () => {
      const testProps: Partial<TextDefaultProps> = {
        fontSize: '20px'
      }
      store.commit('addComponent', testProps)
      expect(store.state.editor.components).toHaveLength(cloneComponents.length + 1)
      const lastComponent = last(store.state.editor.components)
      expect(lastComponent?.props.fontSize).toBe('20px')
    })
    it('update component should works fine', () => {
      store.commit('updateComponent', { key: 'text', value: 'test text' })
      const currentComponent = store.getters.getCurrentElement
      expect(currentComponent.props.text).toBe('test text')
    })
  })
})