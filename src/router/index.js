'use strict';

const app = require('./app');
const api = require('./api');

const map = new Map();
map.set(app.prefix, app.router);
map.set(api.prefix, api.router);

module.exports = map;