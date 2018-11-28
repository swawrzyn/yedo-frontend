// groups/new/new.js
import initCalendar from '../../template/calendar/index';
import { getSelectedDay } from '../../template/calendar/index';
const conf = {
  disablePastDay: true,
};
let meals = new wx.BaaS.TableObject(58396);
let currentUser = new wx.BaaS.User();
currentUser = currentUser.get(wx.BaaS.storage.get('uid')); 
const app = getApp();

Page({
  data: {
    region_zh: ["浦东新", "徐汇", "长宁", "普陀", "闸北", "虹口", "杨浦", "黄浦", "卢湾", "静安", "宝山", "闵行", "嘉定", "金山", "松江", "青浦", "南汇", "奉贤", "崇明"],
    region_en: ["pudong dist.", "xuhui dist.", "changning dist.", "putuo dist.", "zhabei dist.", "hongkou dist.", "yangpu dist.", "huangpu dist.", "luwan dist.", "jingan dist.", "baoshan dist.", "minhang dist.", "jiading dist.", "jinshan dist.", "songjiang dist.", "qingpu dist.", "nanhui dist.", "fengxian dist.", "chongming dist."],    
  region_geo: [[121.535969, 31.233192], [121.443983, 31.201321], [121.441665, 31.208842], [121.413203, 31.252134], [121.459771, 31.282259], [121.487367, 31.268926], [121.525599, 31.308673], [121.498811, 31.22396], [121.497087, 31.208642], [121.455118, 31.230877], [121.356807, 31.409552], [121.325331, 31.202588], [121.269564, 31.376878], [121.34804, 30.75154], [121.234207, 31.034162], [121.136471, 31.154885], [121.767728, 30.968787], [121.48487, 30.91824], [121.488319, 31.63721]]
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // setting the table as meals, it's tableid is 58396

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
    initCalendar(conf);
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

  bindPickerChange: function(e) {
    console.log(e);
    this.setData({
      region_index: e.detail.value
    });
  },

  formSubmit: function(e) {
    console.log(app);
    const day = getSelectedDay()[0];
    const inputDate = new Date(`${day.year}-${day.month}-${day.day}`);

    app.globalData.tempMeal = {
      name: e.detail.value.name,
      location: { coordinates: this.data.region_geo[e.detail.value.district], 
                  type: "Point"},
      meal_date: (inputDate.toISOString()).toString()
    }
    wx.navigateTo({
      url: '/choices/new/new'
    })
    // app.addMeal(newMeal).then((res) => {
    //   console.log("add new meal: ", res);
    //   wx.redirectTo({
    //     url: `/choices/new/new?group_id=${res.id}`
    //   })
    // });
    // let meal = meals.create();  
    // meal.set(newMeal).save().then(res => {
    //   app.globalData.newMeal = { 
    //     name: res.data.name,
    //     meal_date: res.data.meal_date,
    //     location: res.data.location
    //    }
      
    // })
  }
})