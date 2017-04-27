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
    var bSelect = wx.getStorageSync('bSelect')
    if(bSelect){
      that.setData({
          brandInfo:bSelect
        })
    }else{
      wx.request({
        url: app.globalData.url+'/blist/',
        data: {},
        method: 'GET', 
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
          title: '请求失败',
          image:'../../image/cw-ico.png',
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
    var cTarget = wx.getStorageSync('cTarget')
    if(cTarget && cTarget.bSelected.length>0){
      wx.navigateTo({url: '../add/clueAdd'})
    }else{
      wx.showModal({
            title: '提示',
            content: '请先选择品种'
        })
    }
  },
  onPullDownRefresh: function(){
    var that = this
    var bSelect = wx.getStorageSync('bSelect')
    if(bSelect){
      that.setData({
          brandInfo:bSelect
        })
    }else{
      wx.request({
        url: app.globalData.url+'/blist/',
        data: {},
        method: 'GET', 
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
          title: '请求失败',
          image:'../../image/cw-ico.png',
          duration: 2000
      })
        
        },
      })
    }
    wx.stopPullDownRefresh()
  }
})
