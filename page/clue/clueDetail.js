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

    mdetail:{},
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
  onShow: function() {
    var that = this
    var id = this.data.id
    wx.request({
      url: 'http://192.168.0.115:5000/cdetail/'+id+'/',
      method: 'GET', 
      success: function(res){
        if(res.data.ok==true){
            that.setData({
                imageName:res.data.mdetail.imageName,
                mdetail:res.data.mdetail
            })
        }else{
          wx.showToast({
            title: '请求失败!',
            icon: 'loading',
            duration: 2000
          })
        }
      },
      fail: function() {
        // fail
      }
    })
  },
  bigImage:function(e){
    var that = this
    console.debug(e.currentTarget)
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
})
