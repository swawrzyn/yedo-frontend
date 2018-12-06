const app = getApp()

Page({
  data: {
  },

  userInfoHandler(data) {
    wx.showLoading({
      title: '加载中',
    })
    wx.BaaS.handleUserInfo(data).then(res => {
      if (data.currentTarget.id === 'newmeal') {
            wx.navigateTo({
              url: '/groups/new/new'
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
      } else {
        wx.navigateTo({
          url: '/users/show/show'
        }),
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
      }
    }, res => {
    })
  },
  onPageScroll: e => {
    if (e.scrollTop < 0){
      wx,pageScrollTo({
        scrollTop: 0
      })
    }
  } 
})
