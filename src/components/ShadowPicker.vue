<template>
  <div class="component-shadow-picker">
    <div class="shadow-item">
      <span class="label">阴影颜色</span>
      <div class="shadow-component">
        <color-picker :value="values[3]" @change="v => handleChange(v, 3)" />
      </div>
    </div>
    <div class="shadow-item">
      <span class="label">阴影大小</span>
      <div class="shadow-component">
        <a-slider
          @change="e => handleChange(e, [0, 1])"
          :value="parseInt(values[0])"
          :min="0"
          :max="20">
        </a-slider>
      </div>
    </div>
    <div class="shadow-item">
      <span class="label">阴影模糊</span>
      <div class="shadow-component">
        <a-slider
          @change="e => handleChange(e, 2)"
          :value="parseInt(values[2])"
          :min="0"
          :max="20">
        </a-slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ColorPicker from './ColorPicker.vue'

export default defineComponent({
  name: 'ShadowPicker',
  components: {
    ColorPicker
  },
  props: {
    value: {
      type: String,
      default: 'none'
    }
  },
  emits: ['change'],
  setup (props, context) {
    const values = computed(() => {
      const style = props.value === 'none' ? '0 0 0 #000000' : props.value
      return style.split(' ')
    })

    const handleChange = (newValue: number | string, index: number | number[]) => {
      const newValues = computed(() => values.value.map((item, i) => {
        if (typeof index === 'number' && index === i) {
          return typeof newValue === 'number' ? `${newValue}px` : newValue
        } else if (Array.isArray(index) && index.includes(i)) {
          return typeof newValue === 'number' ? `${newValue}px` : newValue
        } else {
          return item
        }
      }))
      context.emit('change', newValues.value.join(' '))
    }

    return {
      values,
      handleChange
    }
  }
})
</script>

<style lang="stylus" scoped>
.shadow-item
  display flex
  align-items center
  .label
    width 28%
  .shadow-component
    width 70%
</style>
