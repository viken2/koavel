import BaseController from '../../core/BaseController';
import { getUserList } from '../../repository/User';
import { PAGE_LIMIT } from '../../../config/app';

class UserController extends BaseController {
  public async list() {
    const query = this.ctx.query;
    let page = query.page >> 0;
    let size = query.size >> 0;
    page = page <= 1 ? 1 : page;
    size = (size <= 0 || size > PAGE_LIMIT) ? PAGE_LIMIT : size;
    const res = await getUserList({}, page, size);
    this.page(res.count, res.rows, page);
  }
}

module.exports = UserController;
