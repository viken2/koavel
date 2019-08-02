'use strict'

const path = require('path')
const winston = require('winston')

/*
app.logger.error('xxxxxxxx', {label: 'xxx'})
app.logger.log({
  label: 'xxx',
  level: 'error',
  message: 'xxxxxxxx'
});
*/

class LibLog {
  constructor(app) {
    this.app = app;
    this.config = this.app.config;
    this.logger = this.initLogger();
    this.initConsole();
  }

  logFormat() {
    return winston.format.printf(({ level, message, label, timestamp }) => {
      label = label || 'default'
      return `[${timestamp}] ${level} [${label}]: ${message}`;
    })
  }

  initLogger() {
    return winston.createLogger({
      level: this.config.log.level,
      format: winston.format.combine(
        winston.format.timestamp({
          format: new Date().toLocaleString('ca', {year: 'numeric', month: '2-digit', 'day': '2-digit', hour: "numeric", minute: "2-digit", second: "2-digit", 'hour12': false, timeZone: 'Asia/Shanghai', pattern: "{year}-{month}-{day} {hour}:{minute}:{second}"}),
        }),
        this.logFormat(),
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(this.config.log.path, 'error.log'),
          level: 'error'
        }),
        new winston.transports.File({
          filename: path.join(this.config.log.path, 'app.log'),
        })
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(this.config.log.path, 'exceptions.log'),
        })
      ]
    });
  }

  initConsole() {
    if (this.app.env === 'production') {
      return;
    }

    this.logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }
}

module.exports = LibLog;
