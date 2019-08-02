'use strict'

const configApp = process.configApp.app
const path = require('path')
const sequelize = require(path.join(configApp.path.lib, 'LibDb'))

module.exports = () => {
  return async (ctx, next) => {
    if (sequelize) {
      ctx.model = sequelize.models
      ctx.sequelize = sequelize
    }

    await next();
  }
}