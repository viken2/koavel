module.exports = {
  group: 'api',
  prefix: 'api',
  middleware: ['apiAuth'], // jwtAuth apiAuth
  router: {
    'post /test/save': 'TestApi@save',
    'get /test/list': 'TestApi@list',
  },
};
