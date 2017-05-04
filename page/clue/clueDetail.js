//获取应用实例  
var app = getApp() 

Page({  
  data: {  
    id:'',
    // 换轮图切换 
    indicatorDots: true,
    interval: 5000,
    duration: 1000,
    curNav: "0",
    circular: true,

    // 切换卡
    hasData: true,
    navTab: ["基本信息", "线索进展"],
    currentNavtab:0,

    cdetail:{},
    hasData:true,
    isHidden:true,
    hide:"hide",
    noHid:"noHid",

  },  
  onLoad: function(options) {
    this.setData({
      id:options.id
    })
    
  },
  onShow: function(){
    var that = this
    var id = that.data.id
    wx.showLoading({
      title:'加载中'
    })
    wx.request({
      url: app.globalData.url+'/cdetail/'+id+'/',
      method: 'GET', 
      success: function(res){
        wx.hideLoading()
        if(res.data.ok==true){
            that.setData({
                netError:false,
                imageName:res.data.cdetail.imageName,
                cdetail:res.data.cdetail
            })
        }else{
          that.setData({
            netError:true
          })
        }
        wx.hideLoading()
      },
      fail: function() {
        that.setData({
            netError:true
          })
        wx.hideLoading()
      }
    })
  },
    bigImage:function(e){
    var that = this
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: that.data.imageName
    })
  },
  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  reply:function(e){
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../add/clueReply?id='+id
    })
  },
  onPullDownRefresh: function(){
    wx.showLoading({
      title:'加载中'
    })
    wx.request({
      url: app.globalData.url+'/cdetail/'+id+'/',
      method: 'GET', 
      success: function(res){
        wx.hideLoading()
        if(res.data.ok==true){
            that.setData({
                netError:false,
                imageName:res.data.cdetail.imageName,
                cdetail:res.data.cdetail
            })
        }else{
          that.setData({
            netError:true
          })
        }
        wx.hideLoading()
      },
      fail: function() {
        that.setData({
            netError:true
          })
        wx.hideLoading()
      }
    })
    wx.stopPullDownRefresh()
  }
})
