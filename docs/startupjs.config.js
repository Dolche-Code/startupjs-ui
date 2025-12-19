import { $ } from 'startupjs'

export default {
  features: {
    enableServer: true,
    enableOAuth2: true
  },
  client: {
    init () {
      globalThis.$ = $
    }
  }
}
