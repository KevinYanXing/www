var app    = getApp();
var common = require('../../util/util');
var detail = {
  data: [
    {

      title: "全部",
      goodsList: [
        {
          goodsImg: "../../image/test4.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "科技厅木克土卡科扎克地铁批发市场",
          tagline: "行政案件",
          time: "时间：",
          TimeDate: "20173-15",
          addr: "地址：",
          address: "高科技贴囧减肥开服几点几分"
        },
        {
          goodsImg: "../../image/test3.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "苦瓜酒头陀客单价批发市场",
          tagline: "行政案件",
          time: "时间：",
          TimeDate: "20173-15",
          addr: "地址：",
          address: "高科技贴囧减肥开服几点几分"
        },{
          goodsImg: "../../image/test1.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "客家土楼旧货市场",
          tagline: "行政案件",
          time: "时间：",
          TimeDate: "20173-15",
          addr: "地址：",
          address: "高科技贴囧减肥开服几点几分"
        },
        {
          goodsImg: "../../image/test1.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "小黑天鹅贸易中心市场",
          tagline: "行政案件",
          time: "时间：",
          TimeDate: "20173-15",
          addr: "地址：",
          address: "高科技贴囧减肥开服几点几分"
        },
        {
          goodsImg: "../../image/test1.jpg",
          goodsName: "类型：",
          oldPrice: "299",
          sellPrice: "开关机批发市场",
          tagline: "行政案件",
          time: "时间：",
          TimeDate: "20173-15",
          addr: "地址：",
          address: "高科技贴囧减肥开服几点几分"
        }
      ]
    },
    {
      title: "类型",
      goodsList: [
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
      goodsList: [
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