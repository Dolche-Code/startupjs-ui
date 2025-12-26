import { useState, useEffect } from 'react'
import { View, ScrollView, TextInput } from 'react-native'
import { pug, styl, observer } from 'startupjs'
import { Slot, Link, usePathname, Stack } from 'expo-router'

export default observer(({ children }) => {
  const [search, setSearch] = useState('')
  const pathname = usePathname()
  const component = pathname.startsWith('/docs/')
    ? pathname.replace(/^\/docs\//, '').replace(/[^\w].*$/, '')
    : undefined
  useEffect(() => {
    setSearch('')
  }, [component])

  return pug`
    View.root
      Stack.Screen(
        options={ title: 'Docs' + (component ? ' / ' + component : '') }
      )
      ScrollView.sidebar
        TextInput.search(
          placeholder='Search...'
          placeholderTextColor='#999'
          value=search
          onChangeText=setSearch
        )
        - const filteredComponents = DOC_COMPONENT_NAMES.filter(name => name.toLowerCase().includes(search.toLowerCase()))
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
    .sidebar
      max-width: 200px
      border-right 1px solid #ccc
    .contentWrapper
      flex: 1
    .content
      flex: 1
      max-width: 800px
      width: 100%
      align-self: center
      padding: 20px 20px 0 20px
    .search
      padding 15px 20px
      border-bottom-width 1px
      border-bottom-color #ccc
      margin-bottom 10px
  `
})

const Item = observer(({ children }) => {
  const pathname = usePathname()
  if (typeof children !== 'string') return 'NO_NAME'
  const name = children
  const href = '/docs/' + children
  const isActive = pathname === href
  return pug`
    Link.item(styleName={ isActive } href=href)
      = name
  `
  styl`
    .item
      padding: 10px 20px
      &.isActive
        background-color: rgba(black, 0.05)
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
