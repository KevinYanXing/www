var app = getApp()
Page({
  data:{
    pinfo:{},
    showView:true,
    mfd:'',
    exp:'',
    pageIndex:2,
    idx:null
  },
  onLoad:function(options){
    if(options.idx){
      this.setData({  
        idx: options.idx,
      })
    }
    if(options.rd){
      console.debug(options.rd)
      this.setData({  
        pageIndex: 1,
      })
  }
  // 周期函数--监听页面加载
  showView:(options.showView=="true"?true:false)
  },
  onShow:function(){
    var mProduct = wx.getStorageSync('mProduct')
    this.setData({
      pinfo:mProduct
    })
    if(this.data.idx){
      this.setData({  
        pageIndex:1, 
        pinfo:wx.getStorageSync('mTarget').pproduct[this.data.idx],
        mfd:wx.getStorageSync('mTarget').pproduct[this.data.idx].mfd,
        exp:wx.getStorageSync('mTarget').pproduct[this.data.idx].exp
      })
    }
  },
  onChangeShowState:function(){
      var that=this;
      that.setData({
        showView:(!that.data.showView)
      })
  },
  // 购样数量
  nums:function(e){
    this.data.pinfo.nums = e.detail.value
  },
  // 购样金额
  price:function(e){
    this.data.pinfo.price = e.detail.value
  },
  // 产品批次
  bnum:function(e){
    this.data.pinfo.bnum = e.detail.value
  },
  // 生产日期
  mfd:function(e){
    this.setData({
      mfd:e.detail.value
    })
    this.data.pinfo.mfd = e.detail.value
  },
  // 失效日期
  exp:function(e){
    this.setData({
      exp:e.detail.value
    })
    this.data.pinfo.exp = e.detail.value
  },
  reselect:function(){
    var that = this
    wx.showActionSheet({
      itemList: ['扫描产品', '选择产品'],
      success: function (e) {
        if(e.tapIndex==0){
              wx.scanCode({
                success: function(res){
                  var code = res.result
                  wx.request({
                      url: 'http://192.168.0.115:5000/plist/?keyword='+code,
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
                              wx.setStorageSync('mProduct',setPinfo)
                              that.setData({
                                pinfo:setPinfo
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
          if(that.data.idx){
            wx.navigateTo({url: '../../search/search?idx='+that.data.idx
            })
          }else{
            wx.navigateBack({delta: 1})
          }
        }
      }
    })
    
  },
  saveProduct:function(){
    var that = this
    var mTarget = wx.getStorageSync('mTarget')
    wx.removeStorageSync('mProduct')
    if(mTarget.pproduct && this.data.idx){
      mTarget.pproduct[this.data.idx] = this.data.pinfo
    }else if(mTarget.pproduct){
      mTarget.pproduct.push(this.data.pinfo)
    }else{
      mTarget.pproduct = [this.data.pinfo]
    }
    wx.setStorage({
      key: 'mTarget',
      data: mTarget,
      success: function(res){
        wx.navigateBack({delta: that.data.pageIndex})
      },
    })
  }
})