'use strict';

module.exports = {
  // had enabled by egg
  static: {
    enable: true,
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  mysql: {
    enable: true,
    package: 'sequelize',
  },
};
