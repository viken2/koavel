import BaseController from "../core/BaseController";
import * as UserModel from "../model/User";
import bcrypt = require('bcrypt');

class User extends BaseController {
  public async info() {
    const user = await UserModel.User.findOne({
      where: {
        email: 'admin@testcom',
      },
      attributes: ['id', 'email', 'password', 'status']
    });
    this.success(user);
  }

  public async add() {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync('123456', salt)

    const user = await UserModel.User.create({
      name: '测试用户',
      email: 'test@test.com',
      password: hash,
      phone: '123',
      true_name: 'haha',
      description: '',
      login_ip: '11',
      status: UserModel.STATUS_ON,
    });
    this.ctx.logger.info(user.id)
    this.success(user);
  }
}

module.exports = User;