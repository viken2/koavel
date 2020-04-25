import winston = require('winston');
import config from '../../config/config';
// import path = require('path');

/*
info warn error

app.logger.error('xxxxxxxx', {label: 'xxx'})
app.logger.log({
  label: 'xxx',
  level: 'error',
  message: 'xxxxxxxx'
});

logger.info("127.0.0.1 - there's no place like home");
logger.warn("127.0.0.1 - there's no place like home");
logger.error("127.0.0.1 - there's no place like home");
*/

const logger: winston.Logger = winston.createLogger({
  level: config.log.level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: new Date().toLocaleString('ca', {year: 'numeric', month: '2-digit', 'day': '2-digit', hour: 'numeric', minute: '2-digit', second: '2-digit', 'hour12': false, timeZone: 'Asia/Shanghai'}),
    }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-partner' },
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

// logger.add(new winston.transports.File({
//   filename: path.join(config.log.path, 'error.log'),
//   level: 'error', // 日志记录只需要记录error级别
// }));

// logger.add(new winston.transports.File({
//   filename: path.join(config.log.path, 'app.log'),
// });

export default logger;
