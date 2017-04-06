var app = getApp();
var server = require('../../util/util');
Page({
  //转跳页面
  //添加： bindtap="tapSearch"
	tapSearch: function () {
		wx.navigateTo({url: 'content'});
	},
  //下拉菜单
  actionSheetTap: function () {
    wx.showActionSheet({
      itemList: ['扫码加购样', '录入列表'],
      success: function (e) {
        if(e.tapIndex==0){
          wx.navigateTo({url: '../add/add'});
        }else if(e.tapIndex==1){
          wx.navigateTo({url: '../list/list'});
        }
      }
    })
  },
  
	actionSheetTap2: function () {
    wx.showActionSheet({
      itemList: ['扫码加产品', '录入列表'],
      success: function (e) {
        if(e.tapIndex==0){
          wx.navigateTo({url: '../search/search'});
        }else if(e.tapIndex==1){
          wx.navigateTo({url: '../personal/personal'});
        }
      }
    })
  },

  actionSheetTap3: function () {
    wx.showActionSheet({
      itemList: ['扫码加清单', '录入列表'],
      success: function (e) {
        if(e.tapIndex==0){
          wx.navigateTo({url: '../contact/contact'});
        }else if(e.tapIndex==1){
          wx.navigateTo({url: '../detail/detail'});
        }
      }
    })
  },

  actionSheetTap4: function () {
    wx.showActionSheet({
      itemList: ['扫码加清单', '录入列表'],
      success: function (e) {
        if(e.tapIndex==0){
          wx.navigateTo({url: ''});
        }else if(e.tapIndex==1){
          wx.navigateTo({url: '../hotGoods/hotGoods'});
        }
      }
    })
  },
  

  

});


// "pagePath": "pages/logs/logs", 