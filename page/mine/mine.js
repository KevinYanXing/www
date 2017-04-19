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
    wx.getUserInfo({
      success: function(res){
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
      url: 'http://192.168.0.115:5000/datasum/',
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