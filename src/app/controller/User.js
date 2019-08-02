'use strict'

module.exports = app => {

  const path = require('path')
  const bcrypt = require('bcrypt')
  const Sequelize = require("sequelize")
  const BaseController = require(path.join(app.config.path.core, 'BaseController'))

  class User extends BaseController {
    async info(ctx) {
      const id = ctx.login.id
      const user = await ctx.model.User.findOne({
        where: {
          id
        },
        attributes: ['id', 'name', 'email', 'status']
      })
  
      const roles = ['editor']
      if (user.email === '**@**.com') {
        roles.push('admin')
      }
  
      ctx.json(20000, '', {
        id: user.id,
        roles,
        first: user.status === ctx.model.User.STATUS_PEND,
        introduction: user.description,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: user.name
      })
    }

    async login(ctx) {
      const post = ctx.request.body
      const email = post.username || ''
      const password = post.password || ''
  
      const user = await ctx.model.User.findOne({
        where: {
          email,
          status: {
            [Sequelize.Op.ne]: ctx.model.User.STATUS_OFF
          }
        },
        attributes: ['id', 'email', 'password', 'status']
      })
  
      if (!user) {
        ctx.error('用户不存在')
        return
      }
  
      if (user.status === ctx.model.User.STATUS_OFF) {
        ctx.error('用户被禁止登录')
        return
      }
  
      if (!bcrypt.compareSync(password, user.password)) {
        ctx.error('密码错误')
        return
      }
  
      const ret = {
        id: user.id
      }
  
      ret.token = LibJwt.token(ret)
      ctx.json(20000, '', ret)
    }

    async passwd(ctx) {
      const post = ctx.request.body
      const password = post.password || ''
      if (!password || password.length < 6) {
        ctx.error('密码不符合要求')
        return
      }
  
      const saltRounds = 10
      const salt = bcrypt.genSaltSync(saltRounds)
      const hash = bcrypt.hashSync(password, salt)
  
      const ret = await ctx.model.User.update({
        status: ctx.model.User.STATUS_ACTIVE,
        password: hash
      }, {
        where: {
          id: ctx.login.id,
          status: ctx.model.User.STATUS_PEND
        }
      })
  
      if (ret[0]) {
        ctx.json(20000, '', ret[0])
        return
      }
  
      ctx.error('密码修改失败，请稍后再试')
    }

    async meta() {
      // this.ctx.json(20000, '', {
      //   statusMap: this.ctx.model.User.statusMap
      // })
      this.ctx.body = {aaa: 1111}
    }

    async list(ctx) {
      const name = ctx.query.name || ''
      const email = ctx.query.email || ''
      const phone = ctx.query.phone || ''
      const status = ctx.query.status >> 0
      const date = ctx.query['date[]'] || []
  
      let page = ctx.query.page >> 0
      let limit = ctx.query.limit >> 0
      page = page <= 0 ? 1 : page
      limit = limit <= 0 ? 20 : limit
      limit = limit > process.configApp.app.pageLimit ? process.configApp.app.pageLimit : limit
  
      const where = {}
      if (name) {
        where['name'] = {
          [Sequelize.Op.like]: `%${name}%`
        }
      }
  
      if (email) {
        where['email'] = email
      }
  
      if (phone) {
        where['phone'] = phone
      }
  
      if (status) {
        where['status'] = status
      }
  
      where['status'] = {
        [Sequelize.Op.ne]: ctx.model.User.STATUS_OFF
      }
  
      if (date.length > 0) {
        where['created_at'] = {
          [Sequelize.Op.between]: [date[0], date[1] + ' 23:59:59']
        }
      }
  
      const ret = await ctx.model.User.findAndCountAll({
        attributes: ['id', 'name', 'email', 'phone', 'description', 'status'],
        order: [
          ['id', 'DESC'],
        ],
        where,
        offset: (page - 1) * limit,
        limit: limit
      })
  
      ctx.page(ret.count, page, ret.rows, limit)
    }
  
    async add(ctx) {
      const post = ctx.request.body
      const name = post.name || ''
      const email = post.email || ''
      const phone = post.phone || ''
      const description = post.description || ''
  
      const user = await ctx.model.User.findOne({
        where: {
          email,
          status: {
            [Sequelize.Op.ne]: ctx.model.User.STATUS_OFF
          }
        },
        attributes: ['id']
      })
  
      if (user) {
        ctx.error('该邮箱已经存在')
        return
      }
  
      const saltRounds = 10
      const salt = bcrypt.genSaltSync(saltRounds)
      const hash = bcrypt.hashSync('123456', salt)
  
      const ret = await ctx.model.User.create({
        name,
        email,
        password: hash,
        phone,
        true_name: '',
        description,
        login_ip: ctx.ip,
        status: ctx.model.User.STATUS_PEND
      })
  
      ctx.json(20000, '', {
        id: ret.id,
        name: ret.name,
        email: ret.email,
        phone: ret.phone,
        description: ret.description,
        status: ret.status
      })
    }

    async del(ctx) {
      const id = ctx.params.id >> 0
      // const ret = await ctx.model.User.destroy({
      //   where: {
      //     id
      //   }
      // })
      const ret = await ctx.model.User.update({
        status: ctx.model.User.STATUS_OFF
      }, {
        where: {
          id,
          email: {
            [Sequelize.Op.ne]: 'admin@xunlei.com'
          },
          status: {
            [Sequelize.Op.ne]: ctx.model.User.STATUS_OFF
          }
        }
      })
  
      if (ret[0]) {
        ctx.json(20000, '', ret[0])
        return
      }
  
      ctx.error('删除失败，请稍后再试')
    }

    async update(ctx, next) {
      const id = ctx.params.id >> 0
      const post = ctx.request.body
      const name = post.name || ''
      // const email = post.email || ''
      const phone = post.phone || ''
      const description = post.description || ''
  
      const ret = await ctx.model.User.update({
        name,
        phone,
        description
      }, {
        where: {
          id
        }
      })
  
      ctx.json(20000, '', ret)
    }
  }

  return User;
}
