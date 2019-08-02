'use strict'

module.exports = {
  dialect: 'mysql', // 开启则需要配置 mysql
  mysql: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME, // 数据库名
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    sqlmode: ['NO_ENGINE_SUBSTITUTION']
  }
}