<template>
  <div class="homepage-container">
    <template-list :list="list" />
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
