import IoRedis = require('ioredis');

import config from '../../config/config';

const defaultName = 'default';
const RedisPool: any = {};

config.redis.forEach((cnf: any) => {
  RedisPool[cnf.name] = new IoRedis(cnf);
});

const Redis = RedisPool[defaultName];

export {
  Redis,
  RedisPool
};
