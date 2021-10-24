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
          <a-layout-sider width="300" style="background: yellow;">
            <div class="sidebar-container">
              组件列表
            </div>
          </a-layout-sider>
          <a-layout style="padding: 0 24px 24px;">
            <a-layout-content class="preview-container">
              <p>画布区域</p>
              <div class="preview-list" id="canvas-area"></div>
            </a-layout-content>
          </a-layout>
          <a-layout-sider width="300" style="background: purple" class="settings-panel">
            组件属性
          </a-layout-sider>
        </a-layout>
      </a-layout-content>
      <a-layout-footer>
        footer
      </a-layout-footer>
    </a-layout>
  </div>
</template>

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