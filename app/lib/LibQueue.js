'use strict'

const config = process.appConfig
const Kue = require('kue')
const queue = Kue.createQueue()
queue.setMaxListeners(100)

const LibQueue = {
  queue: queue,
  /**
   * 加入队列
   * 
   * @param {any} name
   * @param {any} data
   * @returns
   */
  addQueue(name, data) {
    return this.queue.create('name', data).attempts(3).backoff({ delay: 60 * 1000, type: 'fixed' }).save()
  },
  /**
   * log队列回调函数
   * 
   * @param {any} job
   * @param {any} call
   * @returns
   */
  callLog(job, call) {
    this.jobCall(job)
    return call()
  },
  /**
   * mail队列回调函数
   * 
   * @param {any} job
   * @param {any} call
   * @returns
   */
  callEmail(job, call) {
    const mail = require('./LibMail')
    mail.sendMail(job.data.to, job.data.subject, job.data.content, true)
    this.jobCall(job)
    return call()
  },
  jobCall() {
    console.log(`queue=${job.type},Job=${job.id} done`)
  }
}

module.exports = LibQueue