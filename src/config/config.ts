import path = require("path");
import fs = require("fs");

interface Config {
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
  root,
  port: env.port,
  env: env.evn,
};

config.log = {
  level: 'debug',
  path: path.join(root, 'log')
}

config.mysql = env.mysql;
config.redis = env.redis;

export default config;