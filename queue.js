'use strict'

const config = require('./config')
const path = require('path')

// 公共配置文件写入 process
process.appConfig = config

const libQueue = require(path.join(config.path.lib, 'LibQueue'))
const queue = libQueue.queue

console.log(`开始队列 pid=${process.pid} env=${process.env.NODE_ENV}`)

// 加入队列
queue.on('job enqueue', function (id, type) {
  console.log('Job %s got queued of type %s', id, type)
})

// 队列完成
queue.on('job complete', function (id, result) {
  Kue.Job.get(id, function (err, job) {
    if (err) return
    job.remove(function (err) {
      if (err) throw err
      console.log('removed completed job #%d', job.id)
    })
  })
})

// 队列失败
queue.on('job failed', function (id) {
  Kue.Job.get(id, function (err, job) {
    if (err) return
    console.log('队列执行失败: id=%s,type=%s', job.id, job.type, job.data)
  })
})

// 队列报错
queue.on('error', function (err) {
  console.log('队列出错: ', err)
})

// 进程被kill,关闭队列
process.once('SIGTERM', function (sig) {
  queue.shutdown(5000, function (err) {
    console.log('Kue shutdown: ', err || '')
    process.exit(0)
  })
})

// 进程异常,关闭队列
process.once('uncaughtException', function (err) {
  queue.shutdown(1000, function (err) {
    console.log('Kue shutdown result: ', err || 'OK')
    process.exit(0)
  })
})

queue.process('log', 10, libQueue.callLog)
queue.process('mail', 10, libQueue.callEmail)