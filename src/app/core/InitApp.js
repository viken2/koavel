'use strict';

const debug = require('debug')('koavel:initApp');
const path = require('path');
const config = require('../../config');
const Router = require('koa-router')
const fs = require('fs')

class InitApp
{
  constructor(app) {
    this.app = app;
    this.app.config = config;
  }

  initPath() {
    this.app.path = {
      config: path.join(this.app.root, 'config'),
      router: path.join(this.app.root, 'router'),
      core: path.join(this.app.root, 'app', 'core'),
      lib: path.join(this.app.root, 'app', 'lib'),
      model: path.join(this.app.root, 'app', 'model'),
      plugin: path.join(this.app.root, 'app', 'plugin'),
      controller: path.join(this.app.root, 'app', 'controller'),
      middleware: path.join(this.app.root, 'app', 'middleware'),
    };
  }

  errorHandler() {
    this.app.use(async (ctx, next) => {
      await next().catch(e => {
        console.log(e.code);
        console.log(e.message);
        if (!e.code || e.code >= 500) {
          this.app.emit('error', e);
        }
      })
    })
  }

  initConfig() {
    let config = {};
    const defaultFile = path.join(this.app.path.config, 'config.default.js');
    const envFile = path.join(this.app.path.config, `config.${this.app.env}.js`);
    if (fs.existsSync(defaultFile)) {
      const defaultConfig = require(defaultFile)(this.app);
      config = Object.assign({}, defaultConfig);
    }

    if (fs.existsSync(envFile)) {
      const env = require(envFile)(this.app);
      config = Object.assign(config, env);
    }
    this.app.config = config;
    this.app.config.path = this.app.path;
  }

  initBaseLib() {
    const LibLog = require(path.join(this.app.path.lib, 'LibLog'));
    this.app.logger = new LibLog(this.app).logger;

    // jwt
  }

  initRouter() {
    const router = new Router();
    const routers = require(this.app.path.router);
    for (let item of routers.entries()) {
      const prefix = item[0] === '/' ? '' : item[0]
      const keys = Object.keys(item[1])
      keys.forEach(key => {
        let [method, route] = key.split(' ')
        const [controller, fun] = item[1][key].split('@')
        const controllerFile = path.join(this.app.path.controller, prefix, controller + '.js');
        if (!fs.existsSync(controllerFile)) {
          return;
        }

        const controllerObj = require(controllerFile)(this.app)
        router[method](prefix + route, (ctx, next) => {
          debug('router=%s, method=%s', prefix + route, method);
          const controller = new controllerObj(ctx, this.app)
          return controller[fun]();
        })
      })
    }

    this.app.use(router.routes()).use(router.allowedMethods());
  }

  initMiddleware() {}

  loadPlugin() {
    let plugins = {};
    const defaultPlugin = path.join(this.app.path.config, 'plugin.default.js');
    const pluginFile = path.join(this.app.path.config, 'plugin.js');
    const envPlugin = path.join(this.app.path.config, `plugin.${this.app.env}.js`);
    
    if (fs.existsSync(defaultPlugin)) {
      const plugin = require(defaultPlugin);
      plugins = Object.assign({}, plugin);
    }

    if (fs.existsSync(pluginFile)) {
      const plugin = require(pluginFile);
      plugins = Object.assign(plugin, plugin);
    }

    if (fs.existsSync(envPlugin)) {
      const plugin = require(envPlugin);
      plugins = Object.assign(plugin, plugin);
    }

    const keys = Object.keys(plugins);
    if (keys.length <= 0) {
      return;
    }

    keys.forEach(key => {
      const plugin = plugins[key];
      if (!plugin.enable) {
        return false;
      }

      const file = path.join(this.app.path.plugin, `${key}.js`);
      if (!fs.existsSync(file)) {
        return;
      }

      if (plugin.env && !plugin.env.includes(this.app.env)) {
        return false;
      }

      if (plugin.package) {
        require(file)(this.app, key, plugin.package);
      } else {
        require(file)(this.app, key);
      }
    })
  }
}

module.exports = app => {
  const appHandler = new InitApp(app)
  appHandler.initPath();
  appHandler.initConfig();
  appHandler.initBaseLib();
  appHandler.errorHandler();
  appHandler.initMiddleware()

  try {
    appHandler.initRouter()
    appHandler.loadPlugin()
  } catch(e) {
    console.error(e.message)
  }
}