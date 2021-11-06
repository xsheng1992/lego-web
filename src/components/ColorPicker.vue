<template>
  <div class="component-color-picker">
    <div class="color-picker-container">
      <div class="input-color-picker">
        <input :value="value" class="picker" type="color" @input="(e) => handleChange(e.target.value)">
      </div>
      <ul class="color-list">
        <li class="color-list-item"
          v-for="(item, i) in colors"
          :key="i"
          @click="handleChange(item)">
          <div class="color-item" :style="{ backgroundColor: item }" v-if="item.startsWith('#')"></div>
          <div class="color-item transparent" v-else></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

const colorList: string[] = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#8c8c8c', '#000000', '']

export default defineComponent({
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
      default: ''
    },
    colors: {
      type: Array as PropType<string[]>,
      default: colorList
    }
  },
  emits: ['change'],
  setup (props, context) {
    const handleChange = (newColor: string) => {
      context.emit('change', newColor)
    }

    return {
      handleChange
    }
  },
})
</script>

<style lang="stylus" scoped>
.color-picker-container
  display flex
  align-items center
  justify-content space-between
  .input-color-picker
    width 40%
    .picker
      width 100%
      height 50px
      border none
      background-color transparent
      cursor pointer
  .color-list
    width 60%
    margin-bottom 0
    .color-list-item
      display inline-block
      width 20px
      height 20px
      border 1px solid #ddd
      padding 1px
      margin 0 1px
      border-radius 3px
      cursor pointer
    .color-item
      width 100%
      height 100%
      &.transparent
        background url('~@/assets/images/transparent.png') no-repeat
</style>

