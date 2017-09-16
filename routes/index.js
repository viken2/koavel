'use strict';

const app = require('./app')
const api = require('./api')

let map = new Map()
map.set(app.path, app.router)
map.set(api.path, api.router)

module.exports = map