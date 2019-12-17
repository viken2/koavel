import { Context } from 'koa';
import { jwtVerify } from '../lib/LibJwt';
import config from '../../config/config';
import { UNAUTHENTICATED } from '../../config/code';
import { throwError, getToken } from '../lib/Helpers';

module.exports = () => {
  return async (ctx: Context, next: Function) => {
    const token = getToken(ctx);

    if (!token) {
      throwError(UNAUTHENTICATED, config.debug ? 'Bad Authorization header format. Format is "Authorization: Bearer <token>"' : 'Authentication Error');
    }

    await jwtVerify(token).catch((e) => {
      throwError(UNAUTHENTICATED, config.debug ? e.message : 'Authentication Error');
    });

    await next();
  };
};
