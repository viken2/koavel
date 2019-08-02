'use strict'

class BaseController
{
  constructor(ctx, app) {
    this.ctx = ctx;
    this.app = app;
    this.ctx.logger = app.logger;
  }

  throw (message, code) {
    this.error(code, message);

    const error = new Error();
    error.code = code || 500;
    error.message = message;
    throw error;
  }

  sucess(data) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: 200,
      data,
    };
  }

  error(code, msg) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: code,
      error: msg,
    };
  }

  json() {

  }
}

module.exports = BaseController;
