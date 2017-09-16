'use strict'

const compose = require('koa-compose')
const body = require('koa-body')()
const kcors = require('kcors')()
const error = require('./error')()
const cache = require('./cache')()
const model = require('./model')()
const output = require('./output')()
const router = require('./router')()

module.exports = compose([
  error,
  body,
  cache,
  //model,
  kcors,
  output,
  router.routes(),
  router.allowedMethods(),
])