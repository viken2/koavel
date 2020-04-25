import BaseController from '../../core/BaseController';

class TestApi extends BaseController {
  public async list() {
    this.success([{id: 1}, {id: 2}]);
  }

  public async save() {
    this.success('save');
  }
}

module.exports = TestApi;
