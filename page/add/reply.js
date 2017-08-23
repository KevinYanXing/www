var app = getApp();
var util = require('../../util/util.js')
var contains = util.contains

function sendPhotos(arr, cb){
  if(arr.length != 0){
      wx.uploadFile({
        url: app.globalData.url+'/img/',
        filePath: arr[0],
        name: 'file',
        success: function(res){
          console.debug('finish one')
          var rData = JSON.parse(res.data)
          var imageName = wx.getStorageSync('mImage')
          if(imageName && imageName.length>0){
            imageName.push(rData.filename)
          }else{  
            var imageName = [rData.filename]
          }
          wx.setStorageSync('mImage', imageName)
          arr.splice(0,1) 
          sendPhotos(arr, cb)
        },
        fail:function(res){
          wx.showToast({
              title: '上传失败',
              image:'../../image/cw-ico.png',
              duration: 2000
          })
        },
    })
  }else{ 
    cb()
  }
}
Page({
  data:{
    imageList:[],
    imageName:[]
  },
  onLoad:function(options){
    this.setData({
      id : options.id
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  pReply:function(e){
    console.debug(e.detail.value)
    this.data.preply = e.detail.value
  },
  pPhoto: function(e) {
    var that = this
    wx.chooseImage({
      success: function (res) {
        var imageNew = res.tempFilePaths
        var imageList = that.data.imageList 
        for(var i=0;i<imageNew.length;i++){
            if(contains(imageList,imageNew[i])){

            }else{
              imageList.push(imageNew[i])  
            }
        }
        that.setData({
          imageList:imageList
        })
        }
    })
  },
  pPhotoedit: function(e) {
    var that = this
    var current = e.target.dataset.src
    wx.showActionSheet({
      itemList: ['预览','删除'],
      success: function (e) {
        if(e.tapIndex==0){
            wx.previewImage({
              current: current,
              urls: that.data.imageList
            })
        }else if(e.tapIndex==1){
          var newList = []
          for(var i=0;i<that.data.imageList.length;i++){
            if(that.data.imageList[i]!=current){
              newList.push(that.data.imageList[i])
            }else{
              console.debug(current)
            }
          }
          that.setData({
            imageList:newList
          })
        }
        }
      })
  },
  confirm:function(e){
    var fid = e.detail.formId
    var that = this
    if(that.data.preply){
      wx.showToast({
              title: '正在上传',
              icon: 'loading',
              duration: 100000
          })
      var tempImage = that.data.imageList
      
      //异步上传图片
      sendPhotos(tempImage, function checkUpload(){
        
          var imageName = wx.getStorageSync('mImage')
          if(imageName.length>0){
              wx.removeStorageSync('mImage')
              that.setData({
                imageName:imageName
              })
            }
            if(that.data.imageList.length!=0 && that.data.imageName.length==0){
                wx.showModal({
                  title: '提示',
                  content: '图片上传失败，请重新上传'
                })
            }else{
              wx.request({
                url: app.globalData.url+'/mreply/'+ that.data.id + '/',
                data:{'descs':that.data.preply,'photo':that.data.imageName,'fid':fid},
                method: 'GET',
                success: function(res){
                  wx.showToast({
                      title: '提交成功',
                      image:'../../image/cg-ico.png',
                      duration: 1000
                  })
                  wx.navigateBack({delta: 1})
                  
                },
                fail: function() {
                  wx.showToast({
                      title: '请求失败',
                      image:'../../image/cw-ico.png',
                      duration: 1000
                  })
                }
              })
            } 
      })
        // wx.showLoading({
        //   title:'正在上传'
        // })
    
      
    }else{
      wx.showModal({
          title: '提示',
          content: '请填写回复内容'
      })
    }
  }
})