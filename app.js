App({
  onLaunch: function() {
    var url = 'http://192.168.0.115:5000'
    wx.login({
      success: function(res){
        wx.request({
          url: url+ '/wxlogin/?code=' + res.code,
          method: 'GET', 
          success: function(res){
            var content = res.data.ok
            if(content==true){
              if(res.data.is_in==true){
                wx.setStorageSync('uid', res.data.uid)
              }else{
                wx.navigateTo({
                  url: '../login/login?uid='+res.data.uid,
                })
              }
            }
          },
          fail: function(e) {
            console.debug(e)
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
  globalData: {
    url:'http://192.168.0.115:5000',
    uid:''
  }
})

