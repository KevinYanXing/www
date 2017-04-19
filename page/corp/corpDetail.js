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
  onShow: function() {
    var that = this
    var id = this.data.id
    wx.request({
      url: 'http://192.168.0.115:5000/mdetail/'+id+'/',
      method: 'GET', 
      success: function(res){
        if(res.data.ok==true){
            that.setData({
                imageName:res.data.mdetail.imageName,
                mdetail:res.data.mdetail
            })
        }else{
          wx.showToast({
            title: '请求失败',
            image:'../../image/cw-ico.png',
            duration: 2000
        })
        }
      },
      fail: function() {
        wx.showToast({
            title: '请求失败',
            image:'../../image/cw-ico.png',
            duration: 2000
        })
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
  }
  
})
