var app = getApp();
var util = require('../../util/util.js')
var checkExpire = util.checkExpire

Page({
  data: {
    curNav: 0,
    product:[{'sta':'全部','minfo':[]},{'sta':'待审核','minfo':[]},{'sta':'已通过','minfo':[]},{'sta':'已拒绝','minfo':[]},{'sta':'已完结','minfo':[]}],
    //搜索展开事件
    focus:false,
    showView:true,

    searchValue:'',
    //搜索展开事件 end
  },
  onLoad:function(options){
      this.setData({
        id:options.id
      })
      this.onPullDownRefresh()
  },
  onShow:function(){
    var that = this
      if(app.globalData.corpFresh == true){
          that.onPullDownRefresh()
      }
  },
  switchTab: function(e) {
    var that  = this,
        index = e.currentTarget.dataset.index,
        info = that.data.product[index];
      that.setData({
        list: info,
        curNav: index,
      });
  },
  //搜索展开事件
  onChangeShowState:function(){
      var that=this;
      that.setData({
        focus:(!that.data.focus),
        showView:(!that.data.showView),
        searchToggle:false,
        searchValue:''
      })
      if(that.data.showView==true){
          that.setData({
            product:that.data.showData,
            list: that.data.showData[that.data.curNav],
            error:false
          })
      }
  },
  //搜索展开事件 end
  selected: function(e) {
      var that = this
      var id = e.currentTarget.id
      var idx = e.currentTarget.dataset.value
      wx.showActionSheet({
          itemList: ['查看','编辑','删除'],
          success: function (e) {
            if(e.tapIndex==0){
                wx.navigateTo({url: './corpDetail?id='+id})
            }else if(e.tapIndex==1){
                wx.setStorageSync('mTarget', that.data.list.minfo[idx])
                wx.navigateTo({url: '../add/add',})
            }else if(e.tapIndex==2){
                wx.showModal({
                    title: '警告',
                    content: '您确定要删除这条记录吗？删除后无法恢复！',
                    success: function(res) {
                      if (res.confirm) {
                          wx.showLoading({
                            title:'加载中'
                          })
                          wx.request({
                            url: app.globalData.url+'/mdel/'+ id +'/',
                            data: {},
                            method: 'GET',
                            success: function(res){ 
                                wx.hideLoading()
                                wx.showToast({
                                  title: '删除成功',
                                  image:'../../image/cg-ico.png',
                                  duration: 2000
                                })
                                that.onPullDownRefresh()
                            },
                            fail: function(res) {
                                that.setData({
                                    netError:true
                                  })
                                  wx.hideLoading()
                            }
                          })
                      }
                    }
                })
            }
          }
        })
  },
  oninput: function (e) {
    var that = this;
    var val = e.detail.value
    if (val && val != "") {
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
                url: app.globalData.url+'/mlist/?keyword=' + val + '&uid='+uid,
                method: 'GET',
                success: function (res) {
                  wx.hideLoading()
                  var content = res.data.ok;
                  if (content == true) {
                    var arr = res.data.data
                    that.setData({
                      product: res.data.data,
                      list: res.data.data[that.data.curNav],
                      error: false,
                    })
                  } else {
                    that.setData({
                      error:true
                    })
                  }
                },
                fail:function(){
                  wx.showToast({
                    title: '请求失败',
                    image:'../../image/cw-ico.png',
                    duration: 2000
                  })
                }
              })
          }
          else{
            wx.hideLoading()
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
            wx.showToast({
              title: '请求失败',
              image:'../../image/cw-ico.png',
              duration: 2000
            })
        }
      })
    }else{
      that.setData({
        product:that.data.showData,
        list: that.data.showData[that.data.curNav],
        error:false
      })
    }
  },
  onPullDownRefresh: function(){
      var that  = this,
      index = that.data.curNav
      wx.showLoading({
        title:'加载中'
      })
      var uid = wx.getStorageSync('uid')
      console.debug(uid)
      wx.request({
        url: app.globalData.url+'/check_expire/'+uid+'/',
        method: 'GET',
        success: function(res){
          if(res.data.ok==true){
              wx.request({  
                url: app.globalData.url+'/mlist/?uid='+uid,
                data: {},
                method: 'GET', 
                success: function(res){
                  app.globalData.corpFresh = false
                  that.setData({
                    netError:false,
                    showData:res.data.data,
                    product: res.data.data,
                    list: res.data.data[index],
                  })
                  wx.hideLoading()
                },
                fail: function(res) {
                  wx.hideLoading()
                  that.setData({
                      netError:true
                    })
                },
              })
          }
          else{
            wx.hideLoading()
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