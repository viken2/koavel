import crypto = require('crypto');
import BaseController from './BaseController';
import { Context } from 'koa';
import logger from '../lib/LibLog';
import config from '../../config/config';


class ApiController extends BaseController
{
  public param: any;

  constructor(ctx: Context, app: any) {
    super(ctx, app);
    // this.param = Object.assign({}, ctx.query, ctx.request.body)
    // this.checkApp()
    // this.checkVersion()
    // this.checkCallId()
    // this.checkTime()
    // this.checkSign()
  }

  checkApp() {
    // if (!process.configApp.api.app.hasOwnProperty(this.param.app_id)) {
    //   this.throw('fuckyou222', 401);
    // }
  }

  checkCallId() {
    // const call_id = this.param.call_id;
    // if (!call_id) {
    //   // throw new Error(2)
    // }
  }

  checkTime() {
    // const time = this.param.rt;
    // if (!time) {
    //   // throw new Error(3)
    // }
  }

  checkVersion() {

  }

  checkSign() {
    const nosign = this.param.nosign;
    if (config.env !== 'production' && nosign) {
      return
    }

    const sign = this.param['sign']
    if (!sign) {
      // throw new Error(4)
    }
    delete this.param['sign']

    if (this.sign(this.param) !== sign) {
      logger.info(JSON.stringify({
        sign,
        check: this.sign(this.param),
        param: this.param
      }), {label: 'ApiController'});

      // throw new Error(5)
    }
  }

  sign(param: any, algo = 'sha256') {
    const algos = ['sha256', 'md5'];
    if (-1 === algos.indexOf(algo)) {
      throw new Error('not support the algorithm: ' + algo)
    }

    let str = '';
    const keys = Object.keys(param).sort();
    for (const k of keys) {
      str += `${k}=${param[k]}`
    }

    // const secret = process.configApp.api.app[param.app_id]
    const secret = '';
    if (algo === 'md5') {
      return crypto.createHash('md5').update(str + secret).digest('hex')
    }
    return crypto.createHmac(algo, secret).update(str).digest('hex')
  }
}

export default ApiController;
