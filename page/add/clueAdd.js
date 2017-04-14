var app     = getApp();
var common  = require('../../util/util.js');
var address_info = {
      "message": "success",
      "requestId": null,
      "success": true
    },
    detail_info  = {
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
    strike: ['选择地区', '打击', '无售假', '售假无打击'],
    index: 0,

    //添加图片
    imageList: [],
    sourceTypeIndex: 3,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 3,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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