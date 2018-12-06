

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
    setTimeout(function () {
      this.fetchUserMeals(this);
      this.fetchUserDetails(this);
    }.bind(this), 500);
    wx.hideLoading();
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
    wx.showLoading({
      title: '加载中',
    });
    wx.showNavigationBarLoading();
    console.log("pulled down!");
    this.fetchUserMeals(this);
    this.fetchUserDetails(this);
    setTimeout(function () {
      wx.hideLoading()
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000)  
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
    if (app.globalData.meals) {
      page.setData(page.sortMeals(app.globalData.meals));
    } else {
      page.setData({
        new_meals: [],
        old_meals: []
      })
    }
},

sortMeals: function (meals) {
  const page = this;
  const unsortedMeals = meals;
  let oldMeals = [];
  let newMeals = [];
  let platform;
    wx.getSystemInfo({
      success: function(res) {
        platform = res.platform;
      }
    })

    unsortedMeals.map(meal => {
        // stupid platform issue workaround

          const mealDateObj = new Date(meal.meal_date);
          meal.meal_date = mealDateObj;
          if (meal.meal_date < Date.now()) {
            oldMeals.push(meal);
          } else {
            newMeals.push(meal);
          }
      //    
    })

    console.log('meals', meals);

    oldMeals.sort((a, b) => {
      return b.meal_date - a.meal_date
    })
    newMeals.sort((a, b) => {
      return a.meal_date - b.meal_date
    })

    oldMeals.forEach(oldmeal => {
      let meal_date;
          let meal_time;
          if(platform === 'android') {
            meal_date = `${oldmeal.meal_date.getFullYear()}/${oldmeal.meal_date.getMonth() + 1}/${oldmeal.meal_date.getDate()}`
            meal_time = `${oldmeal.meal_date.getHours()}:${oldmeal.meal_date.getMinutes() < 10 ? '0' + oldmeal.meal_date.getMinutes() : oldmeal.meal_date.getMinutes()}`
          } else {
            meal_date = oldmeal.meal_date.toLocaleDateString('zh-hans');
            meal_time = oldmeal.meal_date.toLocaleTimeString('zh-hans', { hour12: false, hour: '2-digit', minute:'2-digit'});
          }
      oldmeal.meal_date = `${meal_date} ${meal_time}`
    })

    newMeals.forEach(newmeal => {
      let meal_date;
          let meal_time;
          if(platform === 'android') {
            meal_date = `${newmeal.meal_date.getFullYear()}/${newmeal.meal_date.getMonth() + 1}/${newmeal.meal_date.getDate()}`
            meal_time = `${newmeal.meal_date.getHours()}:${newmeal.meal_date.getMinutes() < 10 ? '0' + newmeal.meal_date.getMinutes() : newmeal.meal_date.getMinutes()}`
          } else {
            meal_date = newmeal.meal_date.toLocaleDateString('zh-hans');
            meal_time = newmeal.meal_date.toLocaleTimeString('zh-hans', { hour12: false, hour: '2-digit', minute:'2-digit'});
          }
      newmeal.meal_date = `${meal_date} ${meal_time}`
    })

  return { new_meals: newMeals, old_meals: oldMeals };
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
