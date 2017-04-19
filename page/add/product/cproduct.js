// page/add/product/cproduct.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  cProduct:function(e){
    this.setData({
      cproduct:e.detail.value
    })
  },
  saveProduct:function(e){
    var that = this
    var cTarget = wx.getStorageSync('cTarget')
    if(cTarget.cproduct){
      cTarget.cproduct.push(that.data.cproduct)
    }else{
      cTarget.cproduct = [that.data.cproduct]
    }
    wx.setStorageSync('cTarget', cTarget)
    console.debug(that.data.cproduct)
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
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