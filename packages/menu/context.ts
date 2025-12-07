import { createContext } from 'react'

export interface MenuContextValue {
  activeBorder?: 'top' | 'bottom' | 'left' | 'right' | 'none'
  activeColor?: string
  iconPosition?: 'left' | 'right'
  color?: string
}

export default createContext<MenuContextValue>({})
