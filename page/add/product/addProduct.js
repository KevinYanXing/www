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
    this.setData({
      pinfo:app.globalData.mProduct
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
    if(this.data.idx){
      wx.navigateTo({
        url: '../../search/search?idx='+this.data.idx,
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
    }else{
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
  },
  saveProduct:function(){
    var that = this
    var mTarget = wx.getStorageSync('mTarget')
    app.globalData.mProduct = {}
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
        wx.navigateBack({
          delta: that.data.pageIndex, // 回退前 delta(默认为1) 页面
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