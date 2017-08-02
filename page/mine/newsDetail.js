var app = getApp()
var util = require('../../util/util.js')
var checkExpire = util.checkExpire
Page({
  data:{
    newsType:['目标消息','线索消息'],
    curNav:0,
    mclist:[]
  },
  onShow:function(){
    this.onPullDownRefresh()
  },
  switchTab: function(e) {
    var that  = this,
        index = e.currentTarget.dataset.index,
        info = that.data.mclist[index];
      that.setData({
        list: info,
        curNav: index,
      });
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
      if(that.data.curNav==0){
        var url = app.globalData.url+'/setread/?typ=m'
      }else{
        var url = app.globalData.url+'/setread/?typ=c'
      }
      wx.showLoading({
        title:'加载中'
      })
      var uid = wx.getStorageSync('uid')
      if(uid){
        uid = checkExpire(uid)
      }
      wx.request({
        url: url,
        method: 'GET',
        success: function(res){
          wx.hideLoading()
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
                netError:false,
                mclist: res.data.data,
                list:res.data.data[that.data.curNav]
              })
            },
            fail: function(res) {
               that.setData({
                netError:true
              })
            },
          })
        },
        fail: function() {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            image:'../../image/cw-ico.png',
            duration: 2000
        })
        }
      })
    },
    onPullDownRefresh: function(){
      var that = this
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
              url: app.globalData.url+'/mclist/?uid='+uid,
              data: {},
              method: 'GET', 
              success: function(res){
                that.setData({
                  netError:false,
                  mclist: res.data.data,
                  list:res.data.data[that.data.curNav]
                })
                wx.hideLoading()
              },
              fail: function(res) {
                that.setData({
                  netError:true
                })
                wx.hideLoading()
              },
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
    }
})