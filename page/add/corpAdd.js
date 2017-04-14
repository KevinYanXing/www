var app     = getApp();
var common  = require('../../util/util.js');
var address_info = {
      "message": "success",
      "requestId": null,
      "success": true
    },
    detail_info  = {
      "code": 200,
      "requestId": "xxx",
      "data": {
        recipient: "小李",
        telephone: 12233445566,
        province: "北京市",
        city: "北京",
        area: "东城区",
        address: "区域",
        postCode: 10000,
        period: "2016-01-01",
        isDefault: 1,
      }
      ,
      "success": true,
      "message": "success"
    }

  //添加图片
  var sourceType = [ ['camera'], ['album'], ['camera', 'album'] ]
  var sizeType = [ ['compressed'], ['original'], ['compressed', 'original'] ]


Page({
  data: {
    //性质选择
    array: ['选择性质', '原料生产', '包装制作', '销售门市', '网店销售', '生产工厂', '批发商', '仓库'],
    index: 0,

    //打击情况
    strike: ['选择情况', '打击', '无售假', '售假无打击'],
    index: 0,

    //添加图片
    imageList: [],
    sourceTypeIndex: 3,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 3,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  

  
    address: {},
    isShow: 0,
  },

  //性质选择
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  //
  address: {},
  origin: {},
  maybeInfo: {},
  addrInfo: {},
  bindChange: function(e) {
    var self = this,
        val  = e.detail.value,
        obj  = new common.getAddress(self.address),
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
    self.maybeInfo = {
      province: addr.province[pid],
      city: addr.city[cid],
      area: addr.area[aid]
    }
  },
  onLoad: function(e) {
    var self     = this,
        edit     = e.id ? true : false;
    self.address = address_info.data;    //区域数据
    var a      = new common.getAddress(self.address);
    var detail = a.initObj();
    self.setData({
      province: detail.province,
      city: detail.city,
      area: detail.area
    });
    if(edit) {
      wx.setNavigationBarTitle({
        title: "编辑企业信息"
      });
      self.origin = {
        isEdit: true,
        id: e.id
      }
      self.setData({
        address: detail_info.data,
      })
    } else {
      var address = {
        isDefault: 0
      }
      self.origin = {
        isEdit: false,
        id: e.id
      }
      self.setData({
        address: address
      })
      wx.setNavigationBarTitle({
        title: "录入企业信息"
      });
    }
  },
  onShow: function() {

  },
  confirm: function() {
    var self    = this;
    var address = this.data.address;
    if(common.objLength(self.maybeInfo)) {
      self.addrInfo = self.maybeInfo;
    } else {
      self.addrInfo = {
        province: self.address[0].name,
        city: self.address[0].childrenList[0].name,
        area: self.address[0].childrenList[0].childrenList[0].name,
      }
    }
    address.province = self.addrInfo.province;
    address.city     = self.addrInfo.city;
    address.area     = self.addrInfo.area;
    self.setData({
      isShow: 0,
      address: address
    });
    self.maybeInfo = {};
  },
  hideMask: function() {
    var self = this;
    self.setData({
      isShow: 0
    })
  },
  setArea: function() {
    var self   = this;
    var a      = new common.getAddress(self.address);
    var detail = a.initObj();
    self.setData({
      province: detail.province,
      city: detail.city,
      area: detail.area,
      isShow: 1
    });
  },
  setDefault: function() {
    var self    = this,
        address = self.data.address;
    if(address.isDefault == 0) {
      address.isDefault = 1;
    } else {
      address.isDefault = 0;
    }
    self.setData({
      address: address
    });
  },
  setName: function(e) {
    var address       = this.data.address;
    address.recipient = e.detail.value;
    this.setData({
      address: address
    })
  },
  setPhone: function(e) {
    var address       = this.data.address;
    address.telephone = e.detail.value;
    this.setData({
      address: address
    })
  },
  setDetail: function(e) {
    var address     = this.data.address;
    address.address = e.detail.value;
    this.setData({
      address: address
    })
  },
  saveAddr: function() {
    wx.navigateBack({
      delta: 1
    })
  },

   //添加图片
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
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