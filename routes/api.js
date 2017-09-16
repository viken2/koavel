'use strict';

module.exports = {
  'path': '/api',
  'router': {
    'get /get': 'RestApi@get',
    'post /post': 'RestApi@post',
    'put /put': 'RestApi@put',
    'patch /patch': 'RestApi@patch',
    'delete /delete': 'RestApi@del',
  }
}