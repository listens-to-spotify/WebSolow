import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { ReactNode } from 'react'

interface KatexProps {
  math?: string
  children?: string
  renderError?: (error: Error) => ReactNode
}

export function InlineMath({ math, children, renderError }: KatexProps) {
  const formula = math ?? children ?? ''
  try {
    const html = katex.renderToString(formula, {
      displayMode: false,
      throwOnError: !renderError,
    })
    return <span dangerouslySetInnerHTML={{ __html: html }} />
  } catch (e) {
    if (renderError && e instanceof Error) return renderError(e)
    throw e
  }
}

export function BlockMath({ math, children, renderError }: KatexProps) {
  const formula = math ?? children ?? ''
  try {
    const html = katex.renderToString(formula, {
      displayMode: true,
      throwOnError: !renderError,
    })
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  } catch (e) {
    if (renderError && e instanceof Error) return renderError(e)
    throw e
  }
}
