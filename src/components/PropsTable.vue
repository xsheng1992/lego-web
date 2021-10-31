<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      class="prop-item"
    >
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div class="prop-component">
        <component :is="value.component" :value="value.value" v-bind="value.extraProps" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { reduce } from 'lodash-es'
import { PropToForms, mapPropsToForms } from '../propsMap'
import { TextDefaultProps } from '../defaultProps'

export default defineComponent({ 
  name: 'PropsTable',
  props: {
    props: {
      type: Object as PropType<TextDefaultProps>,
      require: true
    }
  },
  setup (props) {
    const finalProps = computed(() => {
      return reduce(props.props, (result, value, key) => {
        const newKey = key as keyof TextDefaultProps
        const item = mapPropsToForms[newKey]
        if (item) {
          item.value = value
          result[newKey] = item
        }
        return result
      }, {} as Required<PropToForms>)
    })

    return {
      finalProps
    }
  }
})
</script>

<style lang="stylus" scoped>
.prop-item
  display flex
  margin-bottom 10px
  align-items center
.label
  width 28%
.prop-component
  width 70%
</style>
