const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  const STATUS_PEND = 1
  const STATUS_ACTIVE = 2
  const STATUS_OFF = 3

  const statusMap = {}
  statusMap[STATUS_PEND] = '待激活'
  statusMap[STATUS_ACTIVE] = '已激活'
  statusMap[STATUS_OFF] = '禁用'

  class User extends Sequelize.Model {}

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    true_name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    login_ip: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER,
      validate: {
        isIn: [Object.keys(statusMap)],
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
    tableName: 'users',
    scopes: {}
  })

  User.statusMap = statusMap
  User.STATUS_PEND = STATUS_PEND
  User.STATUS_ACTIVE = STATUS_ACTIVE
  User.STATUS_OFF = STATUS_OFF

  return User
}
