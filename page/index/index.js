var app = getApp();
var server = require('../../util/util');
Page({
  //转跳页面
  //添加： bindtap="tapSearch"
  addTarget:function(){
    var mTarget = wx.getStorageSync('mTarget')
    if(mTarget.id){
      wx.removeStorageSync('mTarget')
    }
    wx.navigateTo({
      url: '../add/add',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      }
    })
  },
  addClue:function(){
    var cTarget = wx.getStorageSync('cTarget')
    if(cTarget.id){
      wx.removeStorageSync('cTarget')
    }
    wx.navigateTo({
      url: '../add/clueAdd',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      }
    })
  }
});


// "pagePath": "pages/logs/logs", 