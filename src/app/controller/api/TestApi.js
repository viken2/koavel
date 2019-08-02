'use strict';

module.exports = app => {

  const path = require('path')

  const ApiController = require(path.join(app.config.path.core, 'ApiController'))

  class TestApi extends ApiController {
    async list() {
      this.success([{id: 1}, {id: 2}])
    }
  
    async save() {
      this.error(200, 'fuckyou')
    }
  }

  return TestApi;
}
