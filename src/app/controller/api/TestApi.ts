import ApiController from '../../core/ApiController';

class TestApi extends ApiController {
  public async list() {
    this.success([{id: 1}, {id: 2}]);
  }

  public async save() {
    this.success('save');
  }
}

module.exports = TestApi;
