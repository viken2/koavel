'use strict'

const config = process.appConfig
const Redis = require('ioredis')

module.exports = () => {
  let cache = null
  if (config.cache.default === 'redis') {
    cache = new Redis({
      port: config.redis.port,
      host: config.redis.host,
      family: 4,
      password: config.redis.password,
    })
  }
  return cache
}