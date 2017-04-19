var app    = getApp();
Page({
  data: {
    curNav: 0,
    product:[{'sta':'全部'},{'sta':'待审核'},{'sta':'已通过'},{'sta':'已拒绝'}],
    //搜索展开事件
    focus:false,
    showView:true,

    searchToggle: false,
    searchValue:'',
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
  onShow: function() {
    var that  = this,
        index = that.data.curNav
        wx.request({  
          url: 'http://192.168.0.115:5000/mlist/',
          data: {},
          method: 'GET', 
          success: function(res){
            that.setData({
              showData:res.data.data,
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
        focus:(!that.data.focus),
        showView:(!that.data.showView),
        searchToggle:false,
        searchValue:''
      })
      if(that.data.showView==true){
          that.setData({
            product:that.data.showData,
            list: that.data.showData[that.data.curNav],
            error:false
          })
      }
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
                  url: './corpDetail?id='+id,
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
                url: '../add/add',
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
                                var index = that.data.curNav
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
  oninput: function (e) {
    var that = this;
    var val = e.detail.value
    if (val && val != "") {
      wx.request({
        url: 'http://192.168.0.115:5000/mlist/?keyword=' + val + '',
        method: 'GET',
        success: function (res) {
          var content = res.data.ok;
          console.debug(content,111)
          if (content == true) {
            var arr = res.data.data
            that.setData({
              product: res.data.data,
              list: res.data.data[that.data.curNav],
              error: false,
            })
          } else {
            that.setData({
              error:true
            })
          }
        },
      })
    }else{
      that.setData({
        product:that.data.showData,
        list: that.data.showData[that.data.curNav],
        error:false
      })
    }
  },

})