
import { computed } from 'vue'
import { pick } from 'lodash-es'
import { TextDefaultProps } from '../defaultProps'

interface EditorTextDefaultProps extends TextDefaultProps {
  isEditor: boolean
}

const useComponentCommon = (props: Readonly<Partial<EditorTextDefaultProps>>, picks: string[]) => {
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (!props.isEditor && props.actionType === 'url' && props.url) {
      window.location.href = props.url
    }
  }

  return {
    styleProps,
    handleClick
  }
}

export default useComponentCommon
