const keys = require('../../keys.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
import * as echarts from '../../components/ec-canvas/echarts';
// for convert for share text
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

const meal_cat = {
  '本帮江浙菜': ['苏浙菜', '上海本帮菜', '浙菜', '淮扬菜', '苏帮菜', '南京菜', '无锡菜', '温州菜', '衢州菜'],
  '日本菜': ['日本料理', '寿司', '日式烧烤', '日式快餐', '日式面条', '日式铁板烧', '日式自助', '日式火锅'],
  '中式': ['火锅', '川菜', '湘菜', '新疆菜', '云南菜', '东北菜', '西北菜', '台湾菜', '江西菜'],
  '小吃夜宵': ['烧烤', '海鲜', '小龙虾', '蟹宴', '小吃快餐'],
  '饮品甜点': ['咖啡厅', '面包甜点', '下午茶', 'Brunch'],
  '西式': ['比萨', '牛排', '意大利菜', '轻食沙拉', '法国菜', '西班牙菜', '拉美烧烤', '中东菜', '西餐自助'],
  '东南亚菜': ['泰国菜', '南洋中菜', '新加坡菜', '越南菜', '印度菜'],
  '韩国料理': ['韩国泡菜饼', '韩国五花肉', '石锅拌饭', '韩国烤肉', '韩国炒年糕'],
  '粤菜': ['粤菜馆', '茶餐厅', '潮汕菜', '燕翅鲍']
}


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
    marker: [{
      iconPath: "../../images/maker.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 50,
      height: 50
    }],
  },

  echartInit: function (e) {
    const page = this;
    // god damn chart loads too fast, gotta wait for the chartdata to load... gotta find  a better way
    setTimeout(function () {
      initChart(e.detail.canvas, e.detail.width, e.detail.height, page.data.pieData);
    }, 2000);
  },

  goHome: function (e) {
    wx.navigateTo({ url: '/pages/index/index' })
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
    setTimeout(function () {
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

    if (loc.latitude) {
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

  makeCall: function (e) {
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
              let markers = [];
              markers.push({
                title: res.title,
                // id: res.data[i].id,
                latitude: res.location.lat,
                longitude: res.location.lng,
                iconPath: "/images/marker.png", //图标路径
                width: 50,
                height: 50
              })
              // page.data.marker.latitude = res.location.lat;
              // page.data.marker.longitude = res.location.lng;
              page.setData({
                selected_restaurant: res,
                locked: true,
                marker: marker,
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
    let choicesArray = {};
    // adding up all choices
    if (choices.length === 1) {
      return { recommended_category: choices[0].category_array[0], votes: [3, 2, 1] };
    }

    choices.forEach(choice_array => {
      choice_array.category_array.forEach(choice => {
        if (choicesArray[choice] === undefined) {
          choicesArray[choice] = {
            value: 0,
            master_cat: ''
          };
        }
      })
      choicesArray[choice_array.category_array[0]].value += 3;
      choicesArray[choice_array.category_array[1]].value += 2;
      choicesArray[choice_array.category_array[2]].value += 1;

      Object.keys(meal_cat).forEach(cat => {
        meal_cat[cat].forEach(subcat => {
          if (subcat === choice_array.category_array[0]) {
            choicesArray[choice_array.category_array[0]].master_cat = cat;
          }
          if (subcat === choice_array.category_array[1]) {
            choicesArray[choice_array.category_array[1]].master_cat = cat;
          }
          if (subcat === choice_array.category_array[2]) {
            choicesArray[choice_array.category_array[2]].master_cat = cat;
          }
        })
      })
    });
    // turning into an array and formatting
    var unsorted = Object.keys(choicesArray).map(function (key) {
      return { name: key, value: this[key].value, super_cat: this[key].master_cat };
    }, choicesArray);
    unsorted.sort(function (p1, p2) { return p2.value - p1.value; });

    //gotta find three unique entries
    let topThree = [unsorted[0]];
    let counter = 1;
    while (topThree.length < 3) {
      let duplicate = false;
      topThree.forEach(entry => {
        if (unsorted[counter].super_cat === entry.super_cat) {
          duplicate = true;
        }
      })

      if (duplicate) {
        counter += 1;
      } else {
        topThree.push(unsorted[counter]);
      }
    }
    topThree.forEach(obj => {
      let accum = 0;
      unsorted.forEach(cat => {
        if (cat.name != obj.name) {
          if (cat.super_cat === obj.super_cat) {
            accum += cat.value;
          }
        }
      })
      obj.value += (Math.round(accum / 2));
    });
    // sort one more time
    const sorted = topThree.sort((a, b)=> {
                      b.value - a.value
                    });
      return { recommended_category: sorted[0].name, votes: sorted.map(cat => {
        return cat.value}) }
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
        return { value: vote };
      }
    })
    console.log('pieData: ', pieData);
    return new Promise((res, reject) => { res(pieData.slice(0, 6)) });
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
          console.log(results[1]);
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