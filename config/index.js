'use strict'

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV || 'production'

const envConfig = require(path.join(__dirname, 'env', env))
const appConfig = require('./app')

module.exports = Object.assign(appConfig, envConfig)