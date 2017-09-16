'use strict'

module.exports = () => {
  return async (ctx, next) => {
    ctx.json = (code, msg, data) => {
      ctx.type = 'application/json; charset=utf-8'
      ctx.body = {
        status: code,
        msg: msg,
        data: data
      }
    }

    ctx.success = (data) => {
      ctx.json(0, '', data)
    }

    ctx.error = (msg, code = 600) => {
      ctx.json(600, msg, data)
    }

    ctx.page = (total, cur, data, size, extra = {}) => {
      const ret = {
        'total': total,
        'page_size': size || config.app.pageSize,
        'page_cur': cur,
        'list': data,
        'extra': extra
      }
      ctx.json(0, '', ret)
    }

    await next()
  }
}