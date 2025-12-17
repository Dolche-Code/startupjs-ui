import React, { useContext, useEffect, useRef } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { State, PanGestureHandler } from 'react-native-gesture-handler'
import { pug, observer } from 'startupjs'
import { Portal } from '@startupjs/ui'
import { DragDropContext } from './DragDropProvider'
import './index.styl'

export default observer(function Draggable ({
  children,
  style,
  type,
  dragId,
  _dropId,
  _index,
  onDragBegin,
  onDragEnd
}) {
  const ref = useRef()
  const $dndContext = useContext(DragDropContext)

  const animateStates = {
    left: new Animated.Value(0),
    top: new Animated.Value(0)
  }

  // init drags.dragId
  useEffect(() => {
    $dndContext.drags[dragId].set({ ref, style: {} })
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    dragId,
    _dropId,
    _index,
    $dndContext.drags[dragId].ref.current.get() // eslint-disable-line react-hooks/exhaustive-deps
  ])

  function onHandlerStateChange ({ nativeEvent }) {
    const data = {
      type,
      dragId,
      dropId: _dropId,
      dragStyle: { ...style },
      startPosition: {
        x: nativeEvent.x,
        y: nativeEvent.y
      }
    }

    if (nativeEvent.state === State.BEGAN) {
      ref.current.measure((dragX, dragY, dragWidth, dragHeight) => {
        data.dragStyle.height = dragHeight

        $dndContext.drops[_dropId].ref.current.get().measure((dx, dy, dw, dropHeight) => {
          // init states
          $dndContext.drags[dragId].style.set({ display: 'none' })
          $dndContext.assign({
            activeData: data,
            dropHoverId: _dropId,
            dragHoverIndex: _index
          })

          onDragBegin && onDragBegin({
            dragId: data.dragId,
            dropId: data.dropId,
            dropHoverId: _dropId,
            hoverIndex: _index
          })
        })
      })
    }

    if (nativeEvent.state === State.END) {
      animateStates.left.setValue(0)
      animateStates.top.setValue(0)

      onDragEnd && onDragEnd({
        dragId: $dndContext.activeData.dragId.get(),
        dropId: $dndContext.activeData.dropId.get(),
        dropHoverId: $dndContext.dropHoverId.get(),
        hoverIndex: $dndContext.dragHoverIndex.get()
      })

      // reset states
      $dndContext.setEach({
        drags: {
          [dragId]: { style: {} }
        },
        activeData: {},
        dropHoverId: '',
        dragHoverIndex: null
      })
    }
  }

  function onGestureEvent ({ nativeEvent }) {
    if (!$dndContext.dropHoverId.get()) return

    animateStates.left.setValue(
      nativeEvent.absoluteX - $dndContext.activeData.startPosition.x.get()
    )
    animateStates.top.setValue(
      nativeEvent.absoluteY - $dndContext.activeData.startPosition.y.get()
    )

    $dndContext.set('activeData.x', nativeEvent.absoluteX)
    $dndContext.set('activeData.y', nativeEvent.absoluteY)
    checkPosition($dndContext.activeData.get())
  }

  function checkPosition (activeData) {
    $dndContext.drops[_dropId].ref.current.get().measure(async (dX, dY, dWidth, dHeight, dPageX, dPageY) => {
      const positions = []
      let startPosition = dPageY
      let endPosition = dPageY

      const dragsLength = $dndContext.drops[$dndContext.dropHoverId.get()].items.get()?.length || 0

      for (let index = 0; index < dragsLength; index++) {
        if (!$dndContext.dropHoverId.get()) break

        const iterDragId = $dndContext.drops[$dndContext.dropHoverId.get()].items[index].get()

        await new Promise(resolve => {
          $dndContext.drags[iterDragId].ref.current.get().measure((x, y, width, height, pageX, pageY) => {
            if (index === 0) {
              startPosition = dPageY
              endPosition = dPageY + y + (height / 2)
            } else {
              startPosition = endPosition
              endPosition = pageY + (height / 2)
            }

            if (iterDragId === dragId) {
              positions.push(null)
            } else {
              positions.push({ start: startPosition, end: endPosition })
            }

            resolve()
          })
        })
      }

      positions.push({ start: endPosition, end: dPageY + dHeight })

      for (let index = 0; index < positions.length; index++) {
        const position = positions[index]
        if (!position) continue

        if (activeData.y > position.start && activeData.y < position.end) {
          $dndContext.set('dragHoverIndex', index)
          break
        }
      }
    })
  }

  const contextStyle = $dndContext.drags[dragId].style.get() || {}
  const _style = StyleSheet.flatten([style, animateStates])

  const isShowPlaceholder = $dndContext.activeData.get() &&
    $dndContext.dropHoverId.get() === _dropId &&
    $dndContext.dragHoverIndex.get() === _index

  const isShowLastPlaceholder = $dndContext.activeData.get() &&
    $dndContext.dropHoverId.get() === _dropId &&
    $dndContext.drops[_dropId].items.get().length - 1 === _index &&
    $dndContext.dragHoverIndex.get() === _index + 1

  const placeholder = pug`
    View.placeholder(
      style={
        height: $dndContext.activeData.get() && $dndContext.activeData.dragStyle.get() && $dndContext.activeData.dragStyle.height.get(),
        marginTop: $dndContext.activeData.get() && $dndContext.activeData.dragStyle.get() && $dndContext.activeData.dragStyle.marginTop.get(),
        marginBottom: $dndContext.activeData.get() && $dndContext.activeData.dragStyle.get() && $dndContext.activeData.dragStyle.marginBottom.get()
      }
    )
  `

  return pug`
    if isShowPlaceholder
      = placeholder

    Portal
      if $dndContext.activeData.dragId.get() === dragId
        Animated.View(style=[
          _style,
          { position: 'absolute', cursor: 'default' }
        ])= children

    PanGestureHandler(
      onHandlerStateChange=onHandlerStateChange
      onGestureEvent=onGestureEvent
    )
      Animated.View(
        ref=ref
        style=[style, contextStyle]
      )= children

    if isShowLastPlaceholder
      = placeholder
  `
}, { cache: false })
