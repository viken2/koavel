'use strict'

const jwt = require('jsonwebtoken')

class LibJwt {
  constructor(app) {
    this.app = app;
  }

  token(data) {
    return jwt.sign({
      data
    }, this.app.config.jwt.secret, { 
      algorithm: 'HS256', // RS256
      expiresIn: 2 * 60 * 60 // 2h
    })
  }

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.configApp.jwt.secret, (err, decoded) => {
        if (err) {
          reject(err)
          return;
        }
        resolve(decoded)
      })
    })
  }
}

module.exports = LibJwt;