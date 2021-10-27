<template>
  <div class="homepage-container">
    <template-list :list="testData" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store' 
import TemplateList from '../components/TemplateList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    TemplateList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)

    return {
      testData
    }
  },
})
</script>

<style lang="stylus" scoped>
.homepage-container
  background-color #fff
  padding 0 24px 24px 30px
  min-height 85vh
  max-width 1200px
  margin 50px auto
  width 100%
</style>
