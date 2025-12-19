import { type ReactNode } from 'react'
import { observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import type { FileInputProps } from './index'

export default observer(themed('FileInput', FileInput))

function FileInput (props: FileInputProps): ReactNode {
  throw Error(`
    <FileInput /> is only available in Expo projects
  `)
}
