

Page({

  /**
   * Page initial data
   */
  data: {
    meals: []
  },

  yourMeals:function(e){
    console.log(e)
    wx.navigateTo({
      url:`/groups/show/show?id=${e.currentTarget.dataset.meal_id}`
      })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.fetchUserMeals(this);
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

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

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

  toNewMeal: () => {
    wx.navigateTo({
      url: '/groups/new/new'
    });
  },

  fetchUserMeals: (page) => {
    const app = getApp();
    page.setData({
      meals: app.globalData.meals
    });
  //   const MealsTable = new wx.BaaS.TableObject('meals');
  //   let query = new wx.BaaS.Query();
  //   query.compare('created_by', '=', wx.BaaS.storage.get('uid'));
  //   MealsTable.setQuery(query).orderBy('meal_date').find().then(res => {
  //     console.log(res);
  //     res.data.objects.forEach((meal) => {
  //       meal.meal_date = meal.meal_date.substr(0,10)
  //       return meal.meal_date
  //     })
  //     // meal_date = meal_date.substr(0, 15)
  //     page.setData({
  //       meals: res.data.objects
  //     });
  //   }, err => {
  //     console.log(err);
  //   })
  }
})