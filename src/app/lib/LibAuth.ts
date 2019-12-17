import bcrypt = require('bcryptjs');

export const hash = (str: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(str, salt);
};

export const hasCheck = (str: string, hash: string) => {
  return bcrypt.compareSync(str, hash);
};
