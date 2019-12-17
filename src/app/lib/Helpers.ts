import { ERR_MSG } from '../../config/code';
import BaseError from '../core/BaseError';
import { Context } from 'koa';

const throwError = (code: number, message: string = ''): BaseError => {
  const msg = message ? message : ERR_MSG[code];
  const error: BaseError = new BaseError();
  error.code = code;
  error.message = msg;
  throw error;
};

const getToken = (ctx: Context): string => {
  if (!ctx.header || !ctx.header.authorization) {
    return '';
  }

  const parts = ctx.header.authorization.split(' ');
  let token = '';
  if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
  }
  return token;
};

export {
  throwError,
  getToken
};
