import { Sequelize } from 'sequelize';
import config from '../../config/config';

const Mysql = new Sequelize(config.mysql.name, config.mysql.user, config.mysql.password, {
  logging: config.debug ? console.log : false,
  dialect: 'mysql',
  host: config.mysql.host,
  port: config.mysql.port,
  pool: {
    max: 100,
    min: 1,
    idle: 10000, // 闲置连接回收时间, 10s
  },
  timezone: '+08:00',
  define: {
    timestamps: true, // true表示开启更新 created_at 和 updated_at
    freezeTableName: false, // false表示model name将会变为复数
    underscored: true, // true表示Converts all camelCased columns to underscored
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'UTF-8',
  },
});

Mysql.addHook('afterConnect', (connection: any) => {
  connection.query('set SESSION sql_mode="' + config.mysql.sqlmode + '"');
});

export {
  Mysql
};
