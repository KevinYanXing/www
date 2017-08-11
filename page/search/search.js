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
    url:'../add/product/addProduct',

    //搜索展开事件
    focus:false,
    showView:true,
    searchValue:'',
    //搜索展开事件 end
  },
  onLoad: function (options) {
    var self = this;
    if(options.idx){
        this.setData({    
            idx: options.idx,
            url:'../add/product/addProduct?idx='+options.index
          })
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.url+'/plist/',
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        self.setData({
          netError:false,
          firstShow: res.data.data[0].plist,
          state: res.data.data
        })
        wx.hideLoading();
      },
      fail:function(){
        self.setData({
          netError:true
        })
        wx.hideLoading();
      }
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
  },
  //搜索展开事件 end
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
    // console.debug(aid)
    var pinfo=that.data.firstShow[aid]
    // console.debug(pinfo)
    if(that.data.idx){
        var mTarget = wx.getStorageSync('mTarget')
        mTarget.pproduct[that.data.idx].id=pinfo.id
        mTarget.pproduct[that.data.idx].name=pinfo.name
        mTarget.pproduct[that.data.idx].sprice=pinfo.sprice
        mTarget.pproduct[that.data.idx].logoid=pinfo.logoid
        mTarget.pproduct[that.data.idx].num=pinfo.num
        wx.setStorageSync('mTarget', mTarget)
        wx.navigateBack({delta:1})
    }else{
        if(e.currentTarget.dataset.arr){
          var pinfo=e.currentTarget.dataset.arr
        }
        if(wx.getStorageSync('mProduct')){
            var setPinfo = wx.getStorageSync('mProduct')
          }else{
            var setPinfo = {}
          }
          setPinfo.id=pinfo.id
          setPinfo.name=pinfo.name
          setPinfo.sprice=pinfo.sprice
          setPinfo.logoid=pinfo.logoid
          setPinfo.num=pinfo.num
          wx.setStorageSync('mProduct',setPinfo)
          wx.navigateTo({url: that.data.url})
    }
  },
  oninput: function (e) {
    var that = this;
    var val = e.detail.value
    if (val && val != "") {
      wx.showLoading({
        title:'加载中'
      })
      wx.request({
        url: app.globalData.url+'/plist/?keyword=' + val + '',
        method: 'GET',
        success: function (res) {
          wx.hideLoading()
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
              searchToggle: true,
              error: true
            })
          }
        },
        fail:function(){
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            image:'../../image/cw-ico.png',
            duration: 2000
        })
        }
      })
    } else {
      that.setData({
        searchToggle: false,
      })
    }
  },
  // onPullDownRefresh: function(){
  //   wx.showLoading({
  //     title: '加载中...',
  //   })
  //   wx.request({
  //     url: app.globalData.url+'/plist/',
  //     method: 'GET',
  //     header: {
  //       'Accept': 'application/json'
  //     },
  //     success: function (res) {
  //       self.setData({
  //         netError:false,
  //         firstShow: res.data.data[0].plist,
  //         state: res.data.data
  //       })
  //       wx.hideLoading();
  //     },
  //     fail:function(){
  //       self.setData({
  //         netError:true
  //       })
  //       wx.hideLoading();
  //     }
  //   })
  //   wx.stopPullDownRefresh()
  // }
  
})