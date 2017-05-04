var app = getApp();
var util = require('../../util/util.js')
var checkExpire = util.checkExpire
Page({
  data:{
    dataSum:{
      m:0,
      c1:0,
      c2:0
    }
  },
  onLoad:function(){
    this.onPullDownRefresh()
  },
  mTarget:function(e){
    wx.switchTab({url: '../corp/corp'})
  },
  cTarget:function(e){
    wx.switchTab({url: '../clue/clue'})
  },
  news:function(){
    wx.navigateTo({url: './newsDetail'})
  },
  onPullDownRefresh: function(){
    var that = this
    wx.getUserInfo({
      success: function(res){
        that.setData({
          userInfo : res.userInfo
        })
      }
    })
    wx.showLoading({
      title:'加载中'
    })
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: app.globalData.url+'/check_expire/'+uid+'/',
      method: 'GET',
      success: function(res){
        if(res.data.ok==true){
            wx.request({
              url: app.globalData.url+'/datasum/?uid='+uid,
              data: {},
              method: 'GET',
              success: function(res){
                var content = res.data.ok
                that.setData({
                  netError:false,
                  dataSum : res.data.data
                  })
              },
              fail: function() {
                that.setData({
                  netError:true
                })
              },
              complete: function(){
                wx.hideLoading()
              }
          })
        }
        else{
          wx.showModal({
              title: '提示',
              content: '身份验证已过期，请重新载入',
              complete: function(res) {
                  app.globalData.indexFresh == true
                  wx.switchTab({
                    url: '../index/index',
                  })
              }
          })
        }
      },
      fail:function(){
          that.setData({
            netError:true
          })
          wx.hideLoading()
      }
    })
    wx.stopPullDownRefresh()
  },
})