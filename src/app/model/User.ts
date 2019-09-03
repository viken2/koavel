import { Model, DataTypes } from 'sequelize';
import { Mysql } from '../plugin/mysql';

class UserModel extends Model {
  public static statusPending = 1;
  public static statusOn = 2;
  public static statusOff = 3;

  public static statusMap = {
    [UserModel.statusPending]: '待审核',
    [UserModel.statusPending]: '正常',
    [UserModel.statusPending]: '禁用',
  };

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

const LEN = 128;

UserModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(LEN),
    allowNull: false,
  },
  email: {
    type: new DataTypes.STRING(LEN),
    allowNull: false,
  },
  password: {
    type: new DataTypes.STRING(LEN),
    allowNull: false,
  },
  phone: {
    type: new DataTypes.STRING(LEN),
    allowNull: false,
  },
  true_name: {
    type: new DataTypes.STRING(LEN),
    allowNull: false,
  },
  description: {
    type: new DataTypes.STRING(LEN),
    allowNull: false,
  },
  login_ip: {
    type: new DataTypes.STRING(LEN),
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [Object.keys(UserModel.statusMap)],
    },
  },
}, {
  tableName: 'users',
  sequelize: Mysql,
});

export default UserModel;
