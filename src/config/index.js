'use strict'

const configApp = {
  app: require('./app'),
  db: require('./database'),
  api: require('./api'),
  jwt: require('./jwt')
}

process.configApp = configApp

module.exports = configApp