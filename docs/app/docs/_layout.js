import { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, TextInput, Pressable, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { pug, styl, observer } from 'startupjs'
import { Slot, Link, usePathname, Stack } from 'expo-router'
import GitHubIcon from '../../svg/github-mark.svg'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default observer(({ children }) => {
  const [search, setSearch] = useState('')
  const pathname = usePathname()
  const component = pathname.startsWith('/docs/')
    ? pathname.replace(/^\/docs\//, '').replace(/[^\w].*$/, '')
    : undefined
  useEffect(() => {
    setSearch('')
  }, [component])
  const filteredComponents = DOC_COMPONENT_NAMES.filter(name => name.toLowerCase().includes(search.toLowerCase()))

  return pug`
    View.root
      Stack.Screen(
        options={ title: 'Docs' + (component ? ' / ' + component : '') }
      )
      Animated.View.sidebar
        View.header
          Link.title(href='/') StartupJS UI
          Link(href='https://github.com/startupjs/startupjs-ui' target='_blank' accessibilityLabel='GitHub repository')
            GitHubIcon(width=24 height=24)
        TextInput.search(
          placeholder='Search...'
          placeholderTextColor='#999'
          value=search
          onChangeText=setSearch
        )
        ScrollView.items
          each component in filteredComponents
            Item(key=component)= component
      ScrollView.contentWrapper
        View.content
          Slot
  `
  styl`
    .root
      flex-direction: row
      flex: 1
    .header
      padding 15px 20px
      flex-direction: row
      align-items: center
      justify-content: space-between
    .title
      font-family monospace
    .sidebar
      max-width: 200px
      animation: slideInLeft 0.5s ease-out
    .contentWrapper
      flex: 1
    .content
      flex: 1
      max-width: 800px
      width: 100%
      align-self: center
      padding: 20px 20px 0 20px
    .items
      padding-bottom 20px
    .search
      padding 10px 10px
      margin 5px 10px
      background-color #f5f5f5
      border-radius 999px
      outline none
    @keyframes slideInLeft
      0%
        transform: translateX(-100%)
        opacity: 0
      50%
        opacity: 0.7
        transform: translateX(0)
      100%
        opacity: 1
  `
})

const Item = observer(({ children }) => {
  const [isHover, setIsHover] = useState(false)
  const onHoverIn = useCallback(() => setIsHover(true), [])
  const onHoverOut = useCallback(() => setIsHover(false), [])
  const pathname = usePathname()
  if (typeof children !== 'string') return 'NO_NAME'
  const name = children
  const href = '/docs/' + children
  const isActive = pathname === href
  return pug`
    Link(href=href asChild)
      AnimatedPressable.item(styleName={ isHover, isActive } onHoverIn=onHoverIn onHoverOut=onHoverOut)
        Text.text(styleName={ isHover, isActive })= name
  `
  styl`
    .item
      padding: 10px 20px
      border-radius: 0 999px 999px 0
      background-color: rgba(black, 0)
      transition: background-color 0.2s
      &.isHover
        transition: none
        background-color: rgba(black, 0.03)
      &.isActive
        transition: background-color 0.2s
        background-color: rgba(black, 0.05)
    .text
      color #777
      &.isActive
        font-weight bold
        color black
  `
})

const DOC_COMPONENT_NAMES = [
  'AbstractPopover',
  'Alert',
  'ArrayInput',
  'AutoSuggest',
  'Avatar',
  'Badge',
  'Br',
  'Breadcrumbs',
  'Button',
  'Card',
  'Carousel',
  'Checkbox',
  'Collapse',
  'ColorPicker',
  'Content',
  'DateTimePicker',
  'Dialogs',
  'Div',
  'Divider',
  'Draggable',
  'Drawer',
  'DrawerSidebar',
  'Dropdown',
  'FileInput',
  'FlatList',
  'Form',
  'Icon',
  'Input',
  'Item',
  'Layout',
  'Link',
  'Loader',
  'Menu',
  'Modal',
  'MultiSelect',
  'NumberInput',
  'ObjectInput',
  'Pagination',
  'PasswordInput',
  'Popover',
  'Portal',
  'Progress',
  'Radio',
  'RangeInput',
  'Rank',
  'Rating',
  'ScrollView',
  'Select',
  'Sidebar',
  'SmartSidebar',
  'Span',
  'Table',
  'Tabs',
  'Tag',
  'TextInput',
  'Toast',
  'User'
]
