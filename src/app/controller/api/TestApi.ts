import ApiController from "../../core/ApiController";

class TestApi extends ApiController {
  async list() {
    this.success([{id: 1}, {id: 2}])
  }

  async save() {
    this.success('save');
  }
}

module.exports = TestApi;