//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
  },

  userInfoHandler(data) {
    console.log(data);
    wx.BaaS.handleUserInfo(data).then(res => {
      if (data.currentTarget.id === 'newmeal') {
            wx.navigateTo({
              url: '/choices/new/new'
            })
      } else {
        wx.navigateTo({
          url: '/users/show/show'
        })
      }
    }, res => {
    })
  }
})
