<template>
  <div class="component-icon-switch">
    <a-tooltip :title="tip">
      <a-button :type="checked ? 'primary' : 'default'"
        class="icon-switch"
        shape="circle"
        @click="changeState">
        <template v-slot:icon><component :is="iconName" /></template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'IconSwitch',
  components: {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup (props, context) {
    const changeState = () => {
      context.emit('change', !props.checked)
    }

    return {
      changeState
    }
  }
})
</script>

<style lang="stylus" scoped>
</style>
