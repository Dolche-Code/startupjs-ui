export const POPOVER_MARGIN = 8 as const
export const ARROW_SIZE = 8 as const

export type AbstractPopoverPosition = 'top' | 'bottom' | 'left' | 'right'
export type AbstractPopoverAttachment = 'start' | 'center' | 'end'
export type AbstractPopoverPlacement = `${AbstractPopoverPosition}-${AbstractPopoverAttachment}`

export const STEPS = {
  CLOSE: 'close',
  MEASURE: 'measure',
  RENDER: 'render',
  OPEN: 'open'
} as const

export const PLACEMENTS_ORDER = [
  'top-start',
  'top-center',
  'top-end',
  'right-start',
  'right-center',
  'right-end',
  'bottom-end',
  'bottom-center',
  'bottom-start',
  'left-end',
  'left-center',
  'left-start'
] as const satisfies readonly AbstractPopoverPlacement[]

export const POSITIONS_REVERSE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
} as const
