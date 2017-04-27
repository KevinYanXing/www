var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    console.debug(options)
    this.setData({
      uid : options.uid
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  account:function(e){
      this.setData({
      account: e.detail.value
    })
  },
  pwd:function(e){
    console.debug(e.detail.value)
    this.setData({
      pwd: e.detail.value
    })
  },
  login:function(e){
    var that = this
    console.debug(that.data.account , that.data.pwd , that.data.uid)
    if(that.data.account && that.data.pwd && that.data.uid){
      wx.request({
        url: app.globalData.url+'/login/?account='+ that.data.account + '&pwd='+ that.data.pwd + '&uid=' + that.data.uid,
        method: 'GET',
        success: function(res){
        var content = res.data.ok
        if(content==true){
          wx.setStorageSync('uid', res.data.uid)
          wx.showToast({
              title: '登陆成功',
              image:'../../image/cg-ico.png',
              duration: 1000
          })
          wx.navigateBack({delta: 1})
        }else{
          wx.showToast({
              title: '账号或密码错误',
              image:'../../image/cw-ico.png',
              duration: 1000
          })
        }
        },
        fail: function() {
          wx.showToast({
              title: '请求失败',
              image:'../../image/cw-ico.png',
              duration: 1000
          })
        }
      })
    }else{
      wx.showModal({
          title: '提示',
          content: '请填写账号和密码'
      })
    }
  }
})