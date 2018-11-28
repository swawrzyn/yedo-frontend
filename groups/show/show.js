// groups/show/show.js
const keys = require('../../keys.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const qqMap = new QQMapWX({
  key: keys.qqMapKey
});
Page({

  /**
   * Page initial data
   */
  data: {

    meals: [],
    _userprofile:[],
    recommendation: '',
    latitude: "",
    longitude: "",
    locations: [],
    meal_date: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const page = this
    const id = options.id
    this.setData({
      mealId: options.id
    });
    const recompRec = (options.new === 'true');
    const MealsTable = new wx.BaaS.TableObject('meals');
      MealsTable.get(id).then(res => {
        console.log(res);
        res.data.meal_date = res.data.meal_date.substr(0, 10);
        page.setData({
          meals: res.data
        });
        if (recompRec) {
          this.recomputeRecommendation(this, options.id);
        } else {
          page.setData({
            recommendation: this.data.meals.recommended_category
          });
          page.recommendSearch();
        }
        const MyUser = new wx.BaaS.User()
        MyUser.get(res.data.created_by).then(r => {
          page.setData({
            _userprofile: r.data
          });
        }, err => {
          console.log(err);
        })
      }, err => {
        console.log(err);
      }).then(res => {
        if (recompRec) {
          this.recomputeRecommendation(this, options.id);
        } else {
          this.setData({
            recommendation: this.data.meals.recommended_category
          });
        }
      })
    this.findGroupUsers(this);
  },

  recommendSearch: function () {
    const page = this;
    qqMap.search({
      keyword: `${page.data.recommendation}`,
      location: {
        latitude: page.data.meals.location.coordinates[1],
        longitude: page.data.meals.location.coordinates[0]
      },
      page_size: 5,
      success: function (res) {
        console.log(res)
        page.setData({
          locations: res.data
        });
      },
    });
  },

  location: function (e) {
    const page = this;
    wx.openLocation({
      latitude: page.data.locations[parseInt(e.currentTarget.id)].location.lat,
      longitude: page.data.locations[parseInt(e.currentTarget.id)].location.lng,
      scale: 14
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res);
    } return {
      title: this.data.meals.name,
      path: `/pages/landing/landing?meal_id=${this.data.mealId}`
    }
  },

  recomputeRecommendation: (page, mealId) => {
    //setting results for default value of zero.
    let results = {};
    const ChoicesTable = new wx.BaaS.TableObject('choices');
    let choicesQuery = new wx.BaaS.Query();
    choicesQuery.compare('meal_id', '=', mealId)
    ChoicesTable.setQuery(choicesQuery).find().then(res => {
      res.data.objects.forEach((r) => {
        if (results[r.meal_category] === undefined) {
          results[r.meal_category] = 0;
        }
        results[r.meal_category] += r.rank;
      });
      let max = 0;
      let maxKey = "";
      Object.keys(results).forEach((key) => {
        if (results[key] > max) {
          max = results[key];
          maxKey = key;
        }
      })
        page.setData({
          recommendation: maxKey
        })
        page.recommendSearch();
        page.setRecommended(page, maxKey);
    }, err => {
    })
    
  },

  setRecommended: function (page, recCat) {
    const MealsTable = new wx.BaaS.TableObject('meals');
    const MealRecord = MealsTable.getWithoutData(page.data.mealId);
    MealRecord.set({ recommended_category: recCat });
    MealRecord.update();
  },

  findGroupUsers: function (page) {
    let UserTable = new wx.BaaS.User();
    const ChoicesTable = new wx.BaaS.TableObject('choices');
    let query = new wx.BaaS.Query();
    
    const userArray = [];
    query.compare('meal_id', '=', page.data.mealId);
    ChoicesTable.setQuery(query).find().then(res => {
      res.data.objects.forEach((choice) => {
        if (!userArray.includes(choice.created_by)) {
          userArray.push(choice.created_by);
        }
      });
      return userArray;
    }).then(res => {
      let userQuery = new wx.BaaS.Query();
      userQuery.in('id', res);
      UserTable.setQuery(userQuery).find().then(res => {
        page.setData({
          group_users: res.data.objects,
          group_users_count: res.data.objects.length
        })
      })
    })
  }
})