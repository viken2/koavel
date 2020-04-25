import { Context } from 'koa';
import LibApiAuth from '../lib/LibApiAuth';
import { throwError } from '../lib/Helpers';

module.exports = () => {
  return async (ctx: Context, next: Function) => {
    const auth = new LibApiAuth(ctx);
    if (!auth.checkApp()) {
      throwError(auth.errCode, auth.errMsg);
    }

    if (!auth.checkVersion()) {
      throwError(auth.errCode, auth.errMsg);
    }

    if (!auth.checkCallId()) {
      throwError(auth.errCode, auth.errMsg);
    }

    if (!auth.checkTime()) {
      throwError(auth.errCode, auth.errMsg);
    }

    if (!auth.checkSign()) {
      throwError(auth.errCode, auth.errMsg);
    }

    await next();
  };
};
