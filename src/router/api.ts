module.exports = {
  group: '/api',
  middleware: [], // jwtAuth apiAuth
  router: {
    'post /api/test/save': 'TestApi@save',
    'get /api/test/list': 'TestApi@list',
  },
};
