import { useState, useEffect } from 'react'
import { Platform } from 'react-native'

export default function useKeyboard ({
  isShow,
  renderContent,
  value,
  onChange,
  onChangeShow
}: {
  isShow: boolean
  renderContent: { current: any[] }
  value: any
  onChange?: (value: any) => void
  onChangeShow: (visible: boolean) => void
}): [number] {
  const [selectIndexValue, setSelectIndexValue] = useState(-1)

  useEffect(() => {
    if (Platform.OS !== 'web') return

    if (isShow) {
      document.addEventListener('keydown', onKeyDown)
    } else {
      document.removeEventListener('keydown', onKeyDown)
      setSelectIndexValue(-1)
    }

    return () => { document.removeEventListener('keydown', onKeyDown) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow, selectIndexValue])

  function onKeyDown (e: KeyboardEvent) {
    e.preventDefault()
    e.stopPropagation()

    let item: any
    let index: number
    const keyName = e.key

    switch (keyName) {
      case 'ArrowUp':
        if (selectIndexValue === 0 || (selectIndexValue === -1 && !value)) return

        index = selectIndexValue - 1
        if (selectIndexValue === -1 && value) {
          index = renderContent.current.findIndex(item => item.props.value === value)
          index--
        }

        setSelectIndexValue(index)
        break

      case 'ArrowDown':
        if (selectIndexValue === renderContent.current.length - 1) return

        index = selectIndexValue + 1
        if (selectIndexValue === -1 && value) {
          index = renderContent.current.findIndex(item => item.props.value === value)
          index++
        }

        setSelectIndexValue(index)
        break

      case 'Enter':
        if (selectIndexValue === -1) return
        item = renderContent.current.find((_, i) => i === selectIndexValue)
        onChange && onChange(item.props.value)
        onChangeShow(false)
        break
    }
  }

  return [selectIndexValue]
}
