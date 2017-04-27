var app    = getApp();
Page({
  data: {
    curNav: 0,
    product:[{'sta':'全部'},{'sta':'我提交的'},{'sta':'指派给我'}],
    //搜索展开事件
    focus:false,
    showView:true,
    searchValue:''
    //搜索展开事件 end
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
  onLoad: function() {
    var that  = this
    var index = that.data.curNav
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: app.globalData.url+'/clist/?uid='+uid,
      data: {},
      method: 'GET', 
      success: function(res){
        that.setData({
          product: res.data.data,
          list: res.data.data[index],
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
      var uid = wx.getStorageSync('uid')
      wx.showActionSheet({
          itemList: ['查看','编辑','删除'],
          success: function (e) {
            if(e.tapIndex==0){
                wx.navigateTo({url: './clueDetail?id='+id})
            }else if(e.tapIndex==1){
              wx.setStorageSync('cTarget', that.data.list.cinfo[idx])
              wx.navigateTo({url: '../add/clueAdd'})

            }else if(e.tapIndex==2){
                wx.showModal({
                    title: '警告',
                    content: '您确定要删除这条记录吗？删除后无法恢复！',
                    success: function(res) {
                      if (res.confirm) {
                          wx.request({
                            url: app.globalData.url+'/cdel/'+ id +'/',
                            data: {},
                            method: 'GET',
                            success: function(res){ 
                                var index = that.data.curNav
                                wx.request({
                                  url: app.globalData.url+'/clist/?uid='+uid,
                                  data: {},
                                  method: 'GET', 
                                  success: function(res){
                                    that.setData({
                                      product: res.data.data,
                                      list: res.data.data[index],
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
                                wx.showToast({
                                  title: '删除成功',
                                  image:'../../image/cg-ico.png',
                                  duration: 2000
                              })
                            },
                            fail: function(res) {
                               wx.showToast({
                                  title: '请求失败',
                                  image:'../../image/cw-ico.png',
                                  duration: 2000
                              })
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
    var uid = wx.getStorageSync('uid')
    console.debug(val)
    if (val && val != "") {
      wx.request({
        url: app.globalData.url+'/clist/?keyword=' + val + '&uid='+uid,
        method: 'GET',
        success: function (res) {
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
    }else{
      that.setData({
        product:that.data.showData,
        list: that.data.showData[that.data.curNav],
        error:false
      })
    }
  },
  onPullDownRefresh: function(){
    var that  = this
    var index = that.data.curNav
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: app.globalData.url+'/clist/?uid='+uid,
      data: {},
      method: 'GET', 
      success: function(res){
        that.setData({
          product: res.data.data,
          list: res.data.data[index],
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
    wx.stopPullDownRefresh()
  }
})