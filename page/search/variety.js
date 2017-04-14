 var app = getApp() 

Page({  
  data: {  

  },  
  onLoad: function() {  
    var that = this;  
  },  

// 加载
  onLoad: function () {
    wx.setNavigationBarTitle({
        title: ' '
    })
    var that = this
    //品种
      that.setData({
         name:[
          {"title":"雀巢",},
        ]
      }),

      that.setData({
         variety:[
          {"title":"太太乐"},
          {"title":"雀巢咖啡"},
          {"title":"雀巢奶粉"},
          {"title":"美极鲜"},
          {"title":"三花"},
          {"title":"宠优冠能"},
          {"title":"妙乐多"},
          {"title":"康多乐"},
        ]
      })

  }, 

})
