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
    // isRefreshing: false,
    imgUrls: [
    'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
  },

  goHome: function(e){
    wx.navigateTo({ url:'/pages/index/index'})
  },

createMeal: function (e) {
    wx.navigateTo({ url: '/groups/new/new' })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.popover = this.selectComponent('#popover');
    const page = this
    this.setData({
      mealId: options.id
    });
    const recompRec = (options.new === 'true');
    this.loadGroup(options.id, recompRec);
  },

  popOver: function (e) {
    // 获取按钮元素的坐标信息
    var id = 'members' // 或者 e.target.id 获取点击元素的 ID 值
    var popover;
    var button = wx.createSelectorQuery().select('#' + id);
    button.boundingClientRect(res => {
      console.log(res);
      popover = this;
      // 调用自定义组件 popover 中的 onDisplay 方法
      this.popover.onDisplay(res);

    }).exec();
    setTimeout(function(){
      popover.popover.onHide();
    }, 3000)
  },
  

  loadGroup: function(mealId, recalc) {
    const page = this;
    const MealsTable = new wx.BaaS.TableObject('meals');
    MealsTable.get(mealId).then(res => {
      res.data.meal_date = res.data.meal_date.substr(0, 10);
      page.setData({
        meals: res.data
      });
      if (recalc) {
        this.recomputeRecommendation(this, mealId);
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
      if (recalc) {
        this.recomputeRecommendation(this, mealId);
      } else {
        this.setData({
          recommendation: this.data.meals.recommended_category
        });
      }
    })
    this.findGroupUsers(this);
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading(); 
    // this.setData({
    //   isRefreshing: false
    // }) 
  },

  recommendSearch: function () {
    const page = this;
    qqMap.search({
      keyword: `${page.data.recommendation}`,
      location: {
        latitude: page.data.meals.location.coordinates[1],
        longitude: page.data.meals.location.coordinates[0]
      },
      address_format: 'short',
      page_size: 5,
      success: function (res) {
        page.setData({
          locations: res.data,
          // isRefreshing: true
        });
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../images/marker.png", //图标路径
            width: 20,
            height: 20
          })
        }
        page.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },
    });
  },

  location: function (e) {
    console.log(e);
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
    this.loadGroup(this.data.mealId, false);      
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
  },
})