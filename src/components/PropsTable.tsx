import { computed, defineComponent, PropType, VNode } from 'vue'
import { reduce } from 'lodash-es'
import { mapPropsToForms } from '../propsMap'
import { TextDefaultProps } from '../defaultProps'
import { Input, InputNumber, Slider, Radio, Select } from 'ant-design-vue'

const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option,
} as any

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

function capitalizeFirstLetter (string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default defineComponent({
  name: 'PropsTable',
  props: {
    props: {
      type: Object as PropType<TextDefaultProps>,
      require: true
    }
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
              ['on' + capitalizeFirstLetter(eventName)]: (e: any) => {
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

    return () =>
      <div class="props-table">
        {
          Object.keys(finalProps.value).map(key => {
            const value = finalProps.value[key]
            const ComponentName = mapToComponent[value.component]
            const SubComponentName = value.subComponent && mapToComponent[value.subComponent]
            const props = {
              [value.valueProp]: value.value,
              ...value.extraProps,
              ...value.events
            }
            return (
              <div key={ key } class="prop-item">
                { value.text && <span class="label">{ value.text }</span> }
                <div class="prop-component">
                  <ComponentName { ...props }>
                    {
                      value.options && value.options.map((opt, k) => {
                        return (<SubComponentName
                          key={ k }
                          value={ opt.value }>
                          { opt.text }
                        </SubComponentName>)
                      })
                    }
                  </ComponentName>
                </div>
              </div>
            )
          })
        }
      </div>
  }
})
