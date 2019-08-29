import * as app from './app';
import * as api from './api';

const map = new Map();
map.set(app.prefix, app.router);
map.set(api.prefix, api.router);

export {
  map
}