import wx from 'weixin-js-sdk'
import {
  utils,
  apis,
  http
} from '@/libs/interfaces'
const weixin = {
  wxLoginUrl: '', // 授权登录url
  isWxWebView () {
    const arr = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
    if (arr && arr.length > 0 && arr[0] === 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  isXcxWebView () {
    return utils.util.getUrlPrem('browser') === 'xcx' || window.__wxjs_environment === 'miniprogram'
  },
  init (callback) {
    let req = {
      'action': 'js_signature',
      'url': window.location.href.replace(/#.*$/, '')
    }
    http.get(`${apis.initWx}?param=` + encodeURIComponent(JSON.stringify(req))).then(function (res) {
      try {
        wx.config({
          debug: false,
          appId: res.data.signature.appId,
          timestamp: parseInt(res.data.signature.timestamp),
          nonceStr: res.data.signature.nonceStr,
          signature: res.data.signature.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage', 'uploadImage', 'scanQRCode']
        })
        wx.ready(function () {
          console.log('微信js初始化成功')
          callback && callback(res)
        })
        wx.error(res => {
          alert('微信js初始化失败')
          alert(JSON.stringify(res))
        })
      } catch (g) {
        alert(g)
      }
    }).catch(function (error) {
      console.log(error)
    })
  },
  updateShare (conf) {
    let settings = 'onMenuShareTimeline onMenuShareAppMessage'
    settings.split(' ').forEach(e => {
      try {
        wx[e](conf)
      } catch (g) {
        alert(g)
      }
    })
  },
  shareTimeLine (config) {
    wx.onMenuShareTimeline({
      title: config.title, // 分享标题
      link: config.link || window.location.href, // 分享链接
      imgUrl: '', // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
  },
  shareAppMessage (config) {
    wx.onMenuShareAppMessage({
      title: config.title, // 分享标题
      desc: config.desc, // 分享描述
      link: config.link || window.location.href, // 分享链接
      imgUrl: '', // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
  },
  previewImage (current, urls) {
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  chooseImage (num, callback) {
    wx.chooseImage({
      count: num, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        callback && callback(res)
      }
    })
  },
  uploadedImgs: [],
  uploadSuccessed: true,
  uploadImages (localIds, callback) {
    if (!localIds.length) return
    let localId = localIds.pop()
    let _this = this
    if (!_this.callback) {
      _this.callback = callback
    }
    wx.uploadImage({
      localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success (res) {
        let serverId = res.serverId
        _this.uploadedImgs.push(serverId)
        if (res.errMsg !== 'uploadImage:ok') {
          _this.uploadSuccessed = false
        }
        if (localIds.length > 0) {
          _this.uploadImages(localIds)
        } else {
          if (!_this.uploadSuccessed) return
          try {
            _this.callback(_this.uploadedImgs)
          } catch (e) {
            alert(e)
          }
        }
      }
    })
  },
  uploadImgsFn (num, callback) {
    let _this = this
    // 选图
    _this.chooseImage(num, (chooseRes) => {
      if (chooseRes.errMsg === 'chooseImage:ok') {
        _this.uploadImages(
          chooseRes.localIds,
          (uploadImages) => {
            _this.imgServerDownload(uploadImages, (downloadRes) => {
              callback(downloadRes)
            })
          })
      }
    })
  },
  imgServerDownload (uploadImages, callback) {
    // 服务器端图片下载
  },
  scanQRCode (callback) {
    wx.scanQRCode({
      desc: 'scanQRCode desc',
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success (res) {
        let result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
        callback && callback(result)
        alert(res.resultStr)
      }
    })
  }
}

export default weixin
