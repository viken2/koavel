import path = require('path');
import fs = require('fs');

const root = path.resolve(path.dirname(__dirname));
const envFile = path.join(root, 'config/configmap', 'env.json');
if (!fs.existsSync(envFile)) {
  throw new Error('env json not found');
}
const env = require(envFile);

const config: any = {
  key: env.env + '-' + env.key,
  debug: env.debug || false,
  root,
  port: env.server_port,
  env: env.env || process.env.NODE_ENV,
};

config.log = {
  level: 'debug',
  path: path.join(root, 'logs'),
};

config.mysql = {
  name: env.mysql.db,
  host: env.mysql.host,
  port: env.mysql.port,
  user: env.mysql.user,
  password: env.mysql.password,
  sqlmode: 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER',
};

config.redis = [
  {
    name: env.redis.name || 'default',
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password,
    family: 4,
    db: env.redis.db,
  },
];

config.jwt = env.jwt || {};
config.oidc = env.oidc || {};
config.etcd = env.etcd || {};

export default config;
