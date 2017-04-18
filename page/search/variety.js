 var app = getApp() 

Page({  
  data: {  
    lightList:[]
  },  
  onLoad: function() {  
    var that = this;  
  },  

// 加载
  onLoad: function () {
    var that = this
    //品种
      var bSelect = wx.getStorageSync('bSelect')
      if(bSelect){
        that.setData({
            brandInfo:bSelect
          })
      }else{
        wx.request({
          url: 'http://192.168.0.115:5000/blist/',
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            var content = res.data.ok
            if(content==true){
              that.setData({
                brandInfo:res.data.data
              })
            }else{
                brandInfo:[]
            }
          },
          fail: function() {
            wx.showToast({
                title: '请求失败!',
                icon: 'loading',
                duration: 2000
            })
          
          },
        })
      }
      
  }, 
  selectBrand:function(e){
    var id = e.currentTarget.id
    var bInfo = this.data.brandInfo
    var bSelected = []
    for(var i=0;i<bInfo.length;i++){
      for(var j=0;j<bInfo[i].brand.length;j++){
        if(bInfo[i].brand[j].id==id){
          bInfo[i].brand[j].show = !bInfo[i].brand[j].show
        }
        if(bInfo[i].brand[j].show==true){
          bSelected.push(bInfo[i].brand[j])
        }
      }
    }
    var cTarget = wx.getStorageSync('cTarget')
    if(cTarget){
      cTarget.bSelected = bSelected
    }else{
      cTarget = {}
      cTarget.bSelected = bSelected
    }
    wx.setStorageSync('cTarget', cTarget)
    wx.setStorageSync('bSelect', bInfo)
    this.setData({
      brandInfo:bInfo
    })
  },
  nextStep:function(){
    wx.navigateTo({
      url: '../add/clueAdd',
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
  }
})
