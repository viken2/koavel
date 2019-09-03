import Redis = require('ioredis');

import config from '../../config/config';

const redis = new Redis(config.redis);
redis.select(0);

export {
  redis
};
