//获取应用实例  
var app = getApp() 

Page({  
  data: {  
    id:'',
    imageName:[],
    // 换轮图切换 
    indicatorDots: true,
    interval: 5000,
    duration: 1000,
    curNav: "0",
    circular: true,

    // 切换卡
    hasData: true,
    navTab: ["基本信息", "普查进展"],
    currentNavtab:0,

    //内容
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
  onShow: function(options) {
    this.onPullDownRefresh()
    
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
      url: '../add/reply?id='+id
    })
  },
  onPullDownRefresh: function(){
    var that = this
    var id = this.data.id
    wx.request({
      url: app.globalData.url+'/mdetail/'+id+'/',
      method: 'GET', 
      success: function(res){
        if(res.data.ok==true){
            that.setData({
                netError:false,
                imageName:res.data.mdetail.imageName,
                mdetail:res.data.mdetail
            })
        }else{
          that.setData({
          netError:true
        })
        }
      },
      fail: function() {
       that.setData({
          netError:true
        })
      }
    })
    wx.stopPullDownRefresh()
  }
  
})
