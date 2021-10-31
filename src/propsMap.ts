import { TextDefaultProps } from './defaultProps'

export interface PropToForm {
  component: string
  value?: string
}

export type PropToForms = {
  [P in keyof TextDefaultProps]?: PropToForm
}

export const mapPropsToForms: PropToForms = {
  text: {
    component: 'a-input'
  }
}