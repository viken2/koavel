'use strict'

const path = require('path')
const rootPath = path.resolve(__dirname, '..')
const appPath = path.join(rootPath, 'app')

// 公共的配置
module.exports = {
  root: rootPath,
  path: {
    lib: path.join(appPath, 'lib'),
    controller: path.join(appPath, 'controllers'),
    model: {
      common: path.join(appPath, 'models', 'common'), // 支持多个DB，默认common
    },
    middleware: path.join(appPath, 'middleware'),
    view: path.join(appPath, 'views'),
  }
}