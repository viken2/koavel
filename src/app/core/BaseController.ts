import BaseError from './BaseError';
import { Context } from 'koa';
import logger from '../lib/LibLog';

class BaseController {
  public ctx: any;
  public app: any;

  constructor(ctx: Context, app: any) {
    this.ctx = ctx;
    this.app = app;
    this.ctx.logger = logger;
  }

  throw (message: string, code: number) {
    this.error(code, message);

    const error: BaseError = new BaseError();
    error.code = code || 500;
    error.message = message;
    throw error;
  }

  success(data: any) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: 200,
      data,
    };
  }

  error(code: number, msg: string) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: code,
      error: msg,
    };
  }

  json() {}
}

export default BaseController;
