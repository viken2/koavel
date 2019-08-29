import BaseController from "../core/BaseController";
import * as UserModel from '../model/User';

class User extends BaseController {
  async info() {
    const user = await UserModel.User.findOne({
      where: {
        email: 'admin@xunlei.com',
      },
      attributes: ['id', 'email', 'password', 'status']
    });
    this.ctx.body = user;
  }

  async add() {
    const user = await UserModel.User.create({
      name: '测试用户',
      email: 'test@test.com',
      password: '123456',
      phone: '123',
      true_name: 'haha',
      description: '',
      login_ip: '11',
      status: UserModel.STATUS_ON,
    });
    this.ctx.logger.info(user.id)
    // this.ctx.body = user;
    this.throw('fuckyou', 502);
  }
}

module.exports = User;