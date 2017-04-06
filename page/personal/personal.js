// pages/my/personal.js
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    name: "",
    introduction: "您什么也没留下",
    userInfo: {}
  },
  //事件处理函数
  changPic: function(){
    wx.navigateTo({
      url:'../my/selectPic'
    })
  },
  changNickname: function(){
    wx.navigateTo({
      url:'../my/nicknameModify'
    })
  },
  write: function(){
    wx.navigateTo({
      url:'../my/introduction'
    })
  },
   onShow:function(){
    var _this = this;
    wx.getStorage({
        key: 'introduction',
        success: function(res) {
            _this.setData({
                introduction: res.data
            })
        }
      })
    wx.getStorage({
        key: 'name',
        success: function(res) {
            _this.setData({
                name: res.data 
            })
        },
        fail: function(res) {
            _this.setData({
                name: _this.data.userInfo.nickName
            })
        }
      })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
