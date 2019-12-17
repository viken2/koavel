import UserModel from '../model/User';
import { Redis } from '../plugin/redis';
import { PAGE_LIMIT } from '../../config/app';

const prefix_uid = 'u';

export const getUserById = async(id: any) => {
  const info = await Redis.hgetall(`${prefix_uid}:${id}`);
  if (info && info.hasOwnProperty('id')) {
    return info;
  }
  const user = await UserModel.findOne({
    attributes: ['id', 'name', 'email', 'phone', 'password', 'status'],
    where: {
      id,
    },
  });

  if (user) {
    const info = user.toJSON();
    await Redis.hmset(`${prefix_uid}:${id}`, info);
    return info;
  }

  return null;
};

export const getUserList = async(where: any = {}, page: number = 1, size: number = PAGE_LIMIT) => {
  return await UserModel.findAndCountAll({
    attributes: ['id', 'name', 'email', 'phone', 'status'],
    limit: size,
    offset: (page - 1) * size,
    order: [['id', 'DESC']],
    where: where || {},
  });
};
