// groups/show/show.js
const keys = require('../../keys.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const coords = [['静安', 1.2342, 12.2332]]
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
      })
    
  },

  recommendSearch: function () {
    const page = this;
    qqMap.search({
      keyword: `${page.data.recommendation}`,
      location: {
        latitude: 31.22222,
        longitude: 121.45806
      },
      page_size: 5,
      success: function (res) {
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
  onShareAppMessage: function () {

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
    console.log('mealid: ', page.data.mealId)
    const MealRecord = MealsTable.getWithoutData(page.data.mealId);
    MealRecord.set({ recommended_category: recCat });
    MealRecord.update();
  }
})