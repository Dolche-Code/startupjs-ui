import { $ } from 'startupjs'

export default {
  features: {
    enableServer: false,
    enableOAuth2: false
  },
  client: {
    init () {
      globalThis.$ = $
    }
  }
}
