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
  globalData: {}
})

