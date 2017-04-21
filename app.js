App({
  onShow: function() {
    wx.login({
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

  },
  onHide: function() {
  },
  globalData: {
    url:'http://192.168.0.115:5000'
  }
})

