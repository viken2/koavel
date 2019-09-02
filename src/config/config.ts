import path = require("path");
import fs = require("fs");

interface Config {
  key: string,
  port: number,
  env: string,
  root: string,
  log?: any,
  jwt?: any,
  mysql?: any,
  redis?: any
}

const root = path.resolve(path.dirname(__dirname));
const envFile = path.join(root, 'env.json');
if (!fs.existsSync(envFile)) {
  throw new Error('env json not found')
}
const env = require(envFile);

let config: Config = {
  key: env.env + '-' + '2d4ad894fe346a31a7c291d57f28b3a6',
  root,
  port: env.port,
  env: env.env,
};

config.log = {
  level: 'debug',
  path: path.join(root, 'log')
}

config.mysql = env.mysql;
config.redis = env.redis;

export default config;