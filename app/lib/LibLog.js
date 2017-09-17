'use strict'

const path = require('path')
const winston = require('winston')
const config = process.appConfig
const queue = require('./LibQueue')
const mail = require('./LibMail')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(
      {
        level: 'info'
      }
    ),
    new (winston.transports.File)({
      filename: path.join(config.path.log, 'koavel.log'),
      level: 'debug',
      json: false,
      timestamp: function() {
        return new Date().toLocaleString('ca', {year: 'numeric', month: '2-digit', 'day': '2-digit', hour: "numeric", minute: "2-digit", second: "2-digit", 'hour12': false, timeZone: 'Asia/Shanghai', pattern: "{year}-{month}-{day} {hour}:{minute}:{second}"})
      },
      formatter: function(options) {
        const name = options.meta.space || 'default'
        delete options.meta.space
        const level = options.level.toLowerCase()
        if (['warn', 'error'].includes(level)) {
          //mail.errorNotify(level, msg.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2'), meta)
          console.log('mail or weixin')
        }
        return ['[' + options.timestamp() + ']', '(' + level + ')', '[' + name + ']', options.message || '', options.meta && Object.keys(options.meta).length ? ("\n" + JSON.stringify(options.meta)) : '' ].join(' ');
      }
    })
  ]
})

module.exports = logger