'use strict'

const router = require('koa-router')()

const path = require('path')
const configApp = process.configApp.app
const routes = require(path.join(configApp.root, 'router'))

const controllerFactory = (routePath, routeVal) => {
  return (ctx, next) => {
    if (typeof routeVal === 'function') {
      return routeVal.call(null, ctx, next)
    }

    let controller = null
    let [controllerName, actionName] = routeVal.split('@')
    try {
      controller = require(path.join(configApp.path.controller, routePath, controllerName))
      if (typeof controller === 'function') {
        return controller(ctx, next)[actionName]()
      }

      if (typeof controller === 'object') {
        return controller[actionName](ctx, next)
      }
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
      return
    }
  }
}

for (let [routePath, routeVals] of routes) {
  for (let routeKey in routeVals) {
    let [method, urlPath] = routeKey.split(' ')
    const uri = routePath === '/' ? urlPath : (routePath + urlPath)
    router[method].call(router, uri, controllerFactory(routePath, routeVals[routeKey]))
  }
}

module.exports = () => {
  return router
}