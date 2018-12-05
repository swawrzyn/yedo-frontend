const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
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
        })
      }
    }, res => {
    })
  }
})
