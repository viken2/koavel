# Koavel
基于TypeScript，打造一个可以快速二次开发的node框架 

## 目录结构
```node
.
├── Dockerfile
├── LICENSE
├── README.md
├── docs
│   ├── db
│   ├── debug
│   └── env
├── package-lock.json
├── package.json
├── src
│   ├── app
│   ├── app.ts
│   ├── config
│   ├── logs
│   ├── router
│   └── server.ts
├── tsconfig.json
├── tslint.json
└── typedoc.json
```

## 启动方式

```
$ cp docs/env/env.example.json src/config/env.json
$ vi src/config/env.json 然后修改对应配置
$ npm run dev

```