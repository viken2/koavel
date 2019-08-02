require('./config')

const debug = require('debug')('koavel:server')
const Koa = require('koa');
const app = new Koa();

app.root = __dirname;
const initApp = require('./app/core/InitApp');

debug('init framework')
initApp(app);

// const middlewares = require('./app/middleware')
// app.use(middlewares)
// init middleware

app.on('error', err => {
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
})

process.on('warning', warning => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
})

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err.stack}`);
  process.exit(1);
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection in process at: Promise ' + p, reason);
})

process.on('rejectionHandled', (p) => {
  console.log('RejectionHandled in process at Promise ' + p);
})

process.on('SIGINT', () => {
  console.log('SIGINT');
  process.exit(1);
})

module.exports = app