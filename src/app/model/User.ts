import { Model, DataTypes } from 'sequelize';
import { Mysql } from '../plugin/mysql';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public true_name!: string;
  public description!: string;
  public login_ip!: string;
  public status!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export const STATUS_PENDING = 1;
export const STATUS_ON = 2;
export const STATUS_OFF = 3;
export const statusMap = {
  [STATUS_PENDING]: '待审核',
  [STATUS_ON]: '正常',
  [STATUS_OFF]: '禁用',
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  email: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  password: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  phone: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  true_name: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  description: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  login_ip: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [Object.keys(statusMap)],
    }
  }
}, {
  tableName: 'users',
  sequelize: Mysql,
});

export {
  User
}
