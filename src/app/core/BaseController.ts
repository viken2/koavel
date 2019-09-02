import BaseError from './BaseError';
import { Context } from 'koa';
import logger from '../lib/LibLog';
import { ERR_MSG, OK } from '../../config/code';

class BaseController {
  public ctx: any;
  public app: any;

  constructor(ctx: Context, app: any) {
    this.ctx = ctx;
    this.app = app;
    this.ctx.logger = logger;
  }

  throw (code: number, message = '') {
    message = message ? message : ERR_MSG[code];
    this.error(code, message);

    const error: BaseError = new BaseError();
    error.code = code;
    error.message = message;
    throw error;
  }

  success(data: any) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: OK,
      data,
    };
  }

  error(code: number, msg: string) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: code,
      error: msg ? msg : ERR_MSG[code],
    };
  }

  json() {}
}

export default BaseController;
