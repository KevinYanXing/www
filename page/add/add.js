var app = getApp();
var imageName = []
function sendPhotos(arr){
  if(arr.length != 0){
      wx.uploadFile({
        url: 'http://192.168.0.115:5000/img/', //仅为示例，非真实的接口地址
        filePath: arr[0],
        name: 'file',
        success: function(res){
          var rData = JSON.parse(res.data)
          if(rData.ok == true){
            imageName.push(rData.filename)
          }else{
            
          }
          arr.splice(0,1)
          sendPhotos(arr)
        }
    })
  }
}
Page({
  data: {
    focus:false,
    //店铺名称
    pname:'',
    //性质选择
    tarray: ['选择性质', '原料生产', '包装制作', '销售门市', '网店销售', '生产工厂', '批发商', '仓库'],
    ptype: 0,

    //售假情况
    strike: ['选择情况', '无售假', '售假'],
    pstate: 0,

    //添加图片
    imageList : [],
    count: 9,
    code : '',

    //负责人
    pperson:'',
    //联系方式
    pcontact:'',
    //市场名称
    pmarket:'',
    //所在地址
    plocation:'',

    dTarget:{}

  },
  onShow:function(){
    var mTarget = wx.getStorageSync('mTarget')
    console.debug(mTarget)
    if(mTarget){
      this.setData({
        dTarget:mTarget,
        pname:mTarget.pname,
        ptype:mTarget.ptype,
        pstate:mTarget.pstate,
        imageList:mTarget.imageList,
        pperson:mTarget.pperson,
        pmarket:mTarget.pmarket,
        plocation:mTarget.plocation,
        pcontact:mTarget.pcontact
      })
    }else{
      wx.setStorageSync('mTarget', {})
    }
    
  },
  //店铺名称
  pName:function(e){
    this.setData({
      pname: e.detail.value
    })
    this.data.dTarget.pname = e.detail.value
    wx.setStorageSync('mTarget', this.data.dTarget)
  },
  //性质选择
  pType: function(e) {
    this.setData({
      ptype: e.detail.value
    })
    this.data.dTarget.ptype = e.detail.value
    wx.setStorageSync('mTarget', this.data.dTarget)
  },
  //售假情况
  pState: function(e) {
    this.setData({
      pstate: e.detail.value
    })
    this.data.dTarget.pstate = e.detail.value
    wx.setStorageSync('mTarget', this.data.dTarget)
  },
  //添加图片
  pPhoto: function(e) {
    var that = this
    wx.chooseImage({
      success: function (res) {
        that.setData({
          imageList:res.tempFilePaths
        })
        that.data.dTarget.imageList = that.data.imageList
        wx.setStorageSync('mTarget', that.data.dTarget)
        }
    })
    
  },
  //图片预览
  pPhotoshow: function(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  //扫码
  pProduct: function() {
    var mTarget = wx.getStorageSync('mTarget')
    if(mTarget.pproduct){
        wx.navigateTo({
          url: 'product/product',
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
                              wx.navigateTo({
                                url: './product/addProduct?rd=1',
                                success: function(res){
                                    var setPinfo = app.globalData.mProduct
                                    setPinfo.id=pinfo.id
                                    setPinfo.name=pinfo.name
                                    setPinfo.sprice=pinfo.sprice
                                    setPinfo.logoid=pinfo.logoid
                                    setPinfo.num=pinfo.num
                                    app.globalData.mProduct = setPinfo
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
                            // fail
                          }
                      })
                    },
                    fail: function() {
                      wx.showModal({
                            title: '提示',
                            content: '扫描失败，请重试！'
                        })
                    }
                  })
            }else if(e.tapIndex==1){
              wx.navigateTo({url: '../search/search'});
            }
          }
        })
    }
  },
  //市场名称、所在地区
  pMarket:function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.data.dTarget.plocation = res.address
        that.data.dTarget.pmarket = res.name
        that.setData({
          plocation: res.address,
          pmarket:res.name
        })
        wx.setStorageSync('mTarget', that.data.dTarget)
      },fail:function(res){
        console.debug(res)
      }
    })
  },
  //负责人
  pPerson:function(e){
    this.setData({
      pperson:e.detail.value
    })
    this.data.dTarget.pperson = e.detail.value
    wx.setStorageSync('mTarget', this.data.dTarget)
  },
  pContact:function(e){
    this.setData({
      pcontact:e.detail.value
    })
    this.data.dTarget.pcontact = e.detail.value
    wx.setStorageSync('mTarget', this.data.dTarget)
  },
  pConfirm: function() {
    var that = this
      if(!that.data.pname){
        wx.showModal({
            title: '提示',
            content: '请填写店铺名称！',
            success: function(res) {
                that.setData({
                  focus:true
                })
            }
        })
      }else{
        var tempFilePaths = that.data.imageList
        if(tempFilePaths.length=0){
            wx.showModal({
              title: '提示',
              content: '请先上传图片！',
              success: function(res) {
            
              }
          })
        }else{
            console.debug(imageName,111)
            sendPhotos(tempFilePaths)
            console.debug(imageName,222)
            if(imageName.length=0){
                wx.showModal({
                  title: '提示',
                  content: '图片上传失败，请重新上传！',
                  success: function(res) {
                      
                  }
              })
            }else{
                console.debug(imageName)
                that.data.dTarget.imageName = imageName
                wx.setStorageSync('mTarget', that.data.dTarget)
                var submitData = wx.getStorageSync('mTarget')
                if(submitData){
                    wx.request({
                      url: 'http://192.168.0.115:5000/msave/',
                      data: {data:wx.getStorageSync('mTarget')},
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      // header: {}, // 设置请求的 header
                      success: function(res){
                        //清除缓存
                        wx.removeStorageSync('mTarget')
                        //跳转页面
                        wx.switchTab({
                          url: '../corp/corp',
                          success: function(res){
                            wx.showToast({
                                title: '保存成功!',
                                icon: 'success',
                                duration: 2000
                            })
                          },
                          fail: function(res) {
                            console.debug(res)// fail
                          }
                        })
                      },
                      fail: function(res) {
                        console.debug(res)// fail
                      }
                    })
                }else{
                    wx.showModal({
                      title: '提示',
                      content: '请填写完整信息！',
                      success: function(res) {
                          that.setData({
                            focus:true
                          })
                      }
                  })
              }
            }
          }
      }
  },
})