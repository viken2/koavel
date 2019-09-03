import * as path from 'path';
import * as fs from 'fs';
import * as Router from 'koa-router';
import { map as routerMap } from '../../router/index';
import { Context } from 'koa';
import bodyParser = require('koa-bodyparser');
import BaseError from './BaseError';
import config from '../../config/config';
import { HTTP_OK, HTTP_ERROR } from '../../config/code';

const errorHandler = (app: any) => {
  app.use(async (ctx: Context, next: Function) => {
    await next().catch((e: BaseError) => {
      ctx.status = HTTP_OK;
      ctx.body = {
        code: e.code,
        error: e.message,
      };

      if (!e.code || e.code >= HTTP_ERROR) {
        app.emit('error', e);
      }
    });
  });
};

const initBase = (app: any) => {
  app.use(bodyParser());
};

const initRouter = (app: any) => {
  const router = new Router();
  routerMap.forEach((value: any, key: string) => {
    const prefix = key === '/' ? '' : key;
    const keys = Object.keys(value);
    keys.forEach((key: string) => {
      const [method, route] = key.split(' ');
      const [controllerName, fun] = value[key].split('@');
      const controllerFile = path.join(config.root, 'app/controller', prefix, controllerName);
      if (!fs.existsSync(`${controllerFile}.js`) && !fs.existsSync(`${controllerFile}.ts`)) {
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
    });
  });

  app.use(router.routes()).use(router.allowedMethods());
};

const initFun = (app: any): void => {
  errorHandler(app);
  initBase(app);
  initRouter(app);
};

export {
  initFun,
};
