const app = getApp()

Page({
  data: {
  },

  userInfoHandler(data) {
    wx.BaaS.handleUserInfo(data).then(res => {
      if (data.currentTarget.id === 'newmeal') {
            wx.navigateTo({
              url: '/groups/new/new'
            })
      } else {
        wx.navigateTo({
          url: '/users/show/show'
        }),
          wx.showLoading({
            title: '加载中',
          }),
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
      }
    }, res => {
    })
  }
})
