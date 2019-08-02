'use strict'

const path = require('path')
const LibJwt = require(path.join(process.configApp.app.path.lib, 'LibJwt'))
const excludeRoute = process.configApp.jwt.exclude

module.exports = () => {
  return async (ctx, next) => {
    if (excludeRoute.length <= 0) {
      ctx.error('no exclude route')
      return
    }

    if (ctx.method === 'OPTIONS') {
      await next()
      return
    }

    let check = false
    for (const exp of excludeRoute) {
      if (exp.test(ctx.path)) {
        check = true
        break
      }
    }

    if (check) {
      await next()
      return
    }

    const token = ctx.headers['x-token'] ? ctx.headers['x-token'] : ctx.query.token
    if (!token) {
      ctx.throw(401, 'Unauthorized')
      return
    }

    try {
      const ret = await LibJwt.verify(token)
      ctx.login = ret.data
    } catch(e) {
      ctx.throw(401, 'no auth')
      return
    }

    await next()
  }
}