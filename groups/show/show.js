// groups/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {

    meals: [],
    _userprofile:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
console.log(options.id)
const page = this
    const id = options.id
    const MealsTable = new wx.BaaS.TableObject('meals');
      MealsTable.get(id).then(res => {
        console.log(res);
        page.setData({
          meals: res.data
        });
        const MyUser = new wx.BaaS.User()
        MyUser.get(res.data.created_by).then(r => {
          console.log(r);
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


})