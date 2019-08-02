'use strict'

const crypto = require('crypto');

class LibApi {
  constructor(ctx, next) {
    this.ctx = ctx
    this.next = next

    this.ctx.logger.info(this.ctx.request.url, this.ctx.request.body)
    this.param = Object.assign({}, this.ctx.query, this.ctx.request.body)
    this.checkApp()
    this.checkVersion()
    this.checkCallId()
    this.checkTime()
    this.checkSign()
  }

  checkApp() {
    if (!process.configApp.api.app.hasOwnProperty(this.param.app_id)) {
      throw new Error(1)
    }
  }

  checkCallId() {
    const call_id = this.param.call_id;
    if (!call_id) {
      throw new Error(2)
    }
  }

  checkTime() {
    const time = this.param.rt;
    if (!time) {
      throw new Error(3)
    }
  }

  checkVersion() {

  }

  checkSign() {
    const nosign = this.param.nosign;
    if (process.env.NODE_ENV !== 'production' && nosign) {
      return
    }

    const sign = this.param['sign']
    if (!sign) {
      throw new Error(4)
    }
    delete this.param['sign']

    if (this.sign(this.param) !== sign) {
      this.ctx.logger.info('LibApi', {
        sign,
        check: this.sign(this.param),
        param: this.param
      })
      throw new Error(5)
    }
  }

  sign(param, algo = 'sha256') {
    if (!['sha256', 'md5'].includes(algo)) {
      throw new Error('not support the algorithm: ' + algo)
    }

    let str = '';
    const keys = Object.keys(param).sort();
    for (const k of keys) {
      str += `${k}=${param[k]}`
    }

    const secret = process.configApp.api.app[param.app_id]
    if (algo === 'md5') {
      return crypto.createHash('md5').update(str + secret).digest('hex')
    }
    return crypto.createHmac(algo, secret).update(str).digest('hex')
  }
}

module.exports = LibApi
