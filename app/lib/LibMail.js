'use strict'

const config = process.appConfig
const nodemailer = require('nodemailer')
const queue = require('./LibQueue')

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port || 25,
  secure: config.mail.secure || false,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  }
})

const envMap = {
  development: '开发环境',
  testing: '测试环境',
  production: '生产环境'
}

const mail = {
  /**
   * 邮件发送
   * @param {string|array} to
   * @param {string} subject
   * @param {string} content
   * @param {boolean} [sync=false] 是否同步，默认false-表示异步
   * @returns
   */
  sendMail (to, subject, content, sync = false) {
    if (typeof to === 'object') {
      to = Array.from(to).join(', ')
    }

    if (sync) { // 同步
      subject = config.env === 'production' ? subject : (subject + '【' + envMap[config.env] + '】')
      return transporter.sendMail({
        from: config.mail.from,
        to: to,
        subject: subject,
        html: content
      })
    } else { // 异步
      return queue.addQueue('mail', {
        to: to,
        subject: subject,
        content: content
      })
    }
  },
  /**
   * 通知告警
   * 
   * @param {string} level 级别
   * @param {string} title 标题
   * @param {string} message 描述
   * @param {boolean} [sync=false] 是否同步，默认false-表示异步
   * @returns
   */
  errorNotify (level, title, message, sync = false) {
    let color = 'red'
    switch (level) {
      case 'warning':
        color = 'orange'
        break
      case 'notice':
        color = 'yellow'
        break
      case 'info':
        color = 'blue'
        break
      case 'debug':
        color = 'green'
        break
    }

    const content = typeof message === 'object' ? JSON.stringify(message) : message
    const html = '<style type="text/css">' +
        '    body {' +
        '        font-size: 14px;' +
        '    }' +
        '    .title {' +
        '        padding: 5px 0 5px 10px;' +
        '        color: white;' +
        '        font-weight: bold;' +
        '    }' +
        '    .red {' +
        '        background-color: red;' +
        '    }' +
        '    .orange {' +
        '        background-color: orange;' +
        '    }' +
        '    .yellow {' +
        '        background-color: yellow;' +
        '    }' +
        '    .blue {' +
        '        background-color: blue;' +
        '    }' +
        '    .green {' +
        '        background-color: green;' +
        '    }' +
        '    p {' +
        '        padding: 5px 0 5px 10px;' +
        '        margin: 10px 0 10px 0;' +
        '    }' +
        '    p span {' +
        '        width: 100px;' +
        '        text-align: right;' +
        '        font-size: 18px;' +
        '    }' +
        '</style>' +
        '<p class="title '+ color +'"><span>错误级别：</span>'+ level +'</p>' +
        '<p><span>运行环境：</span>'+ envMap[config.env] +'</p>' +
        '<p><span>报错时间：</span>'+ moment().format('yyyy-mm-dd H:i:s'); +'</p>' +
        '<p><span>报错描述：</span>'+ title +'</p>' +
        '<p><span>详细内容：</span></p>' +
        '<p>'+ content +'</p>'

    return this.sendMail(config.mail.err_noticer, config.mail.err_title, html, sync)
  }
}

module.exports = mail