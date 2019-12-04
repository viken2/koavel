import jwt = require('jsonwebtoken');
import config from '../../config/config';

const HOUR = 60;

export const jwtToken = (data: any) => {
  return jwt.sign({
    data,
  }, config.jwt.secret, {
    algorithm: 'HS256', // RS256
    expiresIn: 2 * HOUR * HOUR, // 2h
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
