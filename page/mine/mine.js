// page/mine/mine.js
Page({
  data:{
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that = this
    wx.getUserInfo({
      success: function(res){
        console.debug(res.userInfo)
          that.setData({
            userInfo : res.userInfo
          })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})