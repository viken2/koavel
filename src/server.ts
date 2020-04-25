import * as Koa from 'koa';
import initSever from './app/core/Base';
import logger from './app/lib/LibLog';
import { dingAlert } from './app/lib/Helpers';

const app = new Koa();
initSever(app);

app.on('error', (err: Error) => {
  // err.stack
  dingAlert(`error: ${err.message}`);
  logger.error(JSON.stringify(err.stack), {label: 'server'});
});

process.on('warning', (warning: Error) => {
  // warning.stack
  dingAlert(`warning: ${warning.message}`);
  logger.warn(warning.message, {label: 'warning'});
});

process.on('uncaughtException', (err: Error) => {
  dingAlert(`uncaughtException: ${err.message}`);
  logger.warn(err.message, {label: 'uncaughtException'});
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  dingAlert(`unhandledRejection: ${JSON.stringify(reason)}`);
  logger.warn(JSON.stringify(reason), {label: 'unhandledRejection'});
});

process.on('rejectionHandled', (p) => {
  dingAlert(`rejectionHandled: ${JSON.stringify(p)}`);
  logger.warn(JSON.stringify(p), {label: 'rejectionHandled'});
});

process.on('SIGINT', () => {
  logger.info('SIGINT', {label: 'SIGINT'});
  process.exit(1);
});

export default app;
