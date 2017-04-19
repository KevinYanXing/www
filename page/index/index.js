var app = getApp();
var server = require('../../util/util');
Page({
  //添加普查
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
    }
    wx.navigateTo({url: '../add/clueAdd'})
  }
});