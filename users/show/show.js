

Page({

  /**
   * Page initial data
   */
  data: {
    meals: [],
    show: 0,
    loaded: false
  },


  
  yourMeals:function(e){
    console.log("yourmeals",e)
    wx.navigateTo({
      url:`/groups/show/show?id=${e.currentTarget.dataset.meal_id}`
      })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    setTimeout(function () {
      this.fetchUserMeals(this);
      this.fetchUserDetails(this);
    }.bind(this), 0);
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
    // setTimeout(function () {
    //   this.fetchUserMeals(this);
    //   this.fetchUserDetails(this);
    // }.bind(this), 500);
    },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    setTimeout(function () {
      this.fetchUserMeals(this);
      this.fetchUserDetails(this);
    }.bind(this), 5000);
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
      meal.meal_date = meal.meal_date.substr(0, 10)
      page.setData({
        meals: app.globalData.meals
      })
      return meal.meal_date
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
}})
