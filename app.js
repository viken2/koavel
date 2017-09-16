'use strict'

const config = require('./config')

// 公共配置文件写入 process
process.appConfig = config

const Koa = require('koa')
const app = new Koa()
const middlewares = require('./app/middleware')
app.use(middlewares)

app.on('error', err => {
  console.error(err.name)
  console.error(err.message)
  console.error(err.stack)
})

process.on('warning', warning => {
  console.warn(warning.name)
  console.warn(warning.message)
  console.warn(warning.stack)
})

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err.message}`)
  process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection in process at: Promise ' + p, reason)
})

process.on('rejectionHandled', (p) => {
  console.log('RejectionHandled in process at Promise ' + p)
})

process.on('SIGINT', function () {
  console.log('SIGINT')
  process.exit(1)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app start, port=${port}`)
})