// choices/new/new.js
var cityData = require('../../utils/city.js'); 
Page({

  /**
   * Page initial data
   */
  data: {
    array1: ['American', 'Chinese', 'Italian', 'Japanese','Mexican','Korean'],
    array1_zh: ['美国菜', '中餐', '意大利菜', '日本菜', '墨西哥菜', '韩国菜'],
    index1: 0,
    index2: 1,
    index3: 2
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const app = getApp();
    const page = this;
    
    if (app.globalData.tempMeal){
      const meal_date_string = app.globalData.tempMeal.meal_date.substr(0, 10);
      this.setData({
        meal: app.globalData.tempMeal,
        meal_date_string: meal_date_string,
      })
      if (app.globalData.tempMeal.owner_location){
        this.setData({
          location: app.globalData.tempMeal.location
        })
      }
    } else {
      const MealTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
      MealTable.get(options.group_id).then( res => {
        const meal_date_string = res.data.meal_date.substr(0, 10);
        page.setData({
          meal: res.data,
          mealId: res.data.id,
          meal_date_string: meal_date_string
        })
      });
    }

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

  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },
  bindPickerChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index3: e.detail.value
    })
  },

  findLocation: function (e) {
    const page = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log('success');
              wx.chooseLocation({
                success: res => {
                  this.setData({
                    location: {
                      coordinates: [res.latitude, res.longitude],
                      type: "Point"
                    }
                  })
                }
              });
            },
            fail(err) {
              page.setData({
                noLoc: true
              })
              if (page.data.noLoc) {
                wx.showModal({
                  title: 'Location permissions',
                  content: "yedo requires location permissions to operate. Please check 'Use My Location' on the following screen and click again.",
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          console.log('fail res: ', res);
                        },
                        fail: res => {
                          console.log('errrr', res)
                        }
                      })
                    }
                  }
                })

              }
            }
          })
        } else {
          console.log('auth')
          page.setData({
            noLoc: false
          })
          wx.chooseLocation({
            success: res => {
              page.setData({
                location: {
                  coordinates: [res.latitude, res.longitude],
                  type: "Point"
                }
              })
            }
          });
        }
      }
    })
  },


  addChoices: function() {
    const app = getApp();
    let ChoicesTable = new wx.BaaS.TableObject("choices" + app.globalData.database);
    const page = this;
    if (app.globalData.tempMeal) {
      console.log("globalData FOUND!");
      app.addMeal(this.data.meal).then(res => {
        page.setData({
          mealId: res.id
        });
        return res.id
      }).then(res => {
        //setting choices to push to database
        const newchoice = ChoicesTable.create();
        newchoice.set({
          meal_id: res,
          category_array: [this.data.array1_zh[this.data.index1], this.data.array1_zh[this.data.index2], this.data.array1_zh[this.data.index3]],
        user_location: {
          coordinates: [1.11,2.22],
          type: "Point"
        }
        });
        newchoice.save().then(res => {
          wx.redirectTo({
            url: `/groups/show/show?id=${page.data.mealId}&new=true`,
          })
        });
      })
    } else {
      console.log("globalData NOT FOUND!");
      const newchoice = ChoicesTable.create();
      newchoice.set({
        meal_id: page.data.mealId,
        category_array: [this.data.array1_zh[this.data.index1], this.data.array1_zh[this.data.index2], this.data.array1_zh[this.data.index3]],
        user_location: page.data.location
      });
      newchoice.save().then(res => {
        wx.redirectTo({
          url: `/groups/show/show?id=${page.data.mealId}&new=true`,
        })
      });
    }
  },

  userInfoHandler(data) {
    console.log(data);
    wx.BaaS.handleUserInfo(data).then(res => {
      this.addChoices();
    }, res => {
    })
  }
})