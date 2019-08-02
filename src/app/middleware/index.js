'use strict'

const compose = require('koa-compose')
const body = require('koa-body')()
const kcors = require('kcors')()
const error = require('./error')()
const model = require('./model')()
const output = require('./output')()
const router = require('./router')()
const helmet = require("koa-helmet")()
const logger = require("./log")()
const jwt = require("./jwt")()

module.exports = compose([
  error,
  logger,
  jwt,
  helmet,
  kcors,
  body,
  model,
  output,
  router.routes(),
  router.allowedMethods(),
])