var app = getApp();
var server = require('../../util/util');

Page({
  
  //转跳页面
  //添加： bindtap="tapSearch"
	tapSearch: function () {
		wx.navigateTo({url: 'content'});
	},
  //下拉菜单
  onLoad:function(options){
   console.debug(app.globalData)
 },
  actionSheetTap: function () {
      wx.navigateTo({url: '../add/add'});
  },
  
	actionSheetTap2: function () {
      wx.navigateTo({url: '../add/add'});
  },
  

});


// "pagePath": "pages/logs/logs", 