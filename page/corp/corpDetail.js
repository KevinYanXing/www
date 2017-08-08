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
    navTab: ["基本信息", "目标进展"],
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
  bigImage1: function (e) {
    var that = this
    var current = e.currentTarget.dataset.src
    console.debug(that.data.vphoto)
    wx.previewImage({
      current: current,
      urls: that.data.vphoto
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
          var tmp_photo = []
          var mdetail = res.data.mdetail
          
          if (mdetail.verify && mdetail.verify.length>0){
            
            for (var i = 0; i < mdetail.verify.length; i++) {
              if (mdetail.verify[i].photo && mdetail.verify[i].photo.length>0) {
                for (var j = 0; j < mdetail.verify[i].photo.length; j++) {
                  tmp_photo.push(mdetail.verify[i].photo[j])
                }
              }
            }
          }
          that.setData({
              netError:false,
              imageName:res.data.mdetail.imageName,
              mdetail:res.data.mdetail,
              vphoto:tmp_photo
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
