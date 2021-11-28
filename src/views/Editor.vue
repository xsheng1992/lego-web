<template>
  <div class="editor" id="editor-layout-main">
    <a-layout class="editor-layout">
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">网页乐高</router-link>
        </div>
      </a-layout-header>
      <a-layout-content>
        <a-layout>
          <a-layout-sider width="300" style="background: white;">
            <div class="sidebar-container">
              组件列表
              <components-list :list="defaultTextTemplates" @on-item-click="addItem" />
            </div>
          </a-layout-sider>
          <a-layout style="padding: 0 24px 24px;">
            <a-layout-content class="preview-container">
              <p>画布区域</p>
              <div class="preview-list" id="canvas-area">
                <editor-wrapper
                  v-for="component in components"
                  :key="component.id"
                  :id="component.id"
                  :active="currentElement && (currentElement.id === component.id)"
                  @set-active="setActive"
                  @remove-item="removeItemById">
                  <component
                    :is="component.name"
                    :isEditor="true"
                    v-bind="component.props"
                  />
                </editor-wrapper>
              </div>
            </a-layout-content>
          </a-layout>
          <a-layout-sider width="300" style="background: white" class="settings-panel">
            组件属性
            <props-table
              v-if="currentElement && currentElement.props"
              :props="currentElement.props"
              @change="handleChange"
            />
          </a-layout-sider>
        </a-layout>
      </a-layout-content>
      <a-layout-footer>
        footer
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import { ComponentData } from '../store/editor'
import ComponentsList from '../components/ComponentsList.vue'
import EditorWrapper from '../components/EditorWrapper.vue'
import LText from '../components/LText.vue'
import LImage from '../components/LImage.vue'
import PropsTable from '../components/PropsTable.vue'
import { defaultTextTemplates } from '../defaultTemplates'

export default defineComponent({
  name: 'Editor',
  components: {
    LText,
    LImage,
    ComponentsList,
    EditorWrapper,
    PropsTable
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)

    const addItem = (component: ComponentData) => {
      store.commit('addComponent', component)
    }

    const removeItemById = (id: string) => {
      store.commit('removeComponentById', id)
    }

    const setActive = (id: string) => {
      store.commit('setActive', id)
    }

    const handleChange = (e: any) => {
      console.log(e)
      store.commit('updateComponent', e)
    }

    return {
      components,
      defaultTextTemplates,
      currentElement,
      addItem,
      removeItemById,
      setActive,
      handleChange
    }
  },
})
</script>


<style lang="stylus" scoped>
.editor-layout
  background-color #fff
  .header
    .page-title
      color #fff
.preview-container
  padding 24px
  margin 0
  min-height 85vh
  display flex
  flex-direction column
  align-items center
  position relative
  .preview-list
    padding 0
    margin 0
    min-width 375px
    min-height 200px
    border 1px solid #efefef
    background-color #fff
    overflow-x hidden
    overflow-y auto
    position fixed
    margin-top 50px
    max-height 80vh
</style>