var app = getApp();
var common  = require('../../util/util.js');
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
            if(cTarget.prelationship){
                cTarget.prelationship.push([arr[0],rData.filename])
            }else{
                cTarget.prelationship = [[arr[0],rData.filename]]
            }
            
            wx.setStorageSync('cTarget', cTarget)
            arr.splice(0,1)
            sendPhotos(arr)
          }else{
            console.debug(111111)
          }
          
        },
        fail:function(res){
          console.debug(res)
        },
        complete:function(res){
          console.debug(res)
        }
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
    imageList:[],

    bSelected:[]
  },

  //地区所需数组
  address: {},
  maybeInfo: {},
  addrInfo: {},

  onLoad:function(){
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
        ccity:cTarget.ccity
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
          console.debug(res)
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
  confirm: function() {
    var that    = this;
    var address = this.data.ccity;
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
    address.city     = that.addrInfo.city;
    address.area     = that.addrInfo.area;
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
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }


})