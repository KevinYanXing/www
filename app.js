App({
  onShow: function() {
    wx.login({
      success: function(res){
        console.debug(res.code)
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxe9a59ba511ea5d41&secret=7ebec7c75f4b788209bf80ce60a45881&js_code='+ res.code+'&grant_type=authorization_code',
          data: {},
          method: 'GET', 
          success: function(res){
            console.debug(res)
          },
          fail: function() {
            wx.showToast({
              title: '请求失败',
              image:'../../image/cw-ico.png',
              duration: 2000
          })
          }
        })
      },
      fail: function() {
        wx.showToast({
              title: '登录失败',
              image:'../../image/cw-ico.png',
              duration: 2000
          })
      }
    })
  },
  onHide: function() {
  },
  globalData: {
    url:'http://192.168.0.115:5000'
  }
})

