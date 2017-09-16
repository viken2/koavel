'use strict'

const config = process.appConfig
const path = require('path')
const sequelize = require(path.join(config.path.lib, 'LibDb'))

module.exports = () => {
  return async (ctx, next) => {
    if (db) {
      ctx.model = sequelize.models
      ctx.sequelize = sequelize
    }

    await next();
  }
}