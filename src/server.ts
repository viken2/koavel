import * as Koa from 'koa';
import initSever from './app/core/Base';
import logger from './app/lib/LibLog';

const app = new Koa();
initSever(app);

app.on('error', (err: Error) => {
  // err.stack
  logger.error(JSON.stringify(err.stack), {label: 'server'});
});

process.on('warning', (warning: Error) => {
  // warning.stack
  logger.warn(warning.message, {label: 'warning'});
});

process.on('uncaughtException', (err: Error) => {
  logger.warn(err.message, {label: 'uncaughtException'});
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  logger.warn(JSON.stringify(reason), {label: 'unhandledRejection'});
});

process.on('rejectionHandled', (p) => {
  logger.warn(JSON.stringify(p), {label: 'rejectionHandled'});
});

process.on('SIGINT', () => {
  logger.info('SIGINT', {label: 'SIGINT'});
  process.exit(1);
});

export default app;
