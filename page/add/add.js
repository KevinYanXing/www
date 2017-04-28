var app = getApp();
//判断是否在数组
function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}  
//图片上传
var done = false
function sendPhotos(arr){
  if(arr.length != 0){
      wx.uploadFile({
        url: app.globalData.url+'/img/',
        filePath: arr[0],
        name: 'file',
        success: function(res){
          var rData = JSON.parse(res.data)
          if(rData.ok == true){
            var mTarget = wx.getStorageSync('mTarget')
            if(!mTarget){
              mTarget = {}
            }
            if(mTarget.imageName){
              mTarget.imageName.push(rData.filename)
            }else{
              mTarget.imageName = [rData.filename]
            }
            if(mTarget.prelationship){
                mTarget.prelationship.push([arr[0],rData.filename])
            }else{
                mTarget.prelationship = [[arr[0],rData.filename]]
            }
            wx.setStorageSync('mTarget', mTarget)
            arr.splice(0,1)
            sendPhotos(arr)
          }else{
            wx.showToast({
              title: '上传失败',
              image:'../../image/cw-ico.png',
              duration: 2000
          })
          }
        },
        fail:function(res){
          wx.showToast({
              title: '上传失败',
              image:'../../image/cw-ico.png',
              duration: 2000
          })
        },
    })
  }else{
     done = true
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
    //初始化数据
    var mTarget = wx.getStorageSync('mTarget')
    if(mTarget){
      this.setData({
        dTarget:mTarget,
        pname:mTarget.pname,
        ptype:mTarget.ptype,
        pstate:mTarget.pstate,
        pperson:mTarget.pperson,
        pmarket:mTarget.pmarket,
        plocation:mTarget.plocation,
        pcontact:mTarget.pcontact
      })
      if(mTarget.id){
        this.setData({
        imageList:mTarget.imageName,
      })
      }else{
        this.setData({
        imageList:mTarget.imageList
      })
      }
    }else{
      wx.setStorageSync('mTarget', {})
    }
    
  },
  //店铺名称
  pName:function(e){
    this.setData({
      pname: e.detail.value
    })
    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pname = e.detail.value
    wx.setStorageSync('mTarget', mTarget)
  },
  //性质选择
  pType: function(e) {
    this.setData({
      ptype: e.detail.value
    })
    var mTarget = wx.getStorageSync('mTarget')
    mTarget.ptype = e.detail.value
    wx.setStorageSync('mTarget', mTarget)
  },
  //售假情况
  pState: function(e) {
    this.setData({
      pstate: e.detail.value
    })
    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pstate = e.detail.value
    wx.setStorageSync('mTarget', mTarget)
  },
  //添加图片
  pPhoto: function(e) {
    var that = this
    wx.chooseImage({
      success: function (res) {
        var imageNew = res.tempFilePaths
        if(that.data.imageList && that.data.imageList.length!=0){
            imageNew = imageNew.concat(that.data.imageList)
        }
        that.setData({
          imageList:imageNew
        })
        var mTarget = wx.getStorageSync('mTarget')
        mTarget.imageList = imageNew
        wx.setStorageSync('mTarget', mTarget)
        }
    })
    
  },
  //图片预览/删除
  pPhotoedit: function(e) {
    var that = this
    var current = e.target.dataset.src
    wx.showActionSheet({
      itemList: ['预览','删除'],
      success: function (e) {
        if(e.tapIndex==0){
            wx.previewImage({
              current: current,
              urls: that.data.imageList
            })
        }else if(e.tapIndex==1){
          var newList = []
          for(var i=0;i<that.data.imageList.length;i++){
            if(that.data.imageList[i]!=current){
              newList.push(that.data.imageList[i])
            }
          }
          that.setData({
            imageList:newList
          })
          
          var mTarget = wx.getStorageSync('mTarget')
          mTarget.imageList = that.data.imageList
          if(mTarget.id){
              mTarget.imageList = that.data.imageList
              var pre = mTarget.prelationship
              for(var i=0;i<pre.length;i++){
                  if(pre[i][0]==current || pre[i][1]==current){
                    var newName = []
                    for(var j=0;j<mTarget.imageName.length;j++){
                      if(mTarget.imageName[j]!=pre[i][0] && mTarget.imageName[j]!=pre[i][1]){
                        newName.push(mTarget.imageName[j])
                      }
                    }
                    mTarget.imageName = newName
                  }
              }
          }
          wx.setStorageSync('mTarget', mTarget)
        }
        }
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
        //添加产品
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
                                wx.setStorageSync('mProduct',setPinfo)
                              wx.navigateTo({
                                url: './product/addProduct?rd=1',
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
        that.setData({
          plocation: res.address,
          pmarket:res.name
        })
        var mTarget = wx.getStorageSync('mTarget')
        mTarget.plocation = res.address
        mTarget.pmarket = res.name
        wx.setStorageSync('mTarget', mTarget)
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
    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pperson = e.detail.value
    wx.setStorageSync('mTarget', mTarget)
  },
  //联系方式
  pContact:function(e){
    this.setData({
      pcontact:e.detail.value
    })
    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pcontact = e.detail.value
    wx.setStorageSync('mTarget', mTarget)
  },
  //提交数据
  pConfirm: function(e) {
    var that = this
    var mTarget = wx.getStorageSync('mTarget')
    //确认填写名称
    if(!that.data.pname){
      wx.showModal({
          title: '提示',
          content: '请填写店铺名称',
          success: function(res) {
              that.setData({
                focus:true
              })
          }
      })
    }else{
        //上传图片
        var tempImage = that.data.imageList
        if(tempImage.length!=0){
             wx.showToast({
                title: '正在上传',
                icon: 'loading',
                duration: 100000
            })
            
            if(mTarget.id){
              var checkImageList = []
              var checkImageName = []
              for(var j=0;j<mTarget.prelationship.length;j++){
                    checkImageList.push(mTarget.prelationship[j][0])
                    checkImageName.push(mTarget.prelationship[j][1])
              }
              var uploadImage = []
                for(var i=0;i<tempImage.length;i++){
                    if(contains(checkImageList,tempImage[i]) || contains(checkImageName,tempImage[i])){

                    }else{
                      uploadImage.push(tempImage[i])
                    }
                } 
              tempImage = uploadImage
            }

            //异步上传图片
            sendPhotos(tempImage)
            //定时器（检查是否上传完成）
            var timer = setInterval(function checkUpload(){
              if(done==true){
                  mTarget = wx.getStorageSync('mTarget')
                  if(mTarget.imageName.length=0){
                      wx.showModal({
                        title: '提示',
                        content: '图片上传失败，请重新上传',
                        success: function(res) {
                            
                        }
                      })
                  }else{
                      var submitData = wx.getStorageSync('mTarget')
                      var uid = wx.getStorageSync('uid')
                      if(submitData){
                          var url = app.globalData.url+'/msave/?uid='+uid
                          if(submitData.id){
                            url = app.globalData.url+'/msave/?id='+submitData.id+'&uid='+uid
                          }
                          wx.request({
                            url: url,
                            data: {data:wx.getStorageSync('mTarget')},
                            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            // header: {}, // 设置请求的 header
                            success: function(res){
                              //清除缓存
                              wx.removeStorageSync('mTarget')
                              //跳转页面
                              app.globalData.corpFresh = true
                              wx.switchTab({
                                url: '../corp/corp',
                                success: function(res){
                                  wx.showToast({
                                      title: '保存成功',
                                      image:'../../image/cg-ico.png',
                                      duration: 2000
                                  })
                                },
                              })
                            },
                            fail: function(res) {
                              wx.showToast({
                                  title: '请求失败',
                                  image:'../../image/cw-ico.png',
                                  duration: 2000
                              })
                            }
                          })
                      }else{
                          wx.showModal({
                            title: '提示',
                            content: '请填写完整信息',
                            success: function(res) {
                                that.setData({
                                  focus:true
                                })
                            }
                        })
                    }
                  }
              }
              clearInterval(timer)
              },1000)
        }else{
            wx.showModal({
              title: '提示',
              content: '请先上传图片',
            })
          }
        
      }
  },
})