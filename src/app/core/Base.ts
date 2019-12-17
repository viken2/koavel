import * as path from 'path';
import * as fs from 'fs';
import * as Router from 'koa-router';
import { Context } from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaLogger from 'koa-logger';
import * as KoaCors from '@koa/cors';
import * as helmet from 'koa-helmet';
import BaseError from './BaseError';
import config from '../../config/config';
import { HTTP_OK, HTTP_ERROR } from '../../config/code';
import { pathToRegexp } from 'path-to-regexp';

const errorHandler = (app: any) => {
  app.use(async (ctx: Context, next: Function) => {
    await next().catch((e: BaseError) => {
      ctx.status = HTTP_OK;
      ctx.type = 'application/json; charset=utf-8';
      ctx.body = {
        code: (e.code && typeof e.code === 'number') ? e.code : HTTP_ERROR,
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
  app.use(KoaCors());
  app.use(helmet());
  app.use(bodyParser());
};

const initRouter = (app: any) => {
  const router = new Router();
  const rPath = path.join(config.root, 'router');
  const files = fs.readdirSync(rPath);
  const routeMiddles: any = {};
  files.forEach((filename: any) => {
    const rFile = path.join(rPath, filename);
    if (!fs.existsSync(`${rFile}`)) {
      return;
    }

    const routerCnf = require(rFile);
    if (!Reflect.has(routerCnf, 'group')) {
      return;
    }

    const group = routerCnf.group;
    const routes = routerCnf.router;
    for (const key in routes) {
      if (routes.hasOwnProperty(key)) {
        const item = routes[key];
        const [method, route] = key.split(' ');
        const [controllerName, fun] = item.split('@');
        if (routerCnf.middleware && routerCnf.middleware.length > 0) {
          routeMiddles[key] = routerCnf.middleware;
        }

        const controllerFile = path.join(config.root, 'app/controller', group, controllerName);
        if (!fs.existsSync(`${controllerFile}.js`) && !fs.existsSync(`${controllerFile}.ts`)) {
          return;
        }

        const controllerObj = require(controllerFile);
        Reflect.apply(Reflect.get(router, method), router, [route, (ctx: Context, next: any) => {
          const controller = new controllerObj(ctx);
          if (!Reflect.has(controller, fun)) {
            return;
          }

          return Reflect.apply(controller[fun], controller, [ctx]);
        }]);
      }
    }
  });

  app.use(async (ctx: Context, next: Function) => {
    if (ctx.method === 'OPTIONS') {
      await next();
      return;
    }

    let key = `${ctx.method.toLowerCase()} ${ctx.path}`;
    if (!routeMiddles.hasOwnProperty(key)) {
      let check = false;
      for (const route in routeMiddles) {
        if (routeMiddles.hasOwnProperty(route)) {
          if (pathToRegexp(route).test(key)) {
            check = true;
            key = route;
            break;
          }
        }
      }

      if (!check) {
        await next();
        return;
      }
    }

    for (const middleware of routeMiddles[key]) {
      const fun = require(path.join(config.root, 'app/middleware', middleware))();
      await fun(ctx, next);
    }
  });

  app.use(router.routes()).use(router.allowedMethods());
};

export default (app: any): void => {
  errorHandler(app);
  initBase(app);
  initRouter(app);
};
