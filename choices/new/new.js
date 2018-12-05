Page({
  data: {
    user_location: '',
    hidden: true,
    boxclass: "box",
      one: {
        outer: 'box one',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      two: {
        outer: 'box two',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      three: {
        outer: 'box three',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      four: {
        outer: 'box four',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      five: {
        outer: 'box five',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      six: {
        outer: 'box six',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      seven: {
        outer: 'box seven',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      eight: {
        outer: 'box eight',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },
      nine: {
        outer: 'box nine',
        inner: 'box-content hidden',
        number: 0,
        bindtap: 'testHidden'
      },

    
    items: [
      [['苏浙菜', false], ['上海本帮菜', false], ['浙菜', false], ['淮扬菜', false], ['苏帮菜', false], ['南京菜', false], ['无锡菜', false], ['温州菜', false], ['衢州菜', false]],
      [['日本料理', false], ['寿司', false], ['日式烧烤', false], ['日式快餐', false], ['日式面条', false], ['日式铁板烧', false], ['日式自助', false], ['日式火锅', false]],
      [['火锅', false], ['川菜', false], ['湘菜', false], ['新疆菜', false], ['云南菜', false], ['东北菜', false], ['西北菜', false], ['台湾菜', false], ['江西菜', false]],
      [['烧烤', false], ['海鲜', false], ['小龙虾', false], ['蟹宴', false], ['小吃快餐', false]],
      [['咖啡厅', false], ['面包甜点', false], ['下午茶', false], ['Brunch', false]],
      [['比萨', false], ['牛排', false], ['意大利菜', false], ['轻食沙拉', false], ['法国菜', false], ['西班牙菜', false], ['拉美烧烤', false], ['中东菜', false], ['西餐自助', false]],
      [['泰国菜', false], ['南洋中菜', false], ['新加坡菜', false], ['越南菜', false], ['印度菜', false]],
      [['韩国泡菜饼', false], ['韩国五花肉', false], ['石锅拌饭', false], ['韩国烤肉', false], ['韩国炒年糕', false]],
      [['粤菜馆', false], ['茶餐厅', false], ['潮汕菜', false], ['燕翅鲍', false]]
    ],

    items_index: ['本帮江浙菜', '日本菜', '中式', '小吃夜宵', '饮品甜点', '西式', '东南亚菜', '韩国料理', '粤菜'],
    items_number: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    choices: []


  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const app = getApp();
    const page = this;
    console.log(app.globalData.tempMeal);
    
    if (app.globalData.tempMeal){
      let meal_date_string = app.globalData.tempMeal.meal_date;
      this.setData({
        meal: app.globalData.tempMeal,
        meal_date_string: meal_date_string,
      })
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

  makeHidden: function (e) {
    console.log('make hidden')
    let boxArray = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

    boxArray.forEach(box => {
      let param = { };
      let string1, string2, string3, string4;
        string1 = `${box}.outer`;
        param[string1] = `box ${box}`
        string2 = `${box}.inner`; 
        param[string2] = 'box-content hidden';
        string3 = `${box}.title`
        param[string3] = ''
        string4 = `${box}.bindtap`
        param[string4] = 'testHidden'
        this.setData(param);
    })
  },

 
  testHidden: function (e) {
    console.log('test hidden', e)

    this.showBox(e.currentTarget.id);
  },

  pickItem: function (e) {
    const page = this;
    console.log(e.target.dataset);

    if (this.data.items[e.target.dataset.parentindex][e.target.dataset.index][1]){
      let params = {};
      params[`items[${e.target.dataset.parentindex}][${e.target.dataset.index}][1]`] = false;
      this.setData(params);
      const newArray = []
      this.data.choices.forEach(choice => {
        if (choice != (e.target.dataset.parent + e.target.dataset.item)) {
          newArray.push(choice);
        }
      });
      params = {}
      params[`items_number[${e.target.dataset.parentindex}]`] = this.data.items_number[e.target.dataset.parentindex] - 1
      this.setData(params);
      this.setData({
        choices: newArray
      })
      
    } else {
      if (this.data.choices.length < 3) {
        let params = {
          choices: this.data.choices.concat([e.target.dataset.item])
        }
        params[`items[${e.target.dataset.parentindex}][${e.target.dataset.index}][1]`] = true;
        params[`items_number[${e.target.dataset.parentindex}]`] = this.data.items_number[e.target.dataset.parentindex] + 1
        this.setData(params);
        this.setData(params);
      } else {
        wx.showToast({
          title: 'wrong!'
        })
      }
    }

    //this.makeHidden();

  },

  showBox: function(boxId) {
    
    let string1, string2, string3, string4;
      let param = { };

      string1 = `${boxId}.outer`;
        param[string1] = `box large ${boxId}`
        string2 = `${boxId}.inner`; 
        param[string2] = 'box-content';
        string3 = `${boxId}.title`
        param[string3] = 'hidden'
        string4 = `${boxId}.bindtap`
        param[string4] = ''
        this.setData(param);

    // boxArray.forEach(box => {
      

    //   if (box === boxId) {
        
    //   } else {
    //     string1 = `${box}.outer`;
    //     param[string1] = `box ${box}`
    //     string2 = `${box}.inner`; 
    //     param[string2] = 'box-content hidden';
    //     string3 = `${box}.title`
    //     param[string3] = 'hidden'

    //     this.setData(param);
    //   }
    // })
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
                    user_location: new wx.BaaS.GeoPoint(res.longitude, res.latitude)
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
                user_location: new wx.BaaS.GeoPoint(res.longitude, res.latitude)
              })
            }
          });
        }
      }
    })
  },


  addChoices: function() {
    const app = getApp();
    
    const page = this;
    //checking if using owner or users location
    if (!page.data.meal.owner_location) {
      if (page.data.user_location) {
        page.saveMealAndChoices();
      } else {
        wx.showToast({
          title: 'select a location',
        })
      }
    } else {
      page.saveMealAndChoices();
    }
    
  },

  saveMealAndChoices: function () {
    const app = getApp();
    const page = this;
    let ChoicesTable = new wx.BaaS.TableObject("choices" + app.globalData.database);
   
    if (app.globalData.tempMeal) {
      console.log("globalData FOUND!");
      app.addMeal(this.data.meal).then(res => {
        console.log('add meal result: ', res);
        page.setData({
          mealId: res.id
        });
        return res.id
      }).then(res => {
        //setting choices to push to database
        const newchoice = ChoicesTable.create();
        newchoice.set({
          meal_id: res,
          category_array: this.data.choices,
          user_location: this.data.user_location
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
        category_array: this.data.choices,
        user_location: page.data.user_location
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