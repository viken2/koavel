'use strict'

module.exports = {
  secret: process.env.JWT_SECRET,
  exclude: [/^\/api\//, /^\/user\/login$/]
}