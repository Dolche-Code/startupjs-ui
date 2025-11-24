import { View } from 'react-native'
import { Link } from 'expo-router'

export default function Index () {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Link href='/docs' style={{
        fontSize: 20,
        backgroundColor: '#007AFF',
        color: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
      }}>Go to Docs</Link>
    </View>
  )
}
