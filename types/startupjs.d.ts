import type * as React from 'react'

declare module 'startupjs' {
  export function pug (
    strings: TemplateStringsArray,
    ...expressions: any[]
  ): React.ReactNode

  export function observer<P> (
    component: React.ComponentType<P>,
    options?: Record<string, any>
  ): React.ComponentType<P>

  export function u (value?: number): number
  export function useDidUpdate (effect: () => void, deps: React.DependencyList): void

}
