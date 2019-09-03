import BaseError from './BaseError';
import { Context } from 'koa';
import logger from '../lib/LibLog';
import { ERR_MSG, HTTP_OK, OK } from '../../config/code';


class BaseController {
  public ctx: any;
  public app: any;

  public constructor(ctx: Context, app: any) {
    this.ctx = ctx;
    this.app = app;
    this.ctx.logger = logger;
  }

  public throw (code: number, message = '') {
    const msg = message ? message : ERR_MSG[code];
    this.error(code, msg);

    const error: BaseError = new BaseError();
    error.code = code;
    error.message = msg;
    throw error;
  }

  public success(data: any) {
    this.ctx.status = HTTP_OK;
    this.ctx.body = {
      code: OK,
      data,
    };
  }

  public error(code: number, msg: string) {
    this.ctx.status = HTTP_OK;
    this.ctx.body = {
      code,
      error: msg ? msg : ERR_MSG[code],
    };
  }

  public json() {}
}

export default BaseController;
