var app    = getApp();
var common = require('../../util/util');
var detail = {
  data: [
    {

      title: "发现的线索",
      goodsList: [
        {
          goodsImg: "../../image/test4.jpg",
          sellPrice: "科技厅木克土卡科扎克地铁批发市场",
          goodsName: "发现品牌：",
          tagline: "太太乐 雀巢咖啡",
          addr: "线索地址：",
          address: "高科技贴囧减肥开服几点几分"
        },
       
      ]
    },
    {
      title: "指派的线索",
      goodsList: [
        {
           goodsImg: "../../image/test4.jpg",
          sellPrice: "科技厅木克土卡科扎克地铁批发市场",
          goodsName: "发现品牌：",
          tagline: "太太乐 雀巢咖啡",
          addr: "线索地址：",
          address: "高科技贴囧减肥开服几点几分"
        },{
          goodsImg: "../../image/test4.jpg",
          sellPrice: "科技厅木克土卡科扎克地铁批发市场",
          goodsName: "发现品牌：",
          tagline: "太太乐 雀巢咖啡",
          addr: "线索地址：",
          address: "高科技贴囧减肥开服几点几分"
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