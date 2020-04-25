import BaseController from '../../core/BaseController';
import UserModel from '../../model/User';
import bcrypt = require('bcryptjs');
import * as UserRepository from '../../repository/User';
import { INVALID_ARGUMENT } from '../../../config/code';

class UserController extends BaseController {
  public async info() {
    const id = this.ctx.query.id >> 0;
    if (id <= 0) {
      this.error(INVALID_ARGUMENT);
      return;
    }
    const info = await UserRepository.info(id);
    this.success(info);
  }

  public async add() {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync('123456', salt);

    const N = 1000000;
    const user = await UserModel.create({
      name: '测试用户' + Math.ceil(Math.random() * N),
      email: 'test@test.com',
      password: hash,
      status: UserModel.statusPending,
    });
    this.ctx.logger.info(user.id);
    this.success(user);
  }
}

module.exports = UserController;
