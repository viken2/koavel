import * as path from 'path';
import * as fs from 'fs';
import * as Router from 'koa-router';
import { Context } from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaLogger from 'koa-logger';
import BaseError from './BaseError';
import config from '../../config/config';
import { HTTP_OK, HTTP_ERROR } from '../../config/code';

const errorHandler = (app: any) => {
  app.use(async (ctx: Context, next: Function) => {
    await next().catch((e: BaseError) => {
      ctx.status = HTTP_OK;
      ctx.body = {
        code: e.code || HTTP_ERROR,
        error: e.message,
      };

      if (!e.code || e.code >= HTTP_ERROR) {
        app.emit('error', e);
      }
    });
  });
};

const initBase = (app: any) => {
  app.use(KoaLogger());
  app.use(bodyParser());
};

const initRouter = (app: any) => {
  const router = new Router();
  const rPath = path.join(config.root, 'router');
  const files = fs.readdirSync(rPath);
  files.forEach((filename: any) => {
    const rFile = path.join(rPath, filename);
    if (!fs.existsSync(`${rFile}`)) {
      return;
    }

    const routerCnf = require(rFile);
    const prefix = routerCnf.prefix === '/' ? '' : routerCnf.prefix;
    const routes = routerCnf.router;
    for (const key in routes) {
      if (routes.hasOwnProperty(key)) {
        const item = routes[key];
        const [method, route] = key.split(' ');
        const [controllerName, fun] = item.split('@');

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
      }
    }
  });

  app.use(router.routes()).use(router.allowedMethods());
};

const initSever = (app: any): void => {
  errorHandler(app);
  initBase(app);
  initRouter(app);
};

export {
  initSever,
};
