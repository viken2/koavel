'use strict'

class AdminController {
  constructor(ctx, model) {
    this.ctx = ctx
    this.next = next
    this.model = model
  }

  async list(where, page, limit, order) {
    const ret = await ctx.model[this.model].findAndCountAll({
      order,
      where,
      offset: (page - 1) * limit,
      limit: limit
    })

    return {
      count: ret.count,
      page,
      limit,
      items: ret.rows
    }
  }

  async add(ctx, next) {}
  async del(ctx, next) {}
  async update(ctx, next) {}
  async filter(table, keys) {}

}

module.exports = AdminController
