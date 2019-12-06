module.exports = {
  prefix: '/api',
  router: {
    'post /test/save': 'TestApi@save',
    'get /test/list': 'TestApi@list',
  },
};
