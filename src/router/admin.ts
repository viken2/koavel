module.exports = {
  group: 'admin',
  // middleware: ['oidcAuth'],
  router: {
    'get /admin/user/list': 'User@list',
  },
};
