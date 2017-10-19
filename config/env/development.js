'use strict'

const redis = {
  host: '127.0.0.1',
  port: 6379,
  password: ''
}

const mysql = {
  host: '127.0.0.1',
  port: '3306',
  username: '',
  password: ''
}

const config = {
  db: {
    dialect: '', // 开启则需要配置 mysql
    mysql: {
      host: mysql.host,
      port: mysql.port,
      database: '', // 数据库名
      username: mysql.username,
      password: mysql.password,
      sql_mode: ['NO_ENGINE_SUBSTITUTION']
    }
  },
  cache: {
    default: '', // 开启则需要配置 redis
    redis: {
      port: redis.port,
      host: redis.host,
      password: redis.password,
      db: 0
    },
    memcache: {}
  },
  jwt: {
    secret: ''
  },
  queue: {
    prefix: 'koavel:',
    redis: {
      port: redis.port,
      host: redis.host,
      password: redis.password,
      db: 2,
      options: {}
    }
  },
  mail: {
    host: '',
    port: 25,
    secure: false,
    user: '',
    pass: '',
    from: '"',
    err_title: 'Koaval报警', // 错误告警邮件title
    err_noticer: [], // 错误告警通知接收者
  }
}

module.exports = config