'use strict';

module.exports = {
  prefix: '/',
  router: {
    'get /video/meta': 'Video@meta',
    'get /video/list': 'Video@list',
    'delete /video/del': 'Video@del',
    'put /video/put': 'Video@put',
    'get /video/crop': 'Video@crop',
    'post /video/qiniuCallback': 'Video@qiniuCallback',

    'get /user/meta': 'User@meta',
    'get /user/info': 'User@info',
    'post /user/login': 'User@login',
    'post /user/passwd': 'User@passwd',
    'get /user/list': 'User@list',
    'post /user/add': 'User@add',
    'put /user/:id': 'User@update',
    'delete /user/:id': 'User@del',
  }
}