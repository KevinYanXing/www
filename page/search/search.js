// pages/index/index.js
var app = getApp()
Page({
  data: {
    select: '0',
    firstShow: null,
    about: null,
    searchToggle: false,
    error: false,
    state: null,
    url:'../add/product/addProduct'
  },
  onLoad: function (options) {
    var self = this;
    if(options.idx){
        this.setData({    
            idx: options.idx,
            url:'../add/product/addProduct?idx='+options.index
          })
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'http://192.168.0.115:5000/plist/',
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        self.setData({
          firstShow: res.data.data[0].plist,
          state: res.data.data
        })
      },
    })
  },
  //改变右侧城市列表
  changeContent: function (e) {
    var self = this;
    var name = e.currentTarget.dataset.name;
    var arr = this.data.state;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].bname == name) {
          var plist = arr[i].plist
          self.setData({
            firstShow: plist,
            countryname: name,
            select: i+''
          })
        }
    }
  },
  selectProduct: function (e) {
    var that = this;
    var aid = e.currentTarget.id
    var pinfo=that.data.firstShow[aid]
    if(that.data.idx){
        var mTarget = wx.getStorageSync('mTarget')
        mTarget.pproduct[that.data.idx].id=pinfo.id
        mTarget.pproduct[that.data.idx].name=pinfo.name
        mTarget.pproduct[that.data.idx].sprice=pinfo.sprice
        mTarget.pproduct[that.data.idx].logoid=pinfo.logoid
        mTarget.pproduct[that.data.idx].num=pinfo.num
        wx.setStorageSync('mTarget', mTarget)
        wx.navigateBack({
          delta:1, // 回退前 delta(默认为1) 页面
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }else{
        wx.navigateTo({
          url: that.data.url,
          success: function(res){
              var setPinfo = app.globalData.mProduct
              setPinfo.id=pinfo.id
              setPinfo.name=pinfo.name
              setPinfo.sprice=pinfo.sprice
              setPinfo.logoid=pinfo.logoid
              setPinfo.num=pinfo.num
              app.globalData.mProduct = setPinfo
              console.debug(app.globalData.mProduct)
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
  },
  oninput: function (e) {
    var that = this;
    var val = e.detail.value
    console.debug(val)
    if (val != "") {
      wx.request({
        url: 'http://192.168.0.115:5000/plist/?keyword=' + val + '',
        method: 'GET',
        success: function (res) {
          var content = res.data.ok;
          if (content == true) {
            var arr = res.data.data
            that.setData({
              searchToggle: true,
              about: arr,
              error: false,
            })
          } else {
            that.setData({
              error: true
            })
          }
        },
      })
    } else {
      that.setData({
        searchToggle: false,
      })
    }
  }
})