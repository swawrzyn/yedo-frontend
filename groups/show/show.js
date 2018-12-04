// groups/show/show.js
const keys = require('../../keys.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
import * as echarts from '../../components/ec-canvas/echarts';
// for convert for share text
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

const qqMap = new QQMapWX({
  key: keys.qqMapKey
});
const app = getApp();

function initChart(canvas, width, height, chartdata) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "transparent",
    color: ["#FFFFFF", "#888", "#666", "#444", "#222"],
    series: [{
      label: {
        position: 'inside',
        color: '#000000',
        fontSize: 6
      },
      data: chartdata,
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * Page initial data
   */
  data: {
    meal: '',
    recommendation: '',
    locations: [],
    meal_date: "",
    ec: {},
  },

  echartInit: function(e) {
    const page = this;
    // god damn chart loads too fast, gotta wait for the chartdata to load... gotta find  a better way
    setTimeout(function() {
      initChart(e.detail.canvas, e.detail.width, e.detail.height, page.data.pieData);
    }, 2000);
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

  recommendSearch: function (loc, rec) {
    console.log('recsearch loc: ', loc);
    let latitude;
    let longitude;

    if(loc.latitude) {
      latitude = loc.latitude;
      longitude = loc.longitude;
    } else {
      latitude = loc.coordinates[1];
      longitude = loc.coordinates[0];
    }

    let locations;
    const page = this;
    const app = getApp();
    qqMap.search({
      keyword: rec,
      location: {
        latitude: latitude,
        longitude: longitude
      },
      address_format: 'short',
      page_size: 20,
      success: function (res) {
        locations = res.data;
        page.setData({
          locations: res.data,
          locationsplice: res.data.splice(0, 5),
          // isRefreshing: true
          i: 5,
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
    let encodedText = Base64.encode(this.data.meal.name + '!')
    if (res.from === 'button') {
    } return {
      title: `一道吃吧!`,
      path: `/pages/landing/landing?meal_id=${this.data.mealId}`,
      imageUrl: `${this.data.meal.photo_url}/watermark/url/MWdUaVc5RTFyRkxMakc0Si5wbmc=/percent/100/align/center/repeat/true/opacity/50/watermark/text/${encodedText}/color/ffffff/size/120/align/center`
    }
  },

  tapLockSetRestaurant: function (e) {
    const page = this;
    const selectedRestaurant = page.data.locationsplice[parseInt(e.currentTarget.id)];
    if (page.data.owner && !page.data.meal.locked) {
      wx.showModal({
        title: 'lock it in!',
        content: `this action will select ${selectedRestaurant.title} as the restuarant for this meal. Are you sure?`,
        cancelText: 'no way!',
        confirmText: "go!",
        success(res) {
          if (res.confirm) {
            page.lockRestaurant(selectedRestaurant).then(res => {
              page.setData({
                selected_restaurant: res,
                locked: true,
                direction: 'none',
              })
            });
          }
        }
      })
    }
  },

  deleteRestaurant: function (e) {
    const page = this;
    delete page.data.locationsplice[parseInt(e.currentTarget.id)];
    page.data.locationsplice.push(page.data.locations[page.data.i]);
    console.log(page.data.locationsplice)
    let i = page.data.i
    page.setData({
      locationsplice: page.data.locationsplice,
      i: i += 1,
    }) 
  },

  recomputeRecommendation: (choices) => {
    //setting results for default value of zero.
    const page = this;
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
    return {
      recommended_category: maxKey, votes: Object.values(results).sort((a, b) => {return b - a}) };
  },

  setRecommended: function (page, meal, recCat) {
    page.setData({
      recommendation: recCat.recommended_category
    })
    const MealsTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
    const MealRecord = MealsTable.getWithoutData(meal.id);
    MealRecord.set(recCat);
    MealRecord.update();
  },

  computeLoc: function (choices) {
    // getting locs of all users
    const userLocs = choices.map(choice => {
      return choice.user_location
    });
    console.log('user locations: ', userLocs);
    // computing
    if (userLocs.length === 1) {
      return userLocs[0];
    }

    let x = 0.0;
    let y = 0.0;
    let z = 0.0;

    for (let userLoc of userLocs) {
      let latitude = userLoc.coordinates[1] * Math.PI / 180;
      let longitude = userLoc.coordinates[0] * Math.PI / 180;

      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    }

    let total = userLocs.length;

    x = x / total;
    y = y / total;
    z = z / total;

    let centralLongitude = Math.atan2(y, x);
    let centralSquareRoot = Math.sqrt(x * x + y * y);
    let centralLatitude = Math.atan2(z, centralSquareRoot);
    
    return new wx.BaaS.GeoPoint((centralLongitude * 180 / Math.PI), (centralLatitude * 180 / Math.PI));
  },

  setLoc: function (loc, mealId) {
    const page = this;
    const MealsTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
    let currentMeal = MealsTable.getWithoutData(mealId);
    currentMeal.set('meal_location', loc);
    currentMeal.update().then(res => {
      page.setData({
        meal: res.data
      })
    })
  },

  fetchMealInfo: function (mealId) {
    //fetching meal info from the cloud
    const page = this;
    const MealsTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
    return MealsTable.get(mealId).then(res => {
      res.data.meal_date = res.data.meal_date.substr(0, 10)
      page.setData({
        meal: res.data
      })
      // checking if the owner is looking at the page
      if (res.data.created_by === wx.BaaS.storage.get('uid')) {
        page.setData({
          owner: true
        })
      } else {
        page.setData({
          owner: false
        })
      }
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

  setPieData: function (recCat, votes) {
    // setting the pie chart data
    const page = this;
    let first = true;
    let pieData = votes.map(vote => {
      if (first) {
        first = false;
        return {
          name: recCat,
          value: vote,
          label: {
            show: true,
          }
        }
      } else {
        return {value: vote};
      }
    })
    console.log('pieData: ', pieData);
    return new Promise((res, reject) => {res(pieData.slice(0,6))});
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
    const choices = this.fetchChoicesInfo(mealId).then(res => {
      // since we have choices, we can get users now
      this.fetchUserInfo(res);
      return res;
    })
    // if recompute is required, we need to wait for the meal info and recommendation from algo
    Promise.all([meal, choices]).then(results => {
      // checking if meal is locked
      if (results[0].locked) {
        page.setData({
          locations: [results[0].selected_restaurant],
          recommendation: results[0].recommended_category
        })
      } else {
        if (page.data.recomp) {
          // if recompute is necessary
          const recommendation = page.recomputeRecommendation(results[1]);
          let centreLoc;
          //checking if using owner location or all locations
          if (results[0].owner_location) {
            // hacky way of fixing this, making the single owner location a array so computeLoc can read.
            centreLoc = results[0].meal_location;
          } else {
            centreLoc = page.computeLoc(results[1]);
          }

          Promise.all([results[0], recommendation, centreLoc]).then(results => {
            console.log('centreloc: ', results[2]);
            page.setRecommended(page, results[0], results[1]);
            page.setLoc(results[2], results[0].id);
            page.setPieData(results[1].recommended_category, results[1].votes).then(res => {
              page.setData({
                pieData: res
              })
            });
            page.recommendSearch(results[2], results[1].recommended_category);
          })


        } else {
          // aka. if recompute is not necessary
          page.setData({
            recommendation: results[0].recommended_category
          })
          page.setPieData(results[0].recommended_category, results[0].votes).then(res => {
            // hacky way of waiting for the chart canvas to init
            page.setData({
              pieData: res
            })
          });

          page.recommendSearch(results[0].meal_location, results[0].recommended_category);
        }
      }
    });
  },

  lockRestaurant: function (restaurant) {
    // formatting the restaurant object for input into database
    const page = this;
    Object.defineProperty(restaurant, 'distance',
      Object.getOwnPropertyDescriptor(restaurant, '_distance'));
    delete restaurant['_distance'];
    // updating the meals record
    const MealsTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
    let currentMeal = MealsTable.getWithoutData(page.data.mealId);

    currentMeal.set({
      selected_restaurant: restaurant,
      locked: true
    });
    return currentMeal.update().then(res => {
      page.fetchAllInfo(res.data.id);
      return res.data
    });
  },
  
  formSubmit: function(e) {
    console.log(e.detail);
    const MealsTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
    let meal = MealsTable.getWithoutData(this.data.mealId);
    meal.set('message_sent', true);
    meal.update().then((res) => {
      wx.BaaS.wxReportTicket(e.detail.formId)
    })
  }
})