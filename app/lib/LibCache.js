'use strict'

const config = process.appConfig
const Redis = require('ioredis')

let cache = null

if (config.cache.default === 'redis') {
  cache = new Redis({
    port: config.cache.redis.port,
    host: config.cache.redis.host,
    family: 4,
    password: config.cache.redis.password,
  })
}

module.exports = cache