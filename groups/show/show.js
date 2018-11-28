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
    locations: []
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
        page.setData({
          meals: res.data
        });
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

    if (recompRec) {
      this.recomputeRecommendation(this, options.id);
    } else {
      this.setData({
        recommendation: this.data.meals.recommended_category
      });
    }

    },
  location: function () {
    const page = this;
    const app = getApp();
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log(this.data)
        page.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
    qqMap.search({
      keyword: '麦当劳',
      location: { 
        latitude: page.data.latitude, 
        longitude: page.data.longitude 
      },
      success: function (res) {
        page.setData({
          locations: res.data
        });
        wx.openLocation({
          latitude: page.data.locations[0].location.lat,
          longitude: page.data.locations[0].location.lng,
          scale: 5
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
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