// groups/show/show.js
const keys = require('../../keys.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
const qqMap = new QQMapWX({
  key: keys.qqMapKey
});

const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    meal: '',
    recommendation: '',
    locations: [],
    meal_date: "",
  },

  goHome: function(e){
    wx.navigateTo({ url:'/pages/index/index'})
  },

  createMeal: function (e) {
    wx.navigateTo({ url: '/groups/new/new' })
  },
  
  onLoad: function (options) {
    this.popover = this.selectComponent('#popover');
    const recompRec = (options.new === 'true');
    this.setData({
      mealId: options.id,
      recomp: recompRec
    });

    //fetching all info on the current meal
    this.fetchAllInfo(this.data.mealId);
  },

  popOver: function (e) {
    // 获取按钮元素的坐标信息
    var id = 'members' // 或者 e.target.id 获取点击元素的 ID 值
    var popover;
    var button = wx.createSelectorQuery().select('#' + id);
    button.boundingClientRect(res => {
      popover = this;
      // 调用自定义组件 popover 中的 onDisplay 方法
      this.popover.onDisplay(res);

    }).exec();
    setTimeout(function(){
      popover.popover.onHide();
    }, 3000)
  },

  toHome: function () {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  recommendSearch: function (meal, rec) {
    let locations;
    const page = this;
    qqMap.search({
      keyword: rec,
      location: {
        latitude: meal.location.coordinates[1],
        longitude: meal.location.coordinates[0]
      },
      address_format: 'short',
      page_size: 5,
      success: function (res) {
        locations = res.data;
        page.setData({
          locations: res.data
          // isRefreshing: true
        });
        // var mks = []
        // for (var i = 0; i < res.data.length; i++) {
        //   mks.push({ // 获取返回结果，放到mks数组中
        //     title: res.data[i].title,
        //     id: res.data[i].id,
        //     latitude: res.data[i].location.lat,
        //     longitude: res.data[i].location.lng,
        //     iconPath: "../../images/marker.png", //图标路径
        //     width: 20,
        //     height: 20
        //   })
        // }
        // page.setData({ //设置markers属性，将搜索结果显示在地图中
        //   markers: mks
        // })
      },
    });
    return locations;
  },

  location: function (e) {
    const page = this;
    wx.openLocation({
      latitude: page.data.locations[parseInt(e.currentTarget.id)].location.lat,
      longitude: page.data.locations[parseInt(e.currentTarget.id)].location.lng,
      name: page.data.locations[parseInt(e.currentTarget.id)].title,
      address: page.data.locations[parseInt(e.currentTarget.id)].address,
      scale: 14
    })
  },

  makeCall: function(e) {
    const page = this;
    wx.makePhoneCall({
      phoneNumber: page.data.locations[parseInt(e.currentTarget.id)].tel,
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
    const app = getApp();
    app.globalData.tempMeal = null;
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
    wx.showNavigationBarLoading();
    this.fetchAllInfo(this.data.mealId);      
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
    } return {
      title: `${this.data.meal.name}! 一道吃吧!`,
      path: `/pages/landing/landing?meal_id=${this.data.mealId}`,
      imageUrl: this.data.meal.photo_url
    }
  },

  recomputeRecommendation: (page, choices) => {
    //setting results for default value of zero.
    let results = {
      '美国菜': 0,
      '中餐': 0, 
      '意大利菜': 0, 
      '日本菜': 0, 
      '墨西哥菜': 0, 
      '韩国菜': 0
    };
    choices.forEach(choice => {
      results[choice.category_array[0]] += 3
      results[choice.category_array[1]] += 2
      results[choice.category_array[2]] += 1
      });
      let max = 0;
      let maxKey = "";
      Object.keys(results).forEach((key) => {
        if (results[key] > max) {
          max = results[key];
          maxKey = key;
        }
      })
      return maxKey;
  },

  setRecommended: function (page, meal, recCat) {
    page.setData({
      recommendation: recCat
    })
    const MealsTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
    const MealRecord = MealsTable.getWithoutData(meal.id);
    MealRecord.set({ recommended_category: recCat });
    MealRecord.update();
  },

  fetchMealInfo: function (mealId) {
    //fetching meal info from the cloud
    const page = this;
    const MealsTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
    return MealsTable.get(mealId).then(res => {
      page.setData({
        meal: res.data
      })
      return res.data
    });
    
  },

  fetchChoicesInfo: function (mealId) {
    //fetching choices attached to meal from the cloud
    const page = this;
    const ChoicesTable = new wx.BaaS.TableObject('choices' + app.globalData.database);
    let choicesQuery = new wx.BaaS.Query();
    choicesQuery.compare('meal_id', '=', mealId);
    return ChoicesTable.setQuery(choicesQuery).limit(0).find().then(res => {
      page.setData({
        choices: res.data.objects
      });
      return res.data.objects;
    })
  },

  fetchUserInfo: function (choices) {
    //fetching all users attached to the choices attached to the meals... from the cloud
    const Users = new wx.BaaS.User();
    let usersQuery = new wx.BaaS.Query();
    const page = this;
    const userIds = choices.map(choice => {
      return choice.created_by
    })
    usersQuery.in('id', userIds);
    Users.setQuery(usersQuery).limit(0).find().then(res => {
      page.setData({
        users: res.data.objects,
        group_users_count: res.data.objects.length
      })
    })
  },

  fetchAllInfo: function (mealId) {
    // putting it all together
    const page = this;
    // fetching meal
    const meal = this.fetchMealInfo(mealId);
    // fetching choices
    let recommendation = this.fetchChoicesInfo(mealId).then(res => {
      // since we have choices, we can get users now
      this.fetchUserInfo(res);
      // if we need to recompute the recommendation
      if (page.data.recomp) {
        return this.recomputeRecommendation(page, res); 
      } else {
        // if we don't need to recompute
        return false;
      }
    })
    // if recompute is required, we need to wait for the meal info and recommendation from algo
    Promise.all([meal, recommendation]).then(results => {
      // aka. if recompute is not necessary
      if (results[1] === false) {
        page.setData({
          recommendation: results[0].recommended_category
        })
        page.recommendSearch(results[0], results[0].recommended_category);
      } else {
        // if recompute is necessary
        page.setRecommended(page, results[0], results[1]);
        page.recommendSearch(results[0], results[1]);
      }
    });
  }
})