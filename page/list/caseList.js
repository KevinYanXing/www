var app    = getApp();
var common = require('../../util/util');
var detail = {
  data: [
    {
      title: "全部",
      caseList: [
        {
          goodsName: "类型：",
          sellPrice: "科技厅木克土卡科扎克地铁批发市场",
          tagline: "行政案件",
          time: "时间：",
          TimeDate: "20173-15",
          addr: "地区：",
          address: "广州省广州市"
        }
      ]
    },
    {
      title: "类型",
      caseList: [
        {
          goodsImg: "../../image/test5.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "广州市天天市场5",
          tagline: "行政案件",
        },{
          goodsImg: "../../image/test2.jpg",
          goodsName: "类型：",
          sellPrice: "深圳市天天市场",
          tagline: "行政案件",
          time: "时间：",
          TimeDate: "20173-15",
          addr: "地址：",
          address: "高科技贴囧减肥开服几点几分"
        },
      ]
    },
    {
      title: "未完成",
      caseList: [
        {
          goodsImg: "../../image/test5.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "广州市天天市场5",
          tagline: "刑事案件",
        },{
          goodsImg: "../../image/test2.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "深圳市天天市场",
          tagline: "刑事案件",
        },
      ]
    }

  ]
}
Page({
  data: {
    curNav: "0"
  },
  switchTab: function(e) {
    var self  = this,
        index = e.currentTarget.dataset.index,
        info = detail.data[index];
      self.setData({
        list: info,
        curNav: index,
      });
  },
  onLoad: function() {
    var self  = this,
        index = 0,
        info = detail.data;
    self.setData({
      product: info,
      list: info[index],
    });
  },
  onShow: function() {
  },
  getDetail: function(e) {
    var data       = e.currentTarget.dataset.value;
  }



})