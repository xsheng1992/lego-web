<template>
  <div class="editor-wrapper" :class="{ active }" @click="onItemClick(id)">
    <slot></slot>
    <span class="delete-btn" v-if="active" @click="clickRemove(id)">X</span>
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
  emits: ['set-active', 'remove-item'],
  setup (props, context) {
    const onItemClick = (id: string) => {
      context.emit('set-active', id)
    }

    const clickRemove = (id: string) => {
      context.emit('remove-item', id)
    }
    return {
      onItemClick,
      clickRemove
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
  position relative
  &:hover
    border 1px dashed #ccc
  &.active
    border 1px solid #1890ff
    user-select none
    z-index 1500
  .delete-btn
    position absolute
    right 10px
    top 50%
    transform translateY(-50%)
</style>
