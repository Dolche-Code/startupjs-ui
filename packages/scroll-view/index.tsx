import { type ReactNode, type Ref } from 'react'
import { ScrollView as RNScrollView, type StyleProp } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import './index.cssx.styl'

export default observer(themed('ScrollView', ScrollView))

export const _PropsJsonSchema = {/* ScrollViewProps */}

export interface ScrollViewProps {
  /** Ref to access the underlying ScrollView instance */
  ref?: Ref<any>
  /** Custom styles applied to the root ScrollView */
  style?: StyleProp<any>
  /** Content rendered inside ScrollView */
  children?: ReactNode
  /** Expand content container to take full available height */
  full?: boolean
}

function ScrollView ({
  ref,
  full = false,
  ...props
}: ScrollViewProps): ReactNode {
  return pug`
    RNScrollView.root(ref=ref part='root' styleName={ full } ...props)
  `
}
