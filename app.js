  const keys = require('/keys.js');
const QQMapWX = require('/libs/qqmap-wx-jssdk.js');
const qqMap = new QQMapWX({
  key: keys.qqMapKey
});


App({
  onLaunch: function () {

    //dev database stuff, REMOVE FOR PRODUCTION RELEASES
    this.globalData.database = '_dev';
    wx.removeStorageSync('meals');

    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('86e9cea993a138b9109a')
    wx.BaaS.ErrorTracker.enable();

    wx.BaaS.login(false).then(res => {
      this.fetchMeals();
    }, err => {
      // 登录失败
    })
     // Turn on the bugout function
  },

  onError: function (res) {
    // 当小程序产生错误时，会进行上报
    wx.BaaS.ErrorTracker.track(res)
  },

  fetchMeals: function () {
    var self = this
    wx.getStorage({
      key: 'meals',
      success: function(res) {
        console.log("what is this", res)
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
    const MealsTable = new wx.BaaS.TableObject('meals' + this.globalData.database);
    const ChoicesTable = new wx.BaaS.TableObject('choices' + this.globalData.database);

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
      const mealsQuery = new wx.BaaS.Query();
      mealsQuery.in('id', res);
      MealsTable.setQuery(mealsQuery).find().then(res => {
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
  const MealsTable = new wx.BaaS.TableObject('meals' + this.globalData.database);
  let newMeal = MealsTable.create();
  return newMeal.set(meal).save().then(res => {
    console.log("the response from the server: ", res)
    app.globalData.meals.push(res.data);
    wx.setStorage({
      key: 'meals',
      data: app.globalData.meals
    });
    return res.data;
  },
    err => {
     console.log('saving error: ', err)
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
    database: ''
  }
})
