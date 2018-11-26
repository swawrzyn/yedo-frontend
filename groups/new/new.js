// groups/new/new.js
import initCalendar from '../../template/calendar/index';
const conf = {
  disablePastDay: true
};
Page({

  /**
   * Page initial data
   */
  data: {
    region_zh: ["浦东新区", "徐汇区", "长宁区", "普陀区", "闸北区", "虹口区", "杨浦区", "黄浦区", "卢湾区", "静安区", "宝山区", "闵行区", "嘉定区", "金山区", "松江区", "青浦区", "南汇区", "奉贤区", "崇明区"],
    region_en: ["pudong dist.", "xuhui dist.", "changning dist.", "putuo dist.", "zhabei dist.", "hongkou dist.", "yangpu dist.", "huangpu dist.", "luwan dist.", "jingan dist.", "baoshan dist.", "minhang dist.", "jiading dist.", "jinshan dist.", "songjiang dist.", "qingpu dist.", "nanhui dist.", "fengxian dist.", "chongming dist."],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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
  }
})