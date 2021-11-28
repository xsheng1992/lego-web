<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      :class="`prop-item${value.text ? '' : ' no-text'}`"
      :id="`item-${key}`"
    >
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div :class="`prop-component component-${value.component}`">
        <component
          class="prop-component-item"
          :is="value.component"
          :[value.valueProp]="value.value"
          v-bind="value.extraProps"
          v-on="value.events">
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options"
              :key="k"
              :value="option.value">
              <render-vnode :vNode="option.text" />
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, VNode } from 'vue'
import { reduce } from 'lodash-es'
import { mapPropsToForms } from '../propsMap'
import { TextDefaultProps } from '../defaultProps'
import RenderVnode from './RenderVnode'
import IconSwitch from './IconSwitch.vue'
import ShadowPicker from './ShadowPicker.vue'
import ColorPicker from './ColorPicker.vue'
import ImageProcesser from './ImageProcesser.vue'

interface FormProps {
  component: string
  subComponent?: string
  value: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string | VNode; value: any } []
  valueProp: string,
  eventName: string,
  events: { [key: string]: (e: any) => void }
}

export default defineComponent({ 
  name: 'PropsTable',
  props: {
    props: {
      type: Object as PropType<TextDefaultProps>,
      require: true
    }
  },
  components: {
    RenderVnode,
    IconSwitch,
    ShadowPicker,
    ColorPicker,
    ImageProcesser
  },
  emits: ['change'],
  setup (props, context) {
    const finalProps = computed(() => {
      return reduce(props.props, (result, value, key) => {
        const newKey = key as keyof TextDefaultProps
        const item = mapPropsToForms[newKey]
        if (item) {
          const { valueProp = 'value', eventName = 'change', initalTransform, afterTransform, ...otherProps } = item
          const newItem: FormProps = {
            ...otherProps,
            value: initalTransform ? initalTransform(value) : value,
            valueProp,
            eventName,
            events: {
              [eventName]: (e: any) => {
                const value = afterTransform ? afterTransform(e) : e
                context.emit('change', { key, value })
              }
            }
          }
          result[newKey] = newItem
        }
        return result
      }, {} as { [key: string]: FormProps })
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
  &.no-text
    display inline-block
    margin 0 10px 0 0
.label
  width 28%
.prop-component
  width 70%
.prop-component-item
  width 100%
#item-fontWeight
  margin-left 28%
#item-boxShadow,
#item-imageSrc
  width 100%
.component-shadow-picker,
.component-image-processer
  width 100%
</style>
