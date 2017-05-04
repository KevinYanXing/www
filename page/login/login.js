var app = getApp();
var util = require('../../util/util.js')
var checkExpire = util.checkExpire
Page({
  data:{},
  onLoad:function(options){
    this.setData({
      openid : options.openid
    })
  },
  onUnload:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    if(!uid){
      wx.showModal({
          title: '提示',
          content: '请填写账号和密码',
          complete:function(){
            wx.navigateTo({
              url: '../login/login?openid='+that.data.openid
            })
          }
      })  
    }
  },
  account:function(e){
      this.setData({
      account: e.detail.value
    })
  },
  
  pwd:function(e){
    this.setData({
      pwd: e.detail.value
    })
  },
  login:function(e){
    var that = this
    if(that.data.account && that.data.pwd && that.data.openid){
      wx.showLoading({
        title:'加载中'
      })
      wx.request({
        url: app.globalData.url+'/login/?account='+ that.data.account + '&pwd='+ that.data.pwd + '&openid=' + that.data.openid,
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