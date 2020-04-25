import { Context } from 'koa';
import logger from '../lib/LibLog';
import { ERR_MSG, HTTP_OK, OK, INVALID_ARGUMENT } from '../../config/code';
import schema from 'async-validator';
import xlsx from 'node-xlsx';
import { arrayColumn, ObjectValues } from '../lib/Helpers';

class BaseController {
  public ctx: any;

  public constructor(ctx: Context) {
    this.ctx = ctx;
    this.ctx.logger = logger;
  }

  public success(data: any) {
    this.ctx.status = HTTP_OK;
    this.ctx.type = 'application/json; charset=utf-8';
    this.ctx.body = {
      code: OK,
      data,
    };
  }

  public error(code: number, msg: string = '') {
    this.ctx.status = HTTP_OK;
    this.ctx.type = 'application/json; charset=utf-8';
    this.ctx.body = {
      code,
      error: msg ? msg : ERR_MSG[code],
    };
  }

  public page(total: number, data: any, page: number, extra: any = {}) {
    this.success({
      total,
      list: data,
      page,
      extra,
    });
  }

  public down(title: any, data: any) {
    const downdata = arrayColumn(data, Object.keys(title));
    downdata.unshift(ObjectValues(title));

    const buffer = xlsx.build([{ name: '数据', data: downdata }]);
    this.ctx.status = HTTP_OK;
    this.ctx.body = buffer;
    this.ctx.set('content-type', 'application/octet-stream');
    this.ctx.attachment(`数据导出-${new Date().getTime()}.xlsx`);
  }

  public async validate(data: any, descriptor: any) {
    const validator = new schema(descriptor);
    return new Promise((resolve, reject) => {
      validator.validate(data).then(() => {
        resolve(true);
      }).catch(({ errors }) => {
        resolve(errors);
      });
    });
  }

  public async validateInsert(data: any, descriptor: any) {
    const insert: any = {};
    for (const key in descriptor) {
      if (descriptor.hasOwnProperty(key)) {
        insert[key] = data.hasOwnProperty(key) ? data[key] : null;
      }
    }

    const valid: any = await this.validate(insert, descriptor);
    if (valid !== true) {
      // this.error(INVALID_ARGUMENT, JSON.stringify(valid));
      this.error(INVALID_ARGUMENT, valid[0].message);
      return false;
    }

    return insert;
  }

  public async validateUpdate(data: any, descriptor: any) {
    const update: any = {};
    for (const key in descriptor) {
      if (descriptor.hasOwnProperty(key)) {
        if (data.hasOwnProperty(key)) {
          update[key] = data[key];
        }
      }
    }

    if (Object.keys(update).length === 0) {
      this.error(INVALID_ARGUMENT);
      return false;
    }

    const valid: any = await this.validate(update, descriptor);
    if (valid !== true) {
      this.error(INVALID_ARGUMENT, JSON.stringify(valid));
      // this.error(INVALID_ARGUMENT, valid[0].message);
      return false;
    }

    return update;
  }
}

export default BaseController;
