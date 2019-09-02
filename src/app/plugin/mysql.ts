import { Sequelize } from 'sequelize';
import config from '../../config/config';

// const sequelize = new Sequelize('mysql://root:asd123@localhost:3306/mydb');
const Mysql = new Sequelize(config.mysql.name, config.mysql.user, config.mysql.password, {
  logging: config.env !== 'production' ? console.log : false,
  dialect: 'mysql',
  host: config.mysql.host,
  port: config.mysql.port,
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'UTF-8',
  }
});

Mysql.addHook('afterConnect', (connection: any) => {
  connection.query('set SESSION sql_mode="' + config.mysql.sqlmode + '"');
});

export {
  Mysql
}