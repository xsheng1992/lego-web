import { mapValues, without } from 'lodash-es'

export interface CommonDefaultProps {
  // actions
  actionType: string
  url: string
  // size
  height: string
  width: string
  paddingLeft: string
  paddingRight: string
  paddingTop: string
  paddingBottom: string
  // border type
  borderStyle: string
  borderColor: string
  borderWidth: string
  borderRadius: string
  // shadow and opacity
  boxShadow: string
  opacity: string
  // position and x,y
  position: string
  left: string
  top: string
  right: string
}

export const commonDefaultProps: CommonDefaultProps = {
  // actions
  actionType: '',
  url: '',
  // size
  height: '36px',
  width: '373px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxShadow: '0 0 0 #000000',
  opacity: '1',
  // position and x,y
  position: 'absolute',
  left: '0',
  top: '0',
  right: '0'
}

export interface TextDefaultProps extends CommonDefaultProps {
  text: string
  fontSize: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textDecoration: string
  lineHeight: string
  textAlign: string
  color: string
  backgroundColor: string
}

export interface ImageDefaultProps extends CommonDefaultProps {
  imageSrc: string;
}

export const textDefaultProps: TextDefaultProps = {
  text: '正文内容',
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'left',
  color: '#000000',
  backgroundColor: '',
  ...commonDefaultProps
}
export const imageDefaultProps: ImageDefaultProps = {
  imageSrc: 'test.url',
  ...commonDefaultProps,
  height: ''
}
export type AllComponentProps = TextDefaultProps & ImageDefaultProps
type AllComponentType = TextDefaultProps | ImageDefaultProps

export const textStylePropNames = without(Object.keys(textDefaultProps), 'acitionType', 'url', 'text')
export const imageStylePropsNames = without(Object.keys(imageDefaultProps), 'src')

export const transformToComponentProps = <T extends AllComponentType>(props: T) => {
  return mapValues(props, item => {
    return {
      type: (item as any).constructor as StringConstructor,
      default: item
    }
  })
}
