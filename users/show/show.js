

Page({

  /**
   * Page initial data
   */
  data: {
    meals: [],
    show: 0,
  },

  toggleDelay: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      toggleDelay: true
    })
    setTimeout(function () {
      that.setData({
        toggleDelay: false
      })
    }, 1000)
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
 
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    // this.fetchUserMeals(this);
    // this.fetchUserDetails(this);
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    if (this.data.show === 0) {
      this.fetchUserMeals(this);
      this.fetchUserDetails(this);
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    // this.fetchUserMeals(this);
    // this.fetchUserDetails(this);
    this.setData({
      show: 1,
    })
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
    app.globalData.meals.forEach((meal) => {
    meal.meal_date = meal.meal_date.substr(0,10)
    return meal.meal_date
  })
    page.setData({
      meals: app.globalData.meals
  })
},
  
fetchUserDetails: (page) => {
  const app = getApp();
let idArray = []
app.globalData.meals.forEach(meal=>
{
  idArray.push(meal.created_by)
})
   let query = new wx.BaaS.Query();
   query.in('created_by', idArray);

  let MyUser = new wx.BaaS.User()
    MyUser.setQuery(query).find().then(res => {
      console.log(res)
    return res.data.objects
  }
  ).then(res => {
    const user_avatars = {};
    res.map(user =>{
      user_avatars[user.id] = user.avatar
    })
    page.setData({
      user_avatars: user_avatars
    })
  })
}
})
