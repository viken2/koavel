import { Context } from 'koa';
import config from '../../config/config';
import { UNAUTHENTICATED } from '../../config/code';
import { oidcVerify } from '../lib/LibOidc';
import { throwError, getToken } from '../lib/Helpers';

module.exports = () => {
  return async (ctx: Context, next: Function) => {
    const token = getToken(ctx);

    if (!token) {
      throwError(UNAUTHENTICATED, config.debug ? 'Bad Authorization header format. Format is "Authorization: Bearer <token>"' : 'Authentication Error');
    }

    await oidcVerify(token).then(async (user) => {
      ctx.uid = '123';
      ctx.user = user;
    }).catch((e) => {
      throwError(UNAUTHENTICATED, config.debug ? e.message : 'Authentication Error: token');
    });

    await next();
  };
};
