import crypto = require('crypto');
import BaseController from './BaseController';
import { Context } from 'koa';
import logger from '../lib/LibLog';
import config from '../../config/config';
import { INVALID_ARGUMENT, UNAUTHENTICATED } from '../../config/code';

const APP_ID = "1";
const APP_SECRET = 'fuckyou';

interface ApiParam {
  app_id: string,
  ver: string,
  call_id: string,
  rt: string,
  sign: string,
  nosign?: number,
}

class ApiController extends BaseController
{
  public param: ApiParam;
  public contentType: string;
  public body: any;
  public rawBody: any;

  constructor(ctx: Context, app: any) {
    super(ctx, app);
    this.contentType = ctx.header['content-type'] || '';
    this.param = Object.assign({}, ctx.query);
    this.body = ctx.request.body;
    this.rawBody = ctx.request.rawBody;

    this.checkApp();
    this.checkVersion()
    this.checkCallId()
    this.checkTime()
    this.checkSign()
  }

  checkApp() {
    if ([APP_ID].indexOf(this.param.app_id) === -1) {
      this.throw(INVALID_ARGUMENT, 'app id not exist');
    }
  }

  checkCallId() {
    const call_id = this.param.call_id;
    if (!call_id) {
      this.throw(INVALID_ARGUMENT, 'call_id not found');
    }
  }

  checkTime() {
    const time = this.param.rt;
    if (!time) {
      this.throw(INVALID_ARGUMENT, 'rt not found');
    }
  }

  checkVersion() {
    const ver = this.param.ver;
    if (!ver) {
      this.throw(INVALID_ARGUMENT, 'ver not found');
    }
  }

  checkSign() {
    const nosign = this.param.nosign;
    if (config.env !== 'production' && nosign) {
      return
    }

    const sign = this.param['sign']
    if (!sign) {
      this.throw(INVALID_ARGUMENT, 'sign not found or empty');
    }

    delete this.param['sign']

    if (this.sign(this.param) !== sign) {
      logger.info(JSON.stringify({
        sign,
        check: this.sign(this.param),
        param: this.param
      }), {label: 'ApiController'});

      this.throw(UNAUTHENTICATED, 'sign error');
    }
  }

  sign(param: any, algo = 'sha256') {
    const algos = ['sha256', 'md5'];
    if (algos.indexOf(algo) === -1) {
      this.throw(UNAUTHENTICATED, 'algo error');
    }

    let str = '';
    const keys = Object.keys(param).sort();

    if (this.body && this.contentType === 'application/x-www-form-urlencoded') {
      for (const key in this.body) {
        if (this.body.hasOwnProperty(key)) {
          param[key] = this.body[key];
        }
      }
    }

    for (const k of keys) {
      str += `${k}=${param[k]}`
    }

    if (this.contentType === 'application/json') {
      str += this.rawBody;
    }

    const secret = APP_SECRET;
    if (algo === 'md5') {
      return crypto.createHash('md5').update(str + secret).digest('hex')
    }
    return crypto.createHmac(algo, secret).update(str).digest('hex')
  }
}

export default ApiController;
