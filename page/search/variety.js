var app = getApp()
var util = require('../../util/util.js')
var checkExpire = util.checkExpire
var contains = util.contains 

Page({  
  data: {  
    lightList:[]
  },  
  onLoad: function () {
    var that = this
    var bSelect = wx.getStorageSync('bSelect')
    if(bSelect){
      that.setData({
          brandInfo:bSelect
        })
    }else{
      wx.showLoading({
        title:'加载中'
      })
      wx.request({
        url: app.globalData.url+'/blist/',
        data: {},
        method: 'GET', 
        success: function(res){
          that.setData({
            netError:false
          })
          wx.hideLoading()
          console.debug(res)
          var content = res.data.ok
          var cData = res.data.data
          if(content==true){
            var cTarget = wx.getStorageSync('cTarget')
            if(cTarget.id){
              for(var i=0;i<cData.length;i++){
                for(var j=0;j<cData[i].brand.length;j++){
                  for(var k=0;k<cTarget.bSelected.length;k++){
                    if(cTarget.bSelected[k].id==cData[i].brand[j].id){
                      cData[i].brand[j].show = true
                    }
                  }
                }
              }
            }
            that.setData({
              brandInfo:cData
            })
          }else{
              brandInfo:[]
          }
        },
        fail: function() {
          tht.setData({
            netError:true
          })
        },
      })
    }
      
  }, 
  selectBrand:function(e){
    var id = e.currentTarget.id
    var bInfo = this.data.brandInfo
    var bSelected = []
    for(var i=0;i<bInfo.length;i++){
      for(var j=0;j<bInfo[i].brand.length;j++){
        if(bInfo[i].brand[j].id==id){
          bInfo[i].brand[j].show = !bInfo[i].brand[j].show
        }
        if(bInfo[i].brand[j].show==true){
          bSelected.push(bInfo[i].brand[j])
        }
      }
    }
    var cTarget = wx.getStorageSync('cTarget')
    if(cTarget){
      cTarget.bSelected = bSelected
    }else{
      cTarget = {}
      cTarget.bSelected = bSelected
    }
    wx.setStorageSync('cTarget', cTarget)
    wx.setStorageSync('bSelect', bInfo)
    this.setData({
      brandInfo:bInfo
    })
  },
  nextStep:function(){
    var cTarget = wx.getStorageSync('cTarget')
    if(cTarget && cTarget.bSelected.length>0){
      wx.navigateTo({url: '../add/clueAdd'})
    }else{
      wx.showModal({
            title: '提示',
            content: '请先选择品种'
        })
    }
  },
  onPullDownRefresh: function(){
    wx.showLoading({
        title:'加载中'
      })
      wx.request({
        url: app.globalData.url+'/blist/',
        data: {},
        method: 'GET', 
        success: function(res){
          tht.setData({
            netError:false
          })
          wx.hiedLoading()
          var content = res.data.ok
          if(content==true){
            that.setData({
              brandInfo:res.data.data
            })
          }else{
              brandInfo:[]
          }
        },
        fail: function() {
          tht.setData({
            netError:true
          })
        },
      })
    wx.stopPullDownRefresh()
  }
})
