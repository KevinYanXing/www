// page/mine/newsDetail.js
var app = getApp()
Page({
  data:{
    newsType:['普查消息','线索消息'],
    curNav:0
  },
  onShow:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.request({  
        url: app.globalData.url+'/mclist/?uid='+uid,
        data: {},
        method: 'GET', 
        success: function(res){
          that.setData({
            mclist: res.data.data,
            list:res.data.data[that.data.curNav]
          })
        },
        fail: function(res) {
          wx.showToast({
          title: '请求失败',
          image:'../../image/cw-ico.png',
          duration: 2000
      })
        },
      })
  },
  switchTab: function(e) {
    var that  = this,
        index = e.currentTarget.dataset.index,
        info = that.data.mclist[index];
      that.setData({
        list: info,
        curNav: index,
      });
      console.debug(that.data.list)
  },
  checkInfo:function(e){
    var id = e.currentTarget.id
    var that = this
    if(that.data.curNav==0){
      var url = '../corp/corpDetail?id='+id
    }else{
      var url = '../clue/clueDetail?id='+id
    }
    wx.navigateTo({url: url})
  },
  setRead:function(){
      var that = this
      var uid = wx.getStorageSync('uid')
      if(that.data.curNav==0){
        var url = app.globalData.url+'/setread/?typ=m'
      }else{
        var url = app.globalData.url+'/setread/?typ=c'
      }
      wx.request({
        url: url,
        method: 'GET',
        success: function(res){
          wx.showToast({
            title: '标记成功',
            image:'../../image/cg-ico.png',
            duration: 2000
        })
        wx.request({  
            url: app.globalData.url+'/mclist/?uid='+uid,
            method: 'GET', 
            success: function(res){
              that.setData({
                mclist: res.data.data,
                list:res.data.data[that.data.curNav]
              })
            },
            fail: function(res) {
              wx.showToast({
              title: '请求失败',
              image:'../../image/cw-ico.png',
              duration: 2000
          })
            },
          })
        },
        fail: function() {
          wx.showToast({
            title: '请求失败',
            image:'../../image/cw-ico.png',
            duration: 2000
        })
        }
      })
    }
})