'use strict'

module.exports = () => {
  return async (ctx, next) => {
    ctx.json = (code, msg, data) => {
      ctx.type = 'application/json; charset=utf-8'
      const k = msg ? 'msg' : 'data';
      const v = msg ? msg : data;
      ctx.body = {
        code,
        [k]: v
      }
    }

    ctx.success = (data) => {
      ctx.json(0, '', data)
    }

    ctx.error = (msg, code = 400) => {
      ctx.json(code, msg)
    }

    ctx.page = (total, cur, data, size, extra = {}) => {
      const ret = {
        'total': total,
        'page_size': size || process.configApp.app.pageSize,
        'page_cur': cur,
        'items': data,
        'extra': extra
      }
      ctx.json(20000, '', ret)
    }

    await next()
  }
}