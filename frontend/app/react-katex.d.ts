declare module 'react-katex' {
  import { ComponentType, ReactNode } from 'react'

  interface KatexProps {
    math?: string
    renderError?: (error: Error) => ReactNode
    children?: string
    as?: string
  }

  export const InlineMath: ComponentType<KatexProps>
  export const BlockMath: ComponentType<KatexProps>
}
