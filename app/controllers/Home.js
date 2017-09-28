'use strict'

module.exports = {
  async index(ctx, next) {
    ctx.body = 'welcome to koavel'
  },
  async json(ctx, next) {
    // await ..
    ctx.success('welcome to koaval')
  }
}