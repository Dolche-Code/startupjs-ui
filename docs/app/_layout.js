import { StartupjsProvider } from 'startupjs'
import { Stack } from 'expo-router'

export default function RootLayout () {
  return (
    <StartupjsProvider>
      <Stack />
    </StartupjsProvider>
  )
}
