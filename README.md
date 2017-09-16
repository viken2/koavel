# Koavel
基于koa2，打造一个可以快速二次开发的node框架 

## 启动方式

* 开发环境
```shell
$ npm run dev
```

* 测试环境
```shell
$ npm run test
```

* 生产环境
> 单台机器
```shell
$ pm2 start server.json
```

> 多台机器（队列在其中一台机器启动）
```shell
$ pm2 start server.json --only koavel-app [所有机器启动]
$ pm2 start server.json --only koavel-queue [只在一台机器启动]
```
