import React, { useState, useEffect, useMemo, useCallback, type ReactNode, type RefObject } from 'react'
import { Platform, View } from 'react-native'
import { pug, styl } from 'startupjs'
import Span from '@startupjs-ui/span'
import AbstractPopover from '@startupjs-ui/abstract-popover'

const isWeb = Platform.OS === 'web'

const DEFAULT_TOOLTIP_PROPS = {
  position: 'top',
  attachment: 'center',
  arrow: true
}

interface UseTooltipProps {
  style?: any
  anchorRef: RefObject<any>
  tooltip?: ReactNode | (() => ReactNode)
}

export type TooltipEventHandler = 'onMouseEnter' | 'onMouseLeave' | 'onLongPress' | 'onPressOut'
export type TooltipEventHandlers = Partial<Record<TooltipEventHandler, any>>
export const tooltipEventHandlersList: TooltipEventHandler[] = [
  'onMouseEnter',
  'onMouseLeave',
  'onLongPress',
  'onPressOut'
]

interface TooltipResult {
  tooltipElement?: ReactNode
  tooltipEventHandlers: TooltipEventHandlers
  tooltipHash: 'none' | 'hover' | 'press'
}

export default function useTooltip ({ style, anchorRef, tooltip }: UseTooltipProps) {
  const result: TooltipResult = { tooltipEventHandlers: {}, tooltipHash: 'none' }
  const [visible, setVisible] = useState(false)

  const cbSetVisibleTrue = useCallback(() => { setVisible(true) }, [])
  const cbSetVisibleFalse = useCallback(() => { setVisible(false) }, [])

  useEffect(() => {
    if (!isWeb) return
    if (!tooltip) return

    window.addEventListener('wheel', cbSetVisibleFalse, true)
    return () => {
      window.removeEventListener('wheel', cbSetVisibleFalse, true)
    }
  }, [cbSetVisibleFalse, cbSetVisibleTrue, tooltip])

  const tooltipEventHandlers = useMemo(() => {
    const handlers: TooltipEventHandlers = {}
    if (!tooltip) return handlers

    if (isWeb) {
      handlers.onMouseEnter = cbSetVisibleTrue
      handlers.onMouseLeave = cbSetVisibleFalse
    } else {
      handlers.onLongPress = cbSetVisibleTrue
      handlers.onPressOut = cbSetVisibleFalse
    }

    return handlers
  }, [cbSetVisibleFalse, cbSetVisibleTrue, tooltip])

  result.tooltipEventHandlers = tooltipEventHandlers

  if (tooltip) {
    result.tooltipElement = pug`
      AbstractPopover.tooltip(
        style=style
        anchorRef=anchorRef
        visible=visible
        ...DEFAULT_TOOLTIP_PROPS
      )
        //- case for DEPRECATED renderTooltip property
        if typeof tooltip === 'function'
          = tooltip()
        else
          //- HACK
          //- Wrap to row, because for small texts it does not correctly hyphenate in the text
          //- For example $500,000, Copy, etc...
          View(style={ flexDirection: 'row' })
            Span.tooltip-text= tooltip
    `
  }

  return result

  styl`
    .tooltip
      background-color var(--Div-tooltipBg)
      max-width 260px
      radius()
      shadow(3)
      padding 1u 2u

      +tablet()
        max-width 320px

      &-text
        color var(--Div-tooltipText)
  `
}
