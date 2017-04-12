App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //获取用户信息
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              // wx.request({
              //   url: 'https://URL',
              //   data: {},
              //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              //   // header: {}, // 设置请求的 header
              //   success: function(res){
              //     // success
              //   },
              //   fail: function() {
              //     // fail
              //   },
              //   complete: function() {
              //     // complete
              //   }
              // })
              that.globalData.userInfo = res.userInfo
              console.debug(res.signature)
              console.debug(res.encryptedData)
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    mProduct:{
      }
  }
})

