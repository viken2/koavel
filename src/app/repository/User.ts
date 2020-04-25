import UserModel from '../model/User';

export const create = async (insert: any) => {
  const set = await UserModel.create(insert);
  return set;
};

export const update = async (data: any, where: any) => {
  const up = await UserModel.update(data, {
    where,
  });
  return up;
};

export const info = async (id: number) => {
  const user: any = await UserModel.findOne({
    attributes: ['id', 'name'],
    where: {
      id,
    },
  });
  return user;
};

export const list = async (where: any, page: number, size: number) => {
  const res = await UserModel.findAndCountAll({
    attributes: ['id', 'name'],
    limit: size,
    offset: (page - 1) * size,
    order: [['id', 'DESC']],
    where,
  });
  return res;
};
