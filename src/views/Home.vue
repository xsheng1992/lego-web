<template>
  <div class="homepage-container">
    <a-layout class="home-layout">
      <a-layout-header class="header">
        <div class="page-title">网页乐高</div>
      </a-layout-header>
      <a-layout-content class="home-content">
        <div class="content-container">
          <template-list :list="list" />
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      footer
    </a-layout-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TemplateList from '../components/TemplateList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    TemplateList
  },
  setup() {
    const list = ref([
      {
        id: 1,
        title: '示例模版1',
        description: '这是一个示例的模版',
        author: 'xiangsheng',
        copiedCount: 5,
        isHot: true,
        isNew: true
      }
    ])

    return {
      list
    }
  },
})
</script>


<style lang="stylus" scoped>
.home-layout
  background-color #fff
  .page-title
    color #fff
    text-align left
</style>
