import path = require('path');
import winston = require('winston');
import config from '../../config/config';

/*
app.logger.error('xxxxxxxx', {label: 'xxx'})
app.logger.log({
  label: 'xxx',
  level: 'error',
  message: 'xxxxxxxx'
});
*/

const logFormat = () => {
  return winston.format.printf(({ level, message, label, timestamp }) => {
    const logLabel = label || 'default';
    return `[${timestamp}] ${level} [${logLabel}]: ${message}`;
  });
};

const logger: winston.Logger = winston.createLogger({
  level: config.log.level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: new Date().toLocaleString('ca', {year: 'numeric', month: '2-digit', 'day': '2-digit', hour: 'numeric', minute: '2-digit', second: '2-digit', 'hour12': false, timeZone: 'Asia/Shanghai'}),
    }),
    logFormat()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(config.log.path, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(config.log.path, 'app.log'),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(config.log.path, 'exceptions.log'),
    }),
  ],
});

if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
