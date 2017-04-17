var app    = getApp();
Page({
  data: {
    curNav: "0",
    product:[{'sta':'发现的线索'},{'sta':'指派的线索'}],
    //搜索展开事件
    showView:true,
    searchValue:''
    //搜索展开事件 end
  },
  onShow:function(){

  },
  switchTab: function(e) {
    var that  = this,
        index = e.currentTarget.dataset.index,
        info = that.data.product[index];
      that.setData({
        list: info,
        curNav: index,
      });
  },
  onLoad: function() {
    
  },
  onShow: function() {
    var that  = this,
        index = 0
    wx.request({
      url: 'http://192.168.0.115:5000/mlist/',
      data: {},
      method: 'GET', 
      success: function(res){
        that.setData({
          product: res.data.data,
          list: res.data.data[index],
        })
      },
      fail: function(res) {
        console.debug(res)
      },
    })
  },
  //搜索展开事件
  onChangeShowState:function(){
      var that=this;
      that.setData({
        showView:(!that.data.showView),
        searchValue:''
      })
  },
  //搜索展开事件 end
  selected: function(e) {
      var that = this
      var id = e.currentTarget.id
      var idx = e.currentTarget.dataset.value
      wx.showActionSheet({
          itemList: ['查看','编辑','删除'],
          success: function (e) {
            if(e.tapIndex==0){
                wx.navigateTo({
                  url: './clueDetail?id='+id,
                  success: function(res){
                    console.debug(res)
                  },
                  fail: function(res) {
                    console.debug(res)
                  },
                })
            }else if(e.tapIndex==1){
              wx.setStorageSync('mTarget', that.data.list.minfo[idx])
              wx.navigateTo({
                url: '../add/clueAdd',
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

            }else if(e.tapIndex==2){
                wx.showModal({
                    title: '警告',
                    content: '您确定要删除这条记录吗？删除后无法恢复！',
                    success: function(res) {
                      if (res.confirm) {
                          wx.request({
                            url: 'http://192.168.0.115:5000/mdel/'+ id +'/',
                            data: {},
                            method: 'GET',
                            success: function(res){ 
                                that.data.list.minfo.splice(idx,1)
                                that.setData({
                                  list:that.data.list
                                })
                                wx.showToast({
                                  title: '删除成功!',
                                  icon: 'success',
                                  duration: 2000
                              })
                            },
                            fail: function(res) {
                               wx.showToast({
                                  title: '请求失败!',
                                  icon: 'loading',
                                  duration: 2000
                              })
                            }
                          })
                      }
                    }
                })
            }
          }
        })
  },

})