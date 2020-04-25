import { Model, DataTypes } from 'sequelize';
import { Mysql } from '../plugin/mysql';

class UserModel extends Model {
  public static statusPrepare = 1;
  public static statusPending = 2;
  public static statusFail = 3;
  public static statusStop = 4;
  public static statusOn = 5;

  public static statusMap = {
    [UserModel.statusPrepare]: '待完善',
    [UserModel.statusPending]: '待审核',
    [UserModel.statusFail]: '审核不通过',
    [UserModel.statusStop]: '暂停',
    [UserModel.statusOn]: '正常',
  };

  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public status!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
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
