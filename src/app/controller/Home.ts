import BaseController from '../core/BaseController';

class HomeController extends BaseController {
  public async index() {
    this.ctx.body = 'Hi Koa';
  }
}

module.exports = HomeController;
