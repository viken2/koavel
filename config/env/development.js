'use strict'

const config = {
  db: {
    dialect: 'mysql',
    mysql: {
      host: '127.0.0.1',
      port: '3306',
      database: 'koavel',
      username: 'proxy',
      password: 'proxy'
    }
  },
  cache: {
    default: 'redis',
    redis: {
      port: 6381,
      host: '127.0.0.1',
      password: ''
    },
    memcache: {}
  },
  jwt: {
    secret: ''
  },
  queue: {
    prefix: 'koavel:',
    redis: {
      // port: this.cache.redis.port,
      // host: this.cache.redis.host,
      // auth: this.cache.redis.password,
      port: 6381,
      host: '127.0.0.1',
      password: '',
      db: 2,
      options: {}
    }
  },
  mail: {
    host: 'mail.xunlei.com',
    port: 25,
    secure: false,
    user: 'xl_ad_admin@xunlei.com',
    pass: 'efFR8275CXck',
    from: '"迅雷广告" <xl_ad_admin@xunlei.com>',
    err_title: 'Koaval报警', // 错误告警邮件title
    err_noticer: ['longshuiyu@xunlei.com'], // 错误告警通知接收者
  }
}

module.exports = config