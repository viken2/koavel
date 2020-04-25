import crypto = require('crypto');
import config from '../../config/config';
import { Context } from 'koa';
import { INVALID_ARGUMENT, UNAUTHENTICATED } from '../../config/code';
import logger from '../lib/LibLog';

const APP_ID = '1';
const APP_SECRET = 'fuckyou';

interface ApiParam {
  app_id: string;
  ver: string;
  call_id: string;
  rt: string;
  sign: string;
  nosign?: number;
}

class LibApiAuth {
  public param: ApiParam;
  public contentType: string;
  public body: any;
  public rawBody: any;
  public errCode: number;
  public errMsg: string;

  public constructor(ctx: Context) {
    this.contentType = ctx.header['content-type'] || '';
    this.param = {...ctx.query};
    this.body = ctx.request.body;
    this.rawBody = ctx.request.rawBody;
    this.errCode = 0;
    this.errMsg = '';
  }

  public checkApp() {
    if ([APP_ID].indexOf(this.param.app_id) === -1) {
      this.errCode = INVALID_ARGUMENT;
      this.errMsg = 'app id not exist';
      return false;
    }
    return true;
  }

  public checkCallId() {
    const call_id = this.param.call_id;
    if (!call_id) {
      this.errCode = INVALID_ARGUMENT;
      this.errMsg = 'call_id not found';
      return false;
    }
    return true;
  }

  public checkTime() {
    const time = this.param.rt;
    if (!time) {
      this.errCode = INVALID_ARGUMENT;
      this.errMsg = 'rt not found';
      return false;
    }
    return true;
  }

  public checkVersion() {
    const ver = this.param.ver;
    if (!ver) {
      this.errCode = INVALID_ARGUMENT;
      this.errMsg = 'ver not found';
      return false;
    }
    return true;
  }

  public checkSign() {
    const nosign = this.param.nosign;
    if (config.env !== 'production' && nosign) {
      return true;
    }

    const sign = this.param.sign;
    if (!sign) {
      this.errCode = INVALID_ARGUMENT;
      this.errMsg = 'sign not found or empty';
      return false;
    }

    delete this.param.sign;
    const checksign = this.sign(this.param);
    if (!checksign) {
      this.errCode = UNAUTHENTICATED;
      this.errMsg = 'sign error';
      return false;
    }

    if (checksign !== sign) {
      logger.info(JSON.stringify({
        sign,
        check: this.sign(this.param),
        param: this.param,
      }), {label: 'LibApiAuth'});

      this.errCode = INVALID_ARGUMENT;
      this.errMsg = 'sign error';
      return false;
    }
    return true;
  }

  private sign(param: any, algo = 'sha256') {
    const algos = ['sha256', 'md5'];
    if (algos.indexOf(algo) === -1) {
      return false;
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
      str += `${k}=${param[k]}`;
    }

    if (this.contentType === 'application/json') {
      str += this.rawBody;
    }

    const secret = APP_SECRET;
    if (algo === 'md5') {
      return crypto.createHash('md5').update(str + secret).digest('hex');
    }
    return crypto.createHmac(algo, secret).update(str).digest('hex');
  }
}

export default LibApiAuth;
