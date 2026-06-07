declare module 'react-katex' {
  import { ComponentType, ReactNode, ReactElement } from 'react'
  interface KatexProps {
    math: string
    children?: ReactNode
    renderError?: (error: Error) => ReactElement
    errorColor?: string
  }
  export const InlineMath: ComponentType<KatexProps>
  export const BlockMath: ComponentType<KatexProps>
}
