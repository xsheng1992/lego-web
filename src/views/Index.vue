<template>
  <a-layout class="main-layout">
    <a-layout-header class="header">
      <div class="page-title">
        <router-link to="/">网页乐高</router-link>
      </div>
      <user-profile :user="userData" />
    </a-layout-header>
    <a-layout-content class="home-content">
      <div class="content-container">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer> footer </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'

export default defineComponent({
  name: 'Index',
  components: {
    UserProfile
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const userData = computed(() => store.state.user)

    return {
      userData
    }
  },
})
</script>


<style lang="stylus" scoped>
.main-layout
  background-color #fff
  .header
    display flex
    align-items center
    justify-content space-between
  .page-title
    color #fff
</style>