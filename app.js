const keys = require('/keys.js');
const QQMapWX = require('/libs/qqmap-wx-jssdk.js');
const qqMap = new QQMapWX({
  key: keys.qqMapKey 
});

App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('86e9cea993a138b9109a')

    wx.BaaS.login(false).then(res => {
      wx.removeStorageSync('meals');
      this.fetchMeals();
    }, err => {
      // 登录失败
    })
  },

  fetchMeals: function () {
    var self = this
    wx.getStorage({
      key: 'meals',
      success: function(res) {
        self.globalData.meals = res.data
      },
      fail: function(res) {
        console.log("fetching from the cloud");
        self.fetchMealsFromCloud();
      }
    })
  },
  
  fetchMealsFromCloud: function () {
    const self = this;
    const MealsTable = new wx.BaaS.TableObject('meals');
    const ChoicesTable = new wx.BaaS.TableObject('choices');

    const choicesQuery = new wx.BaaS.Query();
    const mealsArray = [];

    choicesQuery.compare('created_by', '=', wx.BaaS.storage.get('uid'));

    ChoicesTable.setQuery(choicesQuery).limit(0).find().then(res => {
      console.log(res.data.objects);
      res.data.objects.forEach((choice) => {
        if (!mealsArray.includes(choice.meal_id)){
          mealsArray.push(choice.meal_id)
        }
      });
      return mealsArray;
    }).then(res => {
      console.log("meals associated: ", res)
      const mealsQuery = new wx.BaaS.Query();
      mealsQuery.in('id', res);
      MealsTable.setQuery(mealsQuery).find().then(res => {
        console.log("found matching meals: ", res.data.objects)
        wx.setStorage({
          key: 'meals',
          data: res.data.objects,
          complete: function(res) {
            self.fetchMeals();
          }
        });
      })
    })
  },

  addMeal: function (meal) {
    const app = getApp();
  // for concurrently adding a meal to the phone storage and db.
  const MealsTable = new wx.BaaS.TableObject('meals');
  let newMeal = MealsTable.create();
  let createdMeal;
  return newMeal.set(meal).save().then(res => {
    app.globalData.meals.push(res.data);
    wx.setStorage({
      key: 'meals',
      data: app.globalData.meals
    });
    return res.data;
  })
  },

  addMealFromChoices: function(meal) {
    const app = getApp();
    app.globalData.meals.push(res.data);
    wx.setStorage({
      key: 'meals',
      data: app.globalData.meals
    });
  },

  globalData: {
  }
})
