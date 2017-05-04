var app = getApp();
var util = require('../../util/util.js')
var checkExpire = util.checkExpire

Page({
  data:{
    loading:true,
    netError:false
  },
  onLoad:function(){
    this.onPullDownRefresh()
  },
  onShow:function(){
      if(app.globalData.indexFresh == true){
          this.onPullDownRefresh()
      }
  },
  //添加普|清
  addTarget:function(){
    var mTarget = wx.getStorageSync('mTarget')
    if(mTarget.id){
      wx.removeStorageSync('mTarget')
    }
    wx.navigateTo({url: '../add/add'})
  },
  //添加线索
  addClue:function(){
    var cTarget = wx.getStorageSync('cTarget')
    if(cTarget.id){
      wx.removeStorageSync('cTarget')
      wx.removeStorageSync('bSelect')
    }
    wx.navigateTo({url: '../search/variety'})
  },
  onPullDownRefresh: function(){
    var that = this
    wx.showLoading({
      title:'加载中'
    })
    wx.login({
      success: function(res){
        wx.request({
          url: app.globalData.url+ '/wxlogin/?code=' + res.code,
          method: 'GET', 
          success: function(res){
              app.globalData.indexFresh = false
              that.setData({
                netError:false
              })
              if(res.data.is_in==true){
                // wx.setStorageSync('uid', res.data.uid)
                wx.setStorageSync('uid', 'test')
              }else{
                wx.navigateTo({
                  url: '../login/login?openid='+res.data.openid,
                })
              }
          },
          fail: function(e) {
            that.setData({
              netError:true
            })
          },
          complete:function(){
            wx.hideLoading()
            that.setData({
              loading:false
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
    wx.stopPullDownRefresh()
  }
});