var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    this.setData({
      id : options.id
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  cReply:function(e){
      this.setData({
      creply: e.detail.value
    })
  },
  confirm:function(e){
    var that = this
    if(that.data.creply){
      wx.showLoading({
        title:'加载中'
      })
      wx.request({
        url: app.globalData.url+'/creply/'+ that.data.id + '/?descs='+ that.data.creply,
        method: 'GET',
        success: function(res){
          wx.showToast({
              title: '提交成功',
              image:'../../image/cg-ico.png',
              duration: 1000
          })
          wx.navigateBack({delta: 1})
        },
        fail: function() {
          wx.showToast({
              title: '请求失败',
              image:'../../image/cw-ico.png',
              duration: 1000
          })
        }
      })
    }else{
      wx.showModal({
          title: '提示',
          content: '请填写回复内容'
      })
    }
  }
})