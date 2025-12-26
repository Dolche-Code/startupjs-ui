# StartupJS UI

> UI components for StartupJS

Features:

- Universal UI components which work on React Native and Web

## Installation

Add it to a [StartupJS](https://github.com/startupjs/startupjs) project with:

```
yarn add startupjs-ui
```

## Usage

```jsx
import { observer } from 'startupjs'
import { Card, Tag, Div, Span, Button, alert } from 'startupjs-ui'

export default observer(() => {
  return (
    <Card>
      <Div row gap>
        <Span bold>System Status</Span>
        <Tag color='success'>operational</Tag>
      </Div>
      <Button
        onPress={() => alert('Energy beam activated!')}
        color='primary'
      >Destroy Death Star</Button>
    </Card>
  )
})
```

## License

MIT
