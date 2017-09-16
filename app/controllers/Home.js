'use strict'

module.exports = {
  index(ctx, next) {
    ctx.body = 'welcome to koavel'
  },
  json(ctx, next) {
    ctx.success('welcome to koaval')
  }
}