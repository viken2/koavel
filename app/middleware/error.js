'use strict'

module.exports = () => {
  return async(ctx, next) => {
    await next().catch(err => {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    })
  }
}