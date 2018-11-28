const keys = require('/keys.js');
const QQMapWX = require('/libs/qqmap-wx-jssdk.js');
const qqMap = new QQMapWX({
  key: keys.qqMapKey 
});

App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('86e9cea993a138b9109a')

    wx.BaaS.login(false).then(res => {
      // 登录成功
    }, err => {
      // 登录失败
    })
  },
  globalData: {
    
  }
})
