'use strict'

const path = require('path')
const rootPath = path.resolve(__dirname, '..')
const appPath = path.join(rootPath, 'app')

// 公共的配置
module.exports = {
  root: rootPath,
  core: {
    path: path.join(appPath, 'core'),
  },
  lib: {
    path: path.join(appPath, 'lib'),
  },
  controller: {
    path: path.join(appPath, 'controller')
  },
  model: path.join(appPath, 'model'),
  middleware: path.join(appPath, 'middleware'),
  log: {
    level: 'debug',
    path: path.join(rootPath, 'log'),
  },
  jwtSecret: process.env.JWT_SECRET,
  routeWhite: [
    '/login',
    '/logout',
    '/redirect'
  ],
}