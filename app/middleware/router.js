'use strict'

const router = require('koa-router')()

const path = require('path')
const config = process.appConfig
const routes = require(path.join(config.root, 'routes'))

const controllerFactory = (routePath, routeVal) => {
  return (ctx, next) => {
    if (typeof routeVal === 'function') {
      return routeVal.call(null, ctx, next)
    }

    let controller = null
    let [controllerName, actionName] = routeVal.split('@')
    try {
      controller = require(path.join(config.path.controller, routePath, controllerName))
    } catch (e) {
      throw new Error(e.message)
    }

    if (typeof controller[actionName] !== 'function') {
      throw new Error('action not found')
    }

    return controller[actionName].call(null, ctx, next)
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