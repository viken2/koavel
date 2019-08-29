import * as path from 'path';
import * as fs from 'fs';
import * as Router from 'koa-router';
import { map as routerMap } from '../../router/index';
import { Context } from 'koa';
import BaseError from './BaseError';

const errorHandler = (app: any) => {
  app.use(async (ctx: Context, next: Function) => {
    await next().catch((e: BaseError) => {
      ctx.status = 200;
      ctx.body = {
        code: e.code,
        error: '系统升级中，请稍后再试',
      };
      if (!e.code || e.code >= 500) {
        app.emit('error', e);
      }
    })
  })
}

const initRouter = (app: any) => {
  const router = new Router();
  routerMap.forEach((value: any, key: string) => {
    const prefix = key === '/' ? '' : key;
    const keys = Object.keys(value);
    keys.forEach(key => {
      const [method, route] = key.split(' ')
      const [controllerName, fun] = value[key].split('@')
      const controllerFile = path.join(path.resolve(), 'src/app/controller', prefix, controllerName + '.ts');
      if (!fs.existsSync(controllerFile)) {
        return;
      }

      const controllerObj = require(controllerFile);
      Reflect.apply(Reflect.get(router, method), router, [prefix + route, (ctx: Context, next: any) => {
        const controller = new controllerObj(ctx, app);
        if (!Reflect.has(controller, fun)) {
          return;
        }
        return Reflect.apply(controller[fun], controller, [ctx]);
      }]);
    })
  });

  app.use(router.routes()).use(router.allowedMethods());
}

const initFun = (app: any): void => {
  errorHandler(app);
  initRouter(app);
}

export {
  initFun,
}