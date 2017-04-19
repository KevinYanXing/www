Page({
  data:{},
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
    wx.navigateBack({delta: 1})
  }
})