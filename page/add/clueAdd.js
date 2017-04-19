var app = getApp();
var common  = require('../../util/util.js');
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
        url: 'http://192.168.0.115:5000/img/',
        filePath: arr[0],
        name: 'file',
        success: function(res){
          var rData = JSON.parse(res.data)
          if(rData.ok == true){
            var cTarget = wx.getStorageSync('cTarget')
            if(!cTarget){
              cTarget = {}
            }
            if(cTarget.imageName){
              cTarget.imageName.push(rData.filename)
            }else{
              cTarget.imageName = [rData.filename]
            }
            if(cTarget.crelationship){
                cTarget.crelationship.push([arr[0],rData.filename])
            }else{
                cTarget.crelationship = [[arr[0],rData.filename]]
            }
            
            wx.setStorageSync('cTarget', cTarget)
            arr.splice(0,1)
            sendPhotos(arr)
          }else{
            console.debug(111111)
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
    //性质选择
    carray: ['选择性质', '原料生产', '包装制作', '销售门市', '网店销售', '生产工厂', '批发商', '仓库'],
    ctype: 0,

    //添加图片
    imageList: [],
    countIndex: 3,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    //城市选择
    ccity:{},
    isShow: 0,

    //名称
    cname:'',
    cperson:'',
    ccontact:'',
    cdescripe:'',
    imageList:[],

    cproduct:[],
    bSelected:[]
  },

  //地区所需数组
  address: {},
  maybeInfo: {},
  addrInfo: {},

  onShow:function(){
    var that = this
    //初始化数据
    var cTarget = wx.getStorageSync('cTarget')
      that.setData({
        bSelected:cTarget.bSelected,
        cname:cTarget.cname,
        ctype:cTarget.ctype,
        cperson:cTarget.cperson,
        clocation:cTarget.clocation,
        ccontact:cTarget.ccontact,
        ccity:cTarget.ccity,
        cdescripe:cTarget.cdescripe,
        cproduct:cTarget.cproduct
      })
      if(cTarget.id){
        that.setData({
        imageList:cTarget.imageName,
      })
      }else{
        that.setData({
        imageList:cTarget.imageList
      })
      }
    //地区初始化
    var areaList = wx.getStorageSync('areaList')
    if(areaList){
      that.address = areaList
    }else{
      wx.request({
        url: 'http://192.168.0.115:5000/arealist/',
        data: {},
        method: 'GET', 
        success: function(res){
          that.address = res.data.data;
        },
        fail: function(res) {
          wx.showToast({
              title: '请求失败',
              image:'../../image/cw-ico.png',
              duration: 2000
          })
        },
      })
    }

  },

  //地区选择
  bindChange: function(e) {
    var that = this,
        val  = e.detail.value,
        obj  = new common.getAddress(that.address),
        pid  = val[0],
        cid  = val[1],
        aid  = val[2];
    obj.initObj();
    var addr = obj.setCity(pid, cid);
    this.setData({
      province: addr.province,
      city: addr.city,
      area: addr.area
    });
    that.maybeInfo = {
      province: addr.province[pid],
      city: addr.city[cid],
      area: addr.area[aid]
    }
  },
  //地区确定
  aConfirm: function() {
    var that    = this;
    if(this.data.ccity){
      var address = this.data.ccity;
    }else{
      var address = {}
    }
    
    if(common.objLength(that.maybeInfo)) {
      that.addrInfo = that.maybeInfo;
    } else {
      that.addrInfo = {
        province: that.address[0].name,
        city: that.address[0].childrenList[0].name,
        area: that.address[0].childrenList[0].childrenList[0].name,
      }
    }
    address.province = that.addrInfo.province;
    address.city = that.addrInfo.city;
    address.area = that.addrInfo.area;
    that.setData({
      isShow: 0,
      ccity: address
    });
    that.maybeInfo = {};
    var cTarget = wx.getStorageSync('cTarget')
    cTarget.ccity = that.data.ccity
    wx.setStorageSync('cTarget', cTarget)
  },
  //选择地区的遮罩
  hideMask: function() {
    var that = this;
    that.setData({
      isShow: 0
    })
  },
  //设置地区
  cArea: function() {
    var that   = this;
    var a = new common.getAddress(that.address);
    var detail = a.initObj();
    console.debug(detail)
    that.setData({
      province: detail.province,
      city: detail.city,
      area: detail.area,
      isShow: 1
    });
  },
  //品种选择
  bSelect:function(e){
      wx.navigateBack({
        delta: 1
      })
  },
  cName:function(e){
      this.setData({
      cname: e.detail.value
    })
    var cTarget = wx.getStorageSync('cTarget')
    cTarget.cname = e.detail.value
    wx.setStorageSync('cTarget', cTarget)
  },
  cPerson:function(e){
      this.setData({
      cperson: e.detail.value
    })
    var cTarget = wx.getStorageSync('cTarget')
    cTarget.cperson = e.detail.value
    wx.setStorageSync('cTarget', cTarget)
  },
  cContact:function(e){
      this.setData({
      ccontact: e.detail.value
    })
    var cTarget = wx.getStorageSync('cTarget')
    cTarget.ccontact = e.detail.value
    wx.setStorageSync('cTarget', cTarget)
  },
  cType:function(e){
      this.setData({
      ctype: e.detail.value
    })
    var cTarget = wx.getStorageSync('cTarget')
    cTarget.ctype = e.detail.value
    wx.setStorageSync('cTarget', cTarget)
  },
  //添加图片
  cPhoto: function(e) {
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
        var cTarget = wx.getStorageSync('cTarget')
        cTarget.imageList = imageNew
        wx.setStorageSync('cTarget', cTarget)
        }
    })
    
  },
  //图片预览/删除
  cPhotoedit: function(e) {
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
          
          var cTarget = wx.getStorageSync('cTarget')
          cTarget.imageList = that.data.imageList
          if(cTarget.id){
              cTarget.imageList = that.data.imageList
              var pre = cTarget.crelationship
              for(var i=0;i<pre.length;i++){
                  if(pre[i][0]==current || pre[i][1]==current){
                    var newName = []
                    for(var j=0;j<cTarget.imageName.length;j++){
                      if(cTarget.imageName[j]!=pre[i][0] && cTarget.imageName[j]!=pre[i][1]){
                        newName.push(cTarget.imageName[j])
                      }
                    }
                    cTarget.imageName = newName
                  }
              }
          }
          wx.setStorageSync('cTarget', cTarget)
        }
        }
      })
  },
  cDescripe:function(e){
    this.setData({
      cdescripe: e.detail.value
    })
    var cTarget = wx.getStorageSync('cTarget')
    cTarget.cdescripe = e.detail.value
    console.debug(cTarget.cdescripe)
    wx.setStorageSync('cTarget', cTarget)
  },
  cProduct:function(){
    wx.navigateTo({
      url: './product/cproduct',
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
  delProduct:function(e){
    var that = this
    var id = e.currentTarget.id
    console.debug(id)
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (e) {
        if(e.tapIndex==0){
          
            var cTarget = wx.getStorageSync('cTarget')
            cTarget.cproduct.splice(id,1)
            console.debug(cTarget.cproduct)
            that.setData({
              cproduct:cTarget.cproduct
            })
            wx.setStorageSync('cTarget', cTarget)
        }
      }
    })
    
  },
  cConfirm:function(){
    var that = this
    var cTarget = wx.getStorageSync('cTarget')
    //确认填写名称
    if(!that.data.cname){
      wx.showModal({
          title: '提示',
          content: '请填写目标名称',
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
            
            if(cTarget.id){
              var checkImageList = []
              var checkImageName = []
              for(var j=0;j<cTarget.crelationship.length;j++){
                    checkImageList.push(cTarget.crelationship[j][0])
                    checkImageName.push(cTarget.crelationship[j][1])
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
                  cTarget = wx.getStorageSync('cTarget')
                  if(cTarget.imageName.length=0){
                      wx.showModal({
                        title: '提示',
                        content: '图片上传失败，请重新上传'
                      })
                  }else{
                      var submitData = wx.getStorageSync('cTarget')
                      if(submitData){
                          var url = 'http://192.168.0.115:5000/csave/'
                          if(submitData.id){
                            url = 'http://192.168.0.115:5000/csave/?id='+submitData.id
                          }
                          wx.request({
                            url: url,
                            data: {data:wx.getStorageSync('cTarget')},
                            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            // header: {}, // 设置请求的 header
                            success: function(res){
                              //清除缓存
                              wx.removeStorageSync('cTarget')
                              //跳转页面
                              wx.switchTab({
                                url: '../clue/clue',
                                success: function(res){
                                  wx.showToast({
                                      title: '保存成功',
                                      image:'../../image/cg-ico.png',
                                      duration: 2000
                                  })
                                }
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
              content: '请先上传图片'
            })
          }
        
      }
  }

})