'use strict'

const Sequelize = require("sequelize")
const fs = require('fs')
const path = require('path')

class PluginMysql {
  constructor(app, plugin, package) {
    this.app = app;
    this.plugin = plugin;
    this.package = package;
  }

  initHandler() {
    const config = this.app.config[plugin] || {};
    const sequelize = new Sequelize(config.database, config.username, config.password, {
      logging: this.app.env !== 'production' ? console.log : false,
      host: config.host,
      dialect: config.dialect || 'mysql',
      port: config.port,
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
      if (config.sqlmode) {
        connection.query('set SESSION sql_mode="' + config.sqlmode.join(',') + '"', (error, results) => {
          this.app.logger.error(error.message, {label: 'mysql'});
          this.app.emit(error);
        })
      }
    })

    fs.readdir(this.app.path.model, (err, files) => {
      for (let file of files) {
        if (file === '.gitignore') {
          continue
        }
        const modelFile = path.join(this.app.path.model, file)
        sequelize.import(modelFile)
      }
    })

    this.app.model = sequelize.models;
    this.app.sequelize = sequelize;
  }
}

module.exports = PluginMysql;
