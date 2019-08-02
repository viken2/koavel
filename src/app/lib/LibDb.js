'use strict'

const Sequelize = require("sequelize")
const fs = require('fs')
const path = require('path')

const config = process.configApp

if (!config.db.dialect) {
  module.exports = null
  return;
}

const modelPath = config.app.path.model
const dbConfig = config.db[config.db.dialect]

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  host: dbConfig.host,
  dialect: config.db.dialect,
  port: dbConfig.port,
  pool: {
    max: 100,
    min: 1,
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

sequelize.addHook('afterConnect', (connection, config) => {
  connection.query('set SESSION sql_mode="' + dbConfig.sql_mode.join(',') + '"', (error, results) => {})
})

fs.readdir(modelPath, (err, files) => {
  for (let file of files) {
    if (file === '.gitignore') {
      continue
    }
    const modelFile = path.join(modelPath, file)
    sequelize.import(modelFile)
  }
})

module.exports = sequelize
