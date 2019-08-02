'use strict';

const path = require('path');

module.exports = app => {
  const config = {};

  config.log = {
    level: 'debug',
    path: path.join(app.root, 'log'),
  };

  return config;
}