'use strict'

const crypto = require('crypto');
const BaseController = require('./BaseController');
const debug = require('debug')('koavel:ApiController');

const CODE_SUCESS = 200;

class ApiController extends BaseController
{
  constructor(ctx, app) {
    super(ctx, app);
    app.logger.error(this.ctx.request.url + ', body=' + JSON.stringify(this.ctx.request.body), {label: 'ApiController'})
    this.param = Object.assign({}, this.ctx.query, this.ctx.request.body)
    this.checkApp()
    this.checkVersion()
    this.checkCallId()
    this.checkTime()
    this.checkSign()
  }

  sucess(data) {
    this.ctx.status = 200;
    this.ctx.body = data;
  }

  error(code, msg) {
    this.ctx.status = code;
    this.ctx.body = {
      error: msg,
    };
  }

  checkApp() {
    // if (!process.configApp.api.app.hasOwnProperty(this.param.app_id)) {
    //   this.throw('fuckyou222', 401);
    // }
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
    if (this.app.env !== 'production' && nosign) {
      return
    }

    const sign = this.param['sign']
    if (!sign) {
      throw new Error(4)
    }
    delete this.param['sign']

    if (this.sign(this.param) !== sign) {
      this.ctx.logger.info(JSON.stringify({
        sign,
        check: this.sign(this.param),
        param: this.param
      }), {label: 'ApiController'});
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

module.exports = ApiController
