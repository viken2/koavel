import { ERR_MSG } from '../../config/code';
import BaseError from '../core/BaseError';
import { Context } from 'koa';
import config from '../../config/config';

export const throwError = (code: number, message: string = ''): BaseError => {
  const msg = message ? message : ERR_MSG[code];
  const error: BaseError = new BaseError();
  error.code = code;
  error.message = msg;
  throw error;
};

export const getToken = (ctx: Context): string => {
  if ((!ctx.header || !ctx.header.authorization) && !ctx.query.token) {
    return '';
  }

  let token = '';
  if (ctx.header.authorization) {
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
    }
  } else {
    token = ctx.query.token || '';
  }

  return token;
};

export const getDate = (type: string = 'datetime') => {
  const dt = new Date();
  let y: any = dt.getFullYear();
  let m: any = dt.getMonth() + 1;
  let d: any = dt.getDate();
  m = m < 10 ? ('0' + m) : m;
  d = d < 10 ? ('0' + d) : d;

  if (type === 'date') {
    return `${y}-${m}-${d}`;
  }

  let ho: any = dt.getHours();
  let i: any = dt.getMinutes();
  let s: any = dt.getSeconds();
  ho = ho < 10 ? ('0' + ho) : ho;
  i = i < 10 ? ('0' + i) : i;
  s = s < 10 ? ('0' + s) : s;
  return `${y}-${m}-${d} ${ho}:${i}:${s}`;
};

export const unique = (data: any) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return Array.from(new Set(data));
};

export const formatInt = <T>(data: Array<T>): Array<T> => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.filter((item: any) => (item >> 0) > 0);
};

export const queryPageAndSize = (ctx: Context) => {
  let page = ctx.query.page >> 0;
  let size = ctx.query.size >> 0;
  page = Math.max(1, page);
  // size = Math.min(size, PAGE_MAX);
  // size = size <= 0 ? PAGE_SIZE : size;
  return {page, size};
};

export const arrayColumn = (data: any, column: any) => {
  if (!Array.isArray(data)) {
    return [];
  }

  let keys: any = [];
  if (typeof column === 'string') {
    keys.push(column);
  } else {
    keys = [...column];
  }

  return data.map((item: any) => {
    const t: any = [];
    keys.forEach((k: any) => {
      t.push(item[k]);
    });

    return t;
  });
};

export const ObjectValues = (data: any) => {
  return Object.keys(data).map((key: any) => data[key]);
};

export const checkDate = (date: string) => {
  if (! /^\d{4,4}-\d{1,2}-\d{1,2}$/.test(date)) {
    return false;
  }

  if (isNaN(new Date(date).getDate())) {
    return false;
  }

  return true;
};

export const dingAlert = async(content: string, level: string = 'error') => {
  if (config.env !== 'production') {
    return;
  }

  console.log(content);
};
