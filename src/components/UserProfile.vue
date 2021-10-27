<template>
  <a-button
    type="primary" v-if="!user.isLogin"
    class="user-profile-component"
    @click="login">
    登陆
  </a-button>
  <div v-else>
    <a-dropdown-button  class="user-profile-component">
      <router-link to="/setting">{{ user.userName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0">创建作品</a-menu-item>
          <a-menu-item key="1">我的作品</a-menu-item>
          <a-menu-item key="2" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { UserProps } from '../store/user'

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const login = () => {
      store.commit('login')
      message.success('登陆成功', 2)
    }

    const logout = () => {
      store.commit('logout')
      message.success('退出登陆成功，2秒后跳转到首页', 2)
      setTimeout(() => router.push('/'), 2000)
    }

    return {
      login,
      logout
    }
  }
})
</script>

<style lang="stylus" scoped>
.user-profile-component
  border-radius 2px!important
.user-operation > *
  margin-left 30px!important
</style>
