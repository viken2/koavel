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
import { UniqueConstraintError, BaseError as SequelizeError } from 'sequelize';
import logger from '../lib/LibLog';
import { dingAlert } from '../lib/Helpers';

const errorHandler = (app: any) => {
  app.use(async (ctx: Context, next: Function) => {
    await next().catch((e: BaseError) => {
      let message = e.message;
      if (e instanceof UniqueConstraintError) {
        message = config.debug ? e.original.message : '接口异常，请稍后再试';
      } else if (e instanceof SequelizeError) {
        message = config.debug ? e.message : '接口异常，请稍后再试';
      }

      ctx.status = HTTP_OK;
      ctx.type = 'application/json; charset=utf-8';
      ctx.body = {
        code: (e.code && typeof e.code === 'number') ? e.code : HTTP_ERROR,
        error: message,
      };

      if (!e.code || e.code >= HTTP_ERROR) {
        dingAlert(`请求：${ctx.url}，错误：${message}`);
        logger.error({
          url: ctx.url,
          method: ctx.method,
          body: ctx.request.body,
          error: message,
          stack: e.stack,
        });
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

const confRouter = (app: any) => {
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
    const prefix = routerCnf.prefix || '';
    const routes = routerCnf.router;

    for (const key in routes) {
      if (routes.hasOwnProperty(key)) {
        const item = routes[key];
        const [methodOld, route] = key.split(' ');
        const method = methodOld.toLocaleLowerCase();
        const [controllerName, fun] = item.split('@');
        if (routerCnf.middleware && routerCnf.middleware.length > 0) {
          let mk = method;
          if (prefix) {
            mk += ' /' + prefix;
          } else {
            mk += ' ';
          }
          mk += route;
          routeMiddles[mk] = routerCnf.middleware;
        }

        const controllerFile = path.join(config.root, 'app/controller', group, controllerName);
        if (!fs.existsSync(`${controllerFile}.js`) && !fs.existsSync(`${controllerFile}.ts`)) {
          continue;
        }

        const ObjController = require(controllerFile);
        Reflect.apply(Reflect.get(router, method), router, [prefix ? '/' + prefix + route : route, (ctx: Context, next: any) => {
          const controller = new ObjController(ctx);
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
      await fun(ctx, async () => {});
    }
    await next();
  });

  app.use(router.routes()).use(router.allowedMethods());
};

export default (app: any): void => {
  errorHandler(app);
  initBase(app);
  confRouter(app);
  initRouter(app);
};
