'use strict'

const path = require('path')
const logger = require(path.join(process.configApp.app.path.lib, 'LibLog'))

module.exports = () => {
  return async (ctx, next) => {
    ctx.logger = logger
    await next();
  }
}