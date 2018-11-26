//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
  },

  toNewMeal: () => {
    wx.navigateTo({
      url: '/groups/new/new'
    })
  }
})
