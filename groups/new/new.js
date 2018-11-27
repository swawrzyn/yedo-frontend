// groups/new/new.js
import initCalendar from '../../template/calendar/index';
import { getSelectedDay } from '../../template/calendar/index';
const conf = {
  disablePastDay: true,

};
let meals = new wx.BaaS.TableObject(58396);
let currentUser = new wx.BaaS.User();
currentUser = currentUser.get(wx.BaaS.storage.get('uid')); 

Page({

  /**
   * Page initial data
   */
  data: {
    region_zh: ["浦东新", "徐汇", "长宁", "普陀", "闸北", "虹口", "杨浦", "黄浦", "卢湾", "静安", "宝山", "闵行", "嘉定", "金山", "松江", "青浦", "南汇", "奉贤", "崇明"],
    region_en: ["pudong dist.", "xuhui dist.", "changning dist.", "putuo dist.", "zhabei dist.", "hongkou dist.", "yangpu dist.", "huangpu dist.", "luwan dist.", "jingan dist.", "baoshan dist.", "minhang dist.", "jiading dist.", "jinshan dist.", "songjiang dist.", "qingpu dist.", "nanhui dist.", "fengxian dist.", "chongming dist."],
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
    const app = getApp();
    const day = getSelectedDay()[0];
    const inputDate = new Date(`${day.year}-${day.month}-${day.day}`);
    const newMeal = {
      name: e.detail.value.name,
      location: this.data.region_zh[e.detail.value.district],
      meal_date: (inputDate.toISOString()).toString()
    }
    let meal = meals.create();   
    meal.set(newMeal).save().then(res => {
      app.globalData.newMeal = { 
        name: res.data.name,
        meal_date: res.data.meal_date,
        location: res.data.location
       }
      wx.redirectTo({
        url: `/choices/new/new?group_id=${res.data.id}`
      })
    })
  }
})