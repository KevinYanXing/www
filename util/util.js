var app = getApp()
function checkExpire(uid) {
  var done1 = false
  var done2 = false
  var re_uid = null
  wx.request({
    url: app.globalData.url+'/check_expire/'+uid+'/',
    method: 'GET',
    success: function(res){
      if(res.data.ok==true){
        var re_uid = uid
        done = true
      }
      else{
        wx.login({
          success: function(res){
            wx.request({
              url: app.globalData.url+ '/wxlogin/?code=' + res.code,
              method: 'GET', 
              success: function(res){
                  wx.setStorageSync('uid', res.data.uid)
                  var re_uid=res.data.uid
              },complete:function(){
                done2 = true
              }
            })
          }
        })
      }
    },complete:function(){
      done1 = true
    }
  })
  var timer = setInterval(function checkUpload(){
    if(done1&&done2){
      clearInterval(timer)
      console.debug(re_uid)
      return re_uid
    }
  },1000)
}
function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 
module.exports = {
  checkExpire: checkExpire,
  contains:contains
}