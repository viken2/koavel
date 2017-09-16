'use strict';

module.exports = {
  async get(ctx, next) {
    ctx.success('get')
  },
  async post(ctx, next) {
    ctx.success('post')
  },
  async put(ctx, next) {
    ctx.success('put')
  },
  async patch(ctx, next) {
    ctx.success('patch')
  },
  async del(ctx, next) {
    ctx.success('del')
  },
}