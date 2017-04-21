var app = getApp();
Page({  
  data:{
    productSelected:[]
  },
  onShow: function () {
    var mTarget = wx.getStorageSync('mTarget')
    if(mTarget && mTarget.pproduct){
      this.setData({
        productSelected:mTarget.pproduct
      })
    }
  },
  actionSheetTap: function (e) {
    wx.showActionSheet({
      itemList: ['扫描产品', '选择产品'],
      success: function (e) {
        if(e.tapIndex==0){
            wx.scanCode({
              success: function(res){
                var code = res.result
                wx.request({
                    url: app.globalData.url+'/plist/?keyword='+code,
                    method: 'GET', 
                    success: function(res){
                      var content = res.data.ok;
                      if (content == true) {
                        var pinfo = res.data.data[0].plist[0]
                        if(wx.getStorageSync('mProduct')){
                            var setPinfo = wx.getStorageSync('mProduct')
                          }else{
                            var setPinfo = {}
                          }
                          setPinfo.id=pinfo.id
                          setPinfo.name=pinfo.name
                          setPinfo.sprice=pinfo.sprice
                          setPinfo.logoid=pinfo.logoid
                          setPinfo.num=pinfo.num
                          wx.setStorageSync('mProduct', setPinfo)
                        wx.navigateTo({
                          url: './addProduct?rd=1',
                          success: function(res){
                             console.debug(res.data)
                          },
                          fail: function() {
                            // fail
                          },
                        })
                      } else {
                        wx.showModal({
                            title: '提示',
                            content: '找不到该条形码的产品，请手动选择'
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
              fail: function() {
                wx.showModal({
                      title: '提示',
                      content: '扫描失败，请重试'
                  })
              }
            })
        }else if(e.tapIndex==1){
          wx.navigateTo({url: '../../search/search'});
        }
      }
    })
  },
  editProduct: function (e) {
      var that = this
      var editIndex = e.currentTarget.id
      wx.showActionSheet({
        itemList: ['编辑', '删除'],
        success: function (e) {
          if(e.tapIndex==0){
              wx.navigateTo({url: './addProduct?idx='+editIndex})
          }else if(e.tapIndex==1){
            var mTarget = wx.getStorageSync('mTarget')
            mTarget.pproduct.splice(editIndex, 1)
            wx.setStorageSync('mTarget', mTarget)
            that.setData({
              productSelected:mTarget.pproduct
            })
          }
        }
      })
    },

})
