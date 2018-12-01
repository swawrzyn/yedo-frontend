// choices/new/new.js
var cityData = require('../../utils/city.js'); 
Page({

  /**
   * Page initial data
   */
  data: {
    array1: ['American', 'Chinese', 'Italian', 'Japanese','Mexican','Korean'],
    array1_zh: ['美国菜', '中餐', '意大利菜', '日本菜', '墨西哥菜', '韩国菜'],
    index1: 0,
    index2: 1,
    index3: 2
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const app = getApp();
    const page = this;
    
    if (app.globalData.tempMeal){
      const meal_date_string = app.globalData.tempMeal.meal_date.substr(0, 10);
      this.setData({
        meal: app.globalData.tempMeal,
        meal_date_string: meal_date_string
      })
    } else {
      const MealTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
      MealTable.get(options.group_id).then( res => {
        const meal_date_string = res.data.meal_date.substr(0, 10);
        page.setData({
          meal: res.data,
          mealId: res.data.id,
          meal_date_string: meal_date_string
        })
      });
    }

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

  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },
  bindPickerChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index3: e.detail.value
    })
  },


  addChoices: function() {
    const app = getApp();
    let ChoicesTable = new wx.BaaS.TableObject("choices" + app.globalData.database);
    const page = this;
    let choices;
    if (app.globalData.tempMeal) {
      console.log("globalData FOUND!");
      app.addMeal(this.data.meal).then(res => {
        page.setData({
          mealId: res.id
        });
        return res.id
      }).then(res => {
        //setting choices to push to database
        const newchoice = ChoicesTable.create();
        newchoice.set({
          meal_id: page.data.mealId,
          category_array: [this.data.array1_zh[this.data.index1], this.data.array1_zh[this.data.index2], this.data.array1_zh[this.data.index3]]
        //TODO: Add geojson object for user location.
        });
        newchoice.save().then(res => {
          wx.redirectTo({
            url: `/groups/show/show?id=${page.data.mealId}&new=true`,
          })
        });
      })
    } else {
      console.log("globalData NOT FOUND!");
      const newchoice = ChoicesTable.create();
      newchoice.set({
        meal_id: page.data.mealId,
        category_array: [this.data.array1_zh[this.data.index1], this.data.array1_zh[this.data.index2], this.data.array1_zh[this.data.index3]]
        //TODO: Add geojson object for user location.
      });
      newchoice.save().then(res => {
        wx.redirectTo({
          url: `/groups/show/show?id=${page.data.mealId}&new=true`,
        })
      });
    }
  },

  userInfoHandler(data) {
    console.log(data);
    wx.BaaS.handleUserInfo(data).then(res => {
      this.addChoices();
    }, res => {
    })
  }
})