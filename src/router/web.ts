module.exports = {
  group: 'web',
  prefix: 'web',
  middleware: [],
  router: {
    // 用户
    'get /user/info': 'User@info',
    'post /user/add': 'User@add',
  },
};
