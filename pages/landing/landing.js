// pages/landing/landing.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    this.setData({
      mealId: options.meal_id
    });
    this.checkUserMealStatus(this);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    const app = getApp();

    app.globalData.tempMeal = null;
    if (app.globalData.scene == 0) {
      app.globalData.scene = 1;

      this.setData({
        mealId: null
      })
      this.onLoad();
    }


    
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    app.globalData.scene -= 1;
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  checkUserMealStatus: function (page) {
    //checking if user has created any choices for given meal_id passed in parameters
    const ChoicesTable = new wx.BaaS.TableObject('choices' + app.globalData.database);
    let userQuery = new wx.BaaS.Query();
    let mealQuery = new wx.BaaS.Query();
    userQuery.compare('created_by', '=', wx.BaaS.storage.get('uid'));
    mealQuery.compare('meal_id', '=', page.data.mealId);
    const andQuery = wx.BaaS.Query.and(userQuery, mealQuery);

    ChoicesTable.setQuery(andQuery).find().then(res => {
      console.log(res)
      if (!(res.data.objects.length === 0)) {
        wx.redirectTo({
          url: `/groups/show/show?id=${page.data.mealId}`,
        })
      } else {
        wx.redirectTo({
          url: `/choices/new/new?group_id=${page.data.mealId}`,
        })
      }
    })
  }
})