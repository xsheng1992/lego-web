<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      class="prop-item"
    >
      <component v-if="value" :is="value.component" :value="value.value" />
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
      }, {} as PropToForms)
    })

    return {
      finalProps
    }
  }
})
</script>

