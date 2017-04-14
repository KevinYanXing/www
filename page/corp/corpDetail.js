var common = require('../../util/util.js');
var detail = {
  data: [
    {
      imageList: ["../../image/test.jpg","../../image/test1.jpg",
        "../../image/test2.jpg","../../image/test3.jpg"
      ]
     
    }
  
  ]
}



//index.js  
//获取应用实例  
var app = getApp() 

Page({  
  data: {  
 
    // 换轮图切换 
    indicatorDots: true,
    interval: 5000,
    duration: 1000,
    curNav: "1",
    circular: true,

    // 切换卡
    hasData: true,
    navTab: ["基本信息", "线索进展"],
    currentNavtab:0,

    //内容
    myInfro:[],
    money:[],
    hasData:true,
    isHidden:true,
    hide:"hide",
    noHid:"noHid",

  },  
  onLoad: function() {  
    var that = this;  
  
    /** 
     * 获取系统信息 
     */  
    wx.getSystemInfo( {  
  
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }  
  
    });  
  },  

 /*换轮图切换 */  
  onLoad: function() {
  },
  onHide: function() {
  },
  onShow: function() {
    var self   = this,
        info   = detail.data,
        info_des = info[0];
    self.setData({
      product: info,
      list: info_des,
      length: info.length
    });
  },
  switchTab: function(e) {
    var self  = this,
        index = e.currentTarget.dataset.index;
      self.setData({
        curNav: index
      });
  },
    
  
})
