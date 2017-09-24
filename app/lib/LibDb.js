'use strict'

const Sequelize = require("sequelize")
const fs = require('fs')
const path = require('path')
const config = process.appConfig

let sequelize = null
if (config.db.dialect !== '') {
  const modelPath = config.path.model.common
  const dbConfig = config.db[config.db.dialect]
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    logging: config.env !== 'production' ? console.log : false,
    host: dbConfig.host,
    dialect: config.db.dialect,
    port: dbConfig.port,
    pool: {
      max: 100,
      min: 0,
      idle: 10000
    },
    timezone: '+08:00',
    define: {
      timestamps: true, // true表示开启更新 created_at 和 updated_at
      freezeTableName: false, // false表示model name将会变为复数
      underscored: true, // true表示Converts all camelCased columns to underscored
      underscoredAll: true, // true表示Converts camelCased model names to underscored table
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      charset: 'UTF-8',
    }
  })
  
  fs.readdir(modelPath, (err, files) => {
    for (let file of files) {
      const modelFile = path.join(modelPath, file)
      sequelize.import(modelFile)
    }
  })
}

module.exports = sequelize