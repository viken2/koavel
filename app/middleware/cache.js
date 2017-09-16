'use strict'

const config = process.appConfig
const path = require('path')
const cache = require(path.join(config.path.lib, 'LibCache'))

module.exports = () => {
  return async (ctx, next) => {
    if (cache) {
      ctx.cache = cache
    }
    await next()
  }
}