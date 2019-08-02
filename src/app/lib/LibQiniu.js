const qiniu = require('qiniu')
const axios = require('axios')
const util = require('util')

class LibQiniu {
  constructor(app) {
    const qiniuConfig = app.config.qiniu
    const config = new qiniu.conf.Config();
    this.deadline = 600; // 10分钟
    this.qiniuConfig = qiniuConfig;
    this.mac = new qiniu.auth.digest.Mac(qiniuConfig.access_key, qiniuConfig.secret_key);
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, config);
    this.operatManager = new qiniu.fop.OperationManager(this.mac, config);
    this.app = app;
  }

  getToken() {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
    })
    return putPolicy.uploadToken(this.mac)
  }

  statVideo(gcid) {
    return new Promise((resolve, reject) => {
      return this.bucketManager.stat(this.qiniuConfig.video.bucket_name, gcid, function(err, respBody, respInfo) {
        if (err) {
          reject(err)
          return
        }

        if (respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          reject({
            statusCode: respInfo.statusCode,
            error: respBody.error
          })
        }
      })
    })
  }

  avinfo(gcid) {
    const deadline = parseInt(Date.now() / 1000) + this.deadline
    const url = this.bucketManager.privateDownloadUrl(this.qiniuConfig.video.private_bucket_domain + '/' + gcid + '?avinfo', gcid, deadline)
    return new Promise((resolve, reject) => {
      return axios({
        method: 'GET',
        url
      }).then(res => {
        resolve({
          duration: res.data.format.duration,
          width: res.data.streams[0].width,
          height: res.data.streams[0].height
        })
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        reject('error')
      })
    })
  }

  getVideoPrivateUrl(gcid) {
    const deadline = parseInt(Date.now() / 1000) + this.deadline
    return this.bucketManager.privateDownloadUrl(this.qiniuConfig.video.private_bucket_domain, gcid, deadline)
  }

  videoCrop(gcid, video) {
    const fops = []
    const vframeUrl = 'vframe/jpg/offset/%s/w/%s/h/%s|saveas/' + qiniu.util.urlsafeBase64Encode(this.qiniuConfig.image.bucket_name)
    const diff = parseFloat(video.duration / 7).toFixed(3)
    for (let i = 1; i < 7; i++) {
      fops.push(util.format(vframeUrl, i*diff, video.width, video.height))
    }

    const pipeline = 'ad-video-crop'
    const options = {
      notifyURL: this.qiniuConfig.crop_callback,
      force: false
    }

    return new Promise((resolve, reject) => {
      this.operatManager.pfop(this.qiniuConfig.video.bucket_name, gcid, fops, pipeline, options, (err, respBody, respInfo) => {
        if (err) {
          reject(err)
          return
        }
  
        if (respInfo.statusCode == 200) {
          return resolve(respBody)
        } else {
          return reject(respBody)
        }
      })
    })
  }

  prefop(id) {
    return new Promise((resolve, reject) => {
      return axios({
        method: 'GET',
        url: 'http://api.qiniu.com/status/get/prefop',
        params: {
          id
        }
      }).then(res => {
        if (res.data.code === 0) {
          const img = []
          res.data.items.forEach(item => {
            img.push(item.key)
          })
          resolve(img)
          return
        }

        // TODO log
        resolve([])
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        reject('error')
      })
    })
  }
}

module.exports = LibQiniu