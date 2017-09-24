'use strict'

module.exports = {
  index(ctx, next) {
    ctx.body = 'welcome to koavel ' + process.pid
  },
  async json(ctx, next) {
    // await ..
    ctx.success('welcome to koaval')
  }
}