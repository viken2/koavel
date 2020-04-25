import jwt = require('jsonwebtoken');
import config from '../../config/config';

const EXPIRE_TIME = 7200; // 默认2小时

export const jwtToken = (data: any) => {
  return jwt.sign({
    data,
  }, config.jwt.secret, {
    algorithm: 'HS256', // RS256
    expiresIn: config.jwt.expire || EXPIRE_TIME, // 单位为秒
  });
};

export const jwtVerify = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err: Error, decoded: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
};

export const jwtRefresh = (token: string) => {
};
