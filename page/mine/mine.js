var app = getApp();
Page({
  data:{
    dataSum:{
      m:0,
      c1:0,
      c2:0
    }
  },
  onShow:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.getUserInfo({
      success: function(res){
        console.debug(res)
          that.setData({
            userInfo : res.userInfo
          })
      },
      fail: function() {
        wx.showToast({
            title: '获取用户信息失败',
            image:'../../image/cw-ico.png',
            duration: 2000
        })
      }
    })
    wx.request({
      url: app.globalData.url+'/datasum/?uid='+uid,
      data: {},
      method: 'GET',
      success: function(res){
        var content = res.data.ok
        console.debug(res.data)
        if(content==true){
          that.setData({
            dataSum : res.data.data
          })
        }
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
  mTarget:function(e){
    wx.switchTab({url: '../corp/corp'})
  },
  cTarget:function(e){
    wx.switchTab({url: '../clue/clue'})
  },
  news:function(){
    wx.navigateTo({url: './newsDetail'})
  }
})