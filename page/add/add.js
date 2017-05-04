var app = getApp();
var util = require('../../util/util.js')
var checkExpire = util.checkExpire
var contains = util.contains
var loadAddress = util.loadAddress
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
    strike: ['选择情况', '售假', '无售假'],
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

    dTarget:{},

    showView:true,
    psweep:1,

  },
  onShow:function(){
    //初始化数据
    var that = this
    var mTarget = wx.getStorageSync('mTarget')
    console.debug(mTarget)
    if(mTarget){
      if(mTarget.pzinfo){
        that.setData({
          pzinfo:mTarget.pzinfo
        })  
      }else{
        wx.setStorageSync('zInfo', {})
      }
      that.setData({
        dTarget:mTarget,
        pname:mTarget.pname,
        ptype:mTarget.ptype,
        pstate:mTarget.pstate,
        pperson:mTarget.pperson,
        pmarket:mTarget.pmarket,
        plocation:mTarget.plocation,
        pcontact:mTarget.pcontact,
        psweep:mTarget.psweep,
      })
      if(mTarget.id){
        that.setData({
        imageList:mTarget.imageName,
      })
      }else if(mTarget.imageList){
        that.setData({
        imageList:mTarget.imageList
      })
      }
    }else{
      if(wx.getStorageSync('zInfo')){
        that.setData({
          pzinfo:mTarget.pzinfo
        })
      }else{
        wx.setStorageSync('zInfo', {})  
      }
      wx.setStorageSync('mTarget', {'psweep':1})
    }
  },
  onChangeShowState:function(){
      var that=this;
      that.setData({
        showView:(!that.data.showView)
      })
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
  //市场名称、所在地区
  pMarket:function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        wx.request({ 
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=dFzXvFYNosKSGxAV9G6nsCHk1OSf5U9V&location='+res.latitude+','+res.longitude+'&output=json', 
          data: {}, 
          header:{ 
            'Content-Type':'application/json'
          }, 
          success: function(res){
            var province=res.data.result.addressComponent.province;
            var city=res.data.result.addressComponent.city;
            var district=res.data.result.addressComponent.district;
            that.setData({
              plocation:province+'/'+city+'/'+district
            })
            var mTarget = wx.getStorageSync('mTarget')
            mTarget.plocation = province+'/'+city+'/'+district
            wx.setStorageSync('mTarget', mTarget)
          }
        })
        that.setData({
          pmarket:res.name,
        })
        var mTarget = wx.getStorageSync('mTarget')
        mTarget.pmarket = res.name
        wx.setStorageSync('mTarget', mTarget)
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
  //是否清扫
  pSweep:function(e){
    var that = this
    that.setData({
      psweep:that.data.psweep==1?2:1
    })
    var mTarget = wx.getStorageSync('mTarget')
    mTarget.psweep = that.data.psweep
    wx.setStorageSync('mTarget', mTarget)
  },
  //执法时间
  zTime:function(e){
    var zInfo = wx.getStorageSync('zInfo')
    zInfo.ztime = e.detail.value
    wx.setStorageSync('zInfo', zInfo)

    this.setData({
      pzinfo:zInfo
    })

    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pzinfo = zInfo
    wx.setStorageSync('mTarget', mTarget)
  },
  //执法部门
  zDepart:function(e){
    var zInfo = wx.getStorageSync('zInfo')
    zInfo.zdepart = e.detail.value
    wx.setStorageSync('zInfo', zInfo)

    this.setData({
      pzinfo:zInfo
    })

    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pzinfo = zInfo
    wx.setStorageSync('mTarget', mTarget)
  },
  //执法负责人
  zPerson:function(e){
    var zInfo = wx.getStorageSync('zInfo')
    zInfo.zperson = e.detail.value
    wx.setStorageSync('zInfo', zInfo)

    this.setData({
      pzinfo:zInfo
    })

    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pzinfo = zInfo
    wx.setStorageSync('mTarget', mTarget)
  },
  //执法负责人职务
  zPosition:function(e){
    var zInfo = wx.getStorageSync('zInfo')
    zInfo.zposition = e.detail.value
    wx.setStorageSync('zInfo', zInfo)

    this.setData({
      pzinfo:zInfo
    })

    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pzinfo = zInfo
    wx.setStorageSync('mTarget', mTarget)
  },
  //执法负责人手机
  zPhone:function(e){
    
    var zInfo = wx.getStorageSync('zInfo')
    zInfo.zphone = e.detail.value
    wx.setStorageSync('zInfo', zInfo)

    this.setData({
      pzinfo:zInfo
    })

    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pzinfo = zInfo
    wx.setStorageSync('mTarget', mTarget)
  },
  //执法地址
  zLocs:function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        wx.request({ 
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=dFzXvFYNosKSGxAV9G6nsCHk1OSf5U9V&location='+res.latitude+','+res.longitude+'&output=json', 
          data: {}, 
          header:{ 
            'Content-Type':'application/json'
          }, 
          success: function(res){
            var province=res.data.result.addressComponent.province;
            var city=res.data.result.addressComponent.city;
            var district=res.data.result.addressComponent.district;

            var zInfo = wx.getStorageSync('zInfo')
            zInfo.zloc = province+'/'+city+'/'+district
            wx.setStorageSync('zInfo', zInfo)

            that.setData({
              pzinfo:zInfo
            })
            var mTarget = wx.getStorageSync('mTarget')
            mTarget.pzinfo = zInfo
            wx.setStorageSync('mTarget', mTarget)
            
          }
        })
        var zInfo = wx.getStorageSync('zInfo')
        zInfo.zlocs = res.address
        wx.setStorageSync('zInfo', zInfo)

        that.setData({
          pzinfo:zInfo
        })
        var mTarget = wx.getStorageSync('mTarget')
        mTarget.pzinfo = zInfo
        wx.setStorageSync('mTarget', mTarget)
      }
    })
  },
  //执法描述
  zDesc:function(e){
    var zInfo = wx.getStorageSync('zInfo')
    zInfo.zdesc = e.detail.value
    wx.setStorageSync('zInfo', zInfo)

    this.setData({
      pzinfo:zInfo
    })

    var mTarget = wx.getStorageSync('mTarget')
    mTarget.pzinfo = zInfo
    wx.setStorageSync('mTarget', mTarget)
  },
  //扫码
  pProduct: function() {
    var mTarget = wx.getStorageSync('mTarget')
    if(mTarget.pproduct){
        wx.navigateTo({
          url: 'product/product'
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
                      wx.showLoading({
                        title:'加载中'
                      })
                      wx.request({
                          url: app.globalData.url+'/plist/?keyword='+code,
                          method: 'GET', 
                          success: function(res){
                            var content = res.data.ok;
                            if (content == true) {
                              wx.hideLoading()
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
                                  url: './product/addProduct?rd=1'
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
                                title: '扫描失败',
                                image:'../../image/cw-ico.png',
                                duration: 2000
                            })
                          }
                      })
                    },
                    fail: function() {
                        wx.showToast({
                              title: '扫描失败',
                              image:'../../image/cw-ico.png',
                              duration: 2000
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
  //提交数据
  pConfirm: function(e) {
    var that = this
    var mTarget = wx.getStorageSync('mTarget')
    console.debug(mTarget)
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
                        content: '图片上传失败，请重新上传'
                      })
                  }else{
                      
                      var submitData = wx.getStorageSync('mTarget')
                      if(submitData){
                          wx.showLoading({
                            title:'正在上传'
                          })
                          var uid = wx.getStorageSync('uid')
                          wx.request({
                            url: app.globalData.url+'/check_expire/'+uid+'/',
                            method: 'GET',
                            success: function(res){
                              if(res.data.ok==true){
                                  var url = app.globalData.url+'/msave/?uid='+uid
                                  if(submitData.id){
                                    url = app.globalData.url+'/msave/?id='+submitData.id+'&uid='+uid
                                  }
                                  wx.request({
                                    url: url,
                                    data: {data:wx.getStorageSync('mTarget')},
                                    method: 'GET', 
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
                                          title: '上传失败',
                                          image:'../../image/cw-ico.png',
                                          duration: 2000
                                      })
                                    }
                                  })
                              }
                              else{
                                wx.showModal({
                                    title: '提示',
                                    content: '身份验证已过期，请重新载入',
                                    complete: function(res) {
                                        app.globalData.indexFresh == true
                                        wx.switchTab({
                                          url: '../index/index',
                                        })
                                    }
                                })
                              }
                            },
                            fail:function(){
                                wx.showToast({
                                    title: '上传失败',
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