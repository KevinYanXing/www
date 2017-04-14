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
    var info  = detail.data[index];
    info.goodsList.forEach(function(value) {
      value.timer = common.formatTime(new Date(value.beginTime), "yyyy-MM-dd hh:mm");
      self.setData({
        list: info,
        curNav: index
      });
    });
  },
    


// 加载
  onLoad: function () {
    wx.setNavigationBarTitle({
        title: ' '
    })
    var that = this
    //企业信息数据
      that.setData({
         myInfro:[
          {"title":"企业名称","content":"老码头客服就丢大家覅都 就覅的肌肤肯德基覅的空间覅火锅"},
          {"title":"企业编号","content":"1234567"},
          {"title":"企业类型","content":"批发商"},
          {"title":"注册资产","content":"100万元"},
          {"title":"营业执照","content":"5415454545454545"}
        ]
      })

  }, 

  //切换卡
  catchtouchstart:function(e){
    var that = this;
    that.setData({
      startPoint: [e.touches[0].clientX,e.touches[0].clientY]
    })
  },

  catchtouchend:function(e){
    var that = this;
    var currentNum = parseInt(this.data.currentNavtab);
    var endPoint = [e.changedTouches[0].clientX,e.changedTouches[0].clientY];
    var startPoint = that.data.startPoint
    if(endPoint[0] <= startPoint[0]) {
      if(Math.abs(endPoint[0] - startPoint[0]) >= Math.abs(endPoint[1] - startPoint[1]) && currentNum< this.data.navTab.length -1) {
         currentNum=currentNum + 1;  
      }
    }else {
      if(Math.abs(endPoint[0] - startPoint[0]) >= Math.abs(endPoint[1] - startPoint[1]) && currentNum > 0) {
          currentNum -= 1;
      }
    }

    this.setData({
      currentNavtab: currentNum
    });
  },

  switchTab: function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },

  callEvent: function (e) {
    console.log(e)
    wx.makePhoneCall({
        phoneNumber: this.data.phoneNum
      })
  },
  //切换卡 end


     
  //添加联系信息
  setDefault: function(e) {
    var self    = this,
        bindVal = e.currentTarget.dataset.value.index;
  },
  delAddr: function(e) {
    var id = e.currentTarget.dataset.id;
  },
  editAddr: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "editAddr?id=" + id,
      success: function(res) {
      },
    })
  },

  addAddr: function() {
    wx.navigateTo({
      url: "editAddr",
      success: function(res) {
      },
    })
  }
  

})
