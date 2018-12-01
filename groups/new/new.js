import initCalendar from '../../template/calendar/index';
import { getSelectedDay } from '../../template/calendar/index';
const WeValidator = require('../../libs/we-validator');
const conf = {
  disablePastDay: true,
  defaultDay: false,
};
let meals = new wx.BaaS.TableObject('meals');
let currentUser = new wx.BaaS.User();
currentUser = currentUser.get(wx.BaaS.storage.get('uid')); 
const app = getApp();

Page({
  data: {
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
    this.initValidator();
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

  useOwnLocation: function (e) {
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
                    owner_location: true,
                    location: {
                      coordinates: [parseFloat(res.latitude), parseFloat(res.longitude)],
                      type: "Point"
                    },
                  })
                }
              });
            },
            fail(err) {
              page.setData({
                noLoc: true
              })
              if (this.data.noLoc) {
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
                owner_location: true,
                location: {
                  coordinates: [parseFloat(res.latitude), parseFloat(res.longitude)],
                  type: "Point"
                },
              })
            }
          });
        }
      }
    })
  },

  useAllLocations: function(e) {
    this.setData({
      owner_location: false,
      location: ''
    })
  },

  uploadImage: function(e) {
    let MyFile = new wx.BaaS.File();
    
    let metaData = { categoryName: 'group_photos' };
    let deny;
    const page = this;
    wx.chooseImage({
      success: function (res) {
        let fileParams = { filePath: res.tempFilePaths[0] };
        page.setData({
          photo_url: true 
        })
        wx.BaaS.wxCensorImage(res.tempFilePaths[0]).then(res => {
          deny = res.risky;
          console.log("riskyness: ", deny);
        }, err => {
          console.log(err);
        })
        if (deny) {
          wx.showModal({
            title: 'Error',
            content: 'This content is inappropriate, please upload something else.',
            showCancel: false,
            confirmText: 'Ok'
          });
        } else {
          MyFile.upload(fileParams, metaData).then(res => {
            console.log("uploaded successfully");
            page.setData({
              photo_url: res.data.path + '!/fw/800'
            })
            console.log("photo url: ", page.data.photo_url);
          }, err => {
          })
        }
        }
      })
  },

  formSubmit: function(e) {
    let { value } = e.detail;
    value['inputDate'] = 0;
    const day = getSelectedDay()[0] || 0;
    let inputDate;

    if (day) {
      inputDate = new Date(`${day.year}-${day.month}-${day.day}`);
      inputDate = (inputDate.toISOString()).toString()
      value['inputDate'] = 1;
      value['owner_location'] = this.data.owner_location
    } 

    console.log(value);

    if (!this.oValidator.checkData(value)) return
    if (this.data.photo_url) {
      app.globalData.tempMeal = {
        name: e.detail.value.name,
        location: this.data.location,
        owner_location: this.data.owner_location,
        meal_date: inputDate,
        photo_url: this.data.photo_url
      }
    } else {
      app.globalData.tempMeal = {
        name: e.detail.value.name,
        location: this.data.location,
        owner_location: this.data.owner_location, 
        meal_date: inputDate,
        photo_url: 'https://cloud-minapp-22402.cloud.ifanrusercontent.com/1gSJoT23AbOTUZ6J.jpg!/fw/800'
      }
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
  },
  initValidator() {
    // 实例化
    this.oValidator = new WeValidator({
      rules: {
        name: {
          required: true,
        },
        inputDate: {
          intGreater: 1 
        },
        owner_location: {
          required: true
        }
      },
      messages: {
        name: {
          required: 'Please enter a group name',
        },
        inputDate: {
          intGreater: 'Please select a date'
        },
        owner_location: {
          required: 'Please select a location type'
        }
      },
    })
  }
})