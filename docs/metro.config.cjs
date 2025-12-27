const { getDefaultConfig } = require('startupjs/metro-config')

const DISABLE_MINIFIER = process.env.DISABLE_MINIFIER ?? false

const config = getDefaultConfig(__dirname)

if (DISABLE_MINIFIER) {
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      compress: false,
      mangle: false
    }
  }
}

module.exports = config
