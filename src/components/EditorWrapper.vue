<template>
  <div class="editor-wrapper" :class="{ active }" @click="onItemClick(id)">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditorWrapper',
  props: {
    id: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  emits: ['set-active'],
  setup (props, context) {
    const onItemClick = (id: string) => {
      context.emit('set-active', id)
    }
    return {
      onItemClick
    }
  }
})
</script>

<style lang="stylus" scoped>
.editor-wrapper
  padding 0
  cursor pointer
  border 1px solid transparent
  user-select none
  &:hover
    border 1px dashed #ccc
  &.active
    border 1px solid #1890ff
    user-select none
    z-index 1500
</style>
