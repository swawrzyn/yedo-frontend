Page({
  data: {
    user_location: '',

    multiArray1: [['本帮江浙菜', '日本菜', '中式', '小吃夜宵', '饮品甜点', '西式', '东南亚菜', '韩国料理', '粤菜'],
                 ['苏浙菜', '上海本帮菜', '浙菜', '淮扬菜', '苏帮菜', '南京菜', '无锡菜', '温州菜', '衢州菜']], 
    multiArray2: [['本帮江浙菜', '日本菜', '中式', '小吃夜宵', '饮品甜点', '西式', '东南亚菜', '韩国料理', '粤菜'],
                 ['苏浙菜', '上海本帮菜', '浙菜', '淮扬菜', '苏帮菜', '南京菜', '无锡菜', '温州菜', '衢州菜']], 
    multiArray3: [['本帮江浙菜', '日本菜', '中式', '小吃夜宵', '饮品甜点', '西式', '东南亚菜', '韩国料理', '粤菜'],
                 ['苏浙菜', '上海本帮菜', '浙菜', '淮扬菜', '苏帮菜', '南京菜', '无锡菜', '温州菜', '衢州菜']], 
    multiIndex1: '',
    multiIndex2: '',
    multiIndex3: '',
  },

  /**
   * Lifecycle function--Called when page load
   */

  bindMultiPickerChange1: function (e) {
    this.setData({
      multiIndex1: e.detail.value
    })
  },
  bindMultiPickerChange2: function (e) {
    this.setData({
      multiIndex2: e.detail.value
    })
  },
  bindMultiPickerChange3: function (e) {
    this.setData({
      multiIndex3: e.detail.value
    })
  },
  bindMultiPickerColumnChange1: function (e) {

    if (this.data.multiIndex1 === '') {
      this.setData({
        multiIndex1: [0, 0]
      })
    }
    var data = {
      multiArray1: this.data.multiArray1,
      multiIndex1: this.data.multiIndex1
    };
    data.multiIndex1[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex1[0]) {
          case 0:
            data.multiArray1[1] = ['苏浙菜', '上海本帮菜', '浙菜', '淮扬菜', '苏帮菜', '南京菜', '无锡菜', '温州菜', '衢州菜'];
            break;
          case 1:
            data.multiArray1[1] = ['日本料理', '寿司', '日式烧烤', '日式快餐', '日式面条', '日式铁板烧', '日式自助', '日式火锅'];
            break;
          case 2:
            data.multiArray1[1] = ['火锅', '川菜', '湘菜', '新疆菜', '云南菜', '东北菜', '西北菜', '台湾菜', '江西菜'];
            break;
          case 3:
            data.multiArray1[1] = ['烧烤', '海鲜', '小龙虾', '蟹宴', '小吃快餐'];
            break;
          case 4:
            data.multiArray1[1] = ['咖啡厅', '面包甜点', '下午茶', 'Brunch'];
            break;
          case 5:
            data.multiArray1[1] = ['比萨', '牛排', '意大利菜', '轻食沙拉', '法国菜', '西班牙菜', '拉美烧烤', '中东菜', '西餐自助'];
            break;
          case 6:
            data.multiArray1[1] = ['泰国菜', '南洋中菜', '新加坡菜', '越南菜', '印度菜'];
            break;
          case 7:
            data.multiArray1[1] = ['韩国泡菜饼', '韩国五花肉', '石锅拌饭', '韩国烤肉', '韩国炒年糕'];
            break;
          case 8:
            data.multiArray1[1] =  ['粤菜馆', '茶餐厅', '潮汕菜', '燕翅鲍'];
            break;
        }
        data.multiIndex1[1] = 0;
        break;

    }
    this.setData(data);
  },

  bindMultiPickerColumnChange2: function (e) {

    if (this.data.multiIndex2 === '') {
      this.setData({
        multiIndex2: [0, 0]
      })
    }

    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex2[0]) {
          case 0:
            data.multiArray2[1] = ['苏浙菜', '上海本帮菜', '浙菜', '淮扬菜', '苏帮菜', '南京菜', '无锡菜', '温州菜', '衢州菜'];
            break;
          case 1:
            data.multiArray2[1] = ['日本料理', '寿司', '日式烧烤', '日式快餐', '日式面条', '日式铁板烧', '日式自助', '日式火锅'];
            break;
          case 2:
            data.multiArray2[1] = ['火锅', '川菜', '湘菜', '新疆菜', '云南菜', '东北菜', '西北菜', '台湾菜', '江西菜'];
            break;
          case 3:
            data.multiArray2[1] = ['烧烤', '海鲜', '小龙虾', '蟹宴', '小吃快餐'];
            break;
          case 4:
            data.multiArray2[1] = ['咖啡厅', '面包甜点', '下午茶', 'Brunch'];
            break;
          case 5:
            data.multiArray2[1] = ['比萨', '牛排', '意大利菜', '轻食沙拉', '法国菜', '西班牙菜', '拉美烧烤', '中东菜', '西餐自助'];
            break;
          case 6:
            data.multiArray2[1] = ['泰国菜', '南洋中菜', '新加坡菜', '越南菜', '印度菜'];
            break;
          case 7:
            data.multiArray2[1] = ['韩国泡菜饼', '韩国五花肉', '石锅拌饭', '韩国烤肉', '韩国炒年糕'];
            break;
          case 8:
            data.multiArray2[1] =  ['粤菜馆', '茶餐厅', '潮汕菜', '燕翅鲍'];
            break;
        }
        data.multiIndex2[1] = 0;
        break;

    }
    this.setData(data);
  },

  bindMultiPickerColumnChange3: function (e) {
    if (this.data.multiIndex3 === '') {
      this.setData({
        multiIndex3: [0, 0]
      })
    }

    var data = {
      multiArray3: this.data.multiArray3,
      multiIndex3: this.data.multiIndex3
    };
    data.multiIndex3[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex3[0]) {
          case 0:
            data.multiArray3[1] = ['苏浙菜', '上海本帮菜', '浙菜', '淮扬菜', '苏帮菜', '南京菜', '无锡菜', '温州菜', '衢州菜'];
            break;
          case 1:
            data.multiArray3[1] = ['日本料理', '寿司', '日式烧烤', '日式快餐', '日式面条', '日式铁板烧', '日式自助', '日式火锅'];
            break;
          case 2:
            data.multiArray3[1] = ['火锅', '川菜', '湘菜', '新疆菜', '云南菜', '东北菜', '西北菜', '台湾菜', '江西菜'];
            break;
          case 3:
            data.multiArray3[1] = ['烧烤', '海鲜', '小龙虾', '蟹宴', '小吃快餐'];
            break;
          case 4:
            data.multiArray3[1] = ['咖啡厅', '面包甜点', '下午茶', 'Brunch'];
            break;
          case 5:
            data.multiArray3[1] = ['比萨', '牛排', '意大利菜', '轻食沙拉', '法国菜', '西班牙菜', '拉美烧烤', '中东菜', '西餐自助'];
            break;
          case 6:
            data.multiArray3[1] = ['泰国菜', '南洋中菜', '新加坡菜', '越南菜', '印度菜'];
            break;
          case 7:
            data.multiArray3[1] = ['韩国泡菜饼', '韩国五花肉', '石锅拌饭', '韩国烤肉', '韩国炒年糕'];
            break;
          case 8:
            data.multiArray3[1] =  ['粤菜馆', '茶餐厅', '潮汕菜', '燕翅鲍'];
            break;
        }
        data.multiIndex3[1] = 0;
        break;

    }
    this.setData(data);
  },

  onLoad: function (options) {
    const app = getApp();
    const page = this;
    console.log(app.globalData.tempMeal);
    
    if (app.globalData.tempMeal){
      const mealDateObj = new Date(app.globalData.tempMeal.meal_date);
      let meal_date;
      let meal_time;
      wx.getSystemInfo({
        // stupid platform issue workaround
        success: function(res) {
          if(res.platform === 'android') {
            meal_date = `${mealDateObj.getFullYear()}/${mealDateObj.getMonth() + 1}/${mealDateObj.getDate()}`
            meal_time = `${mealDateObj.getHours()}:${mealDateObj.getMinutes()}`
          } else {
            meal_date = mealDateObj.toLocaleDateString('zh-hans');
            meal_time = mealDateObj.toLocaleTimeString('zh-hans', { hour12: false, hour: '2-digit', minute:'2-digit'});
          }
        }
      })
      this.setData({
        meal: app.globalData.tempMeal,
        meal_date: meal_date,
        meal_time: meal_time
      })
    } else {
      const MealTable = new wx.BaaS.TableObject('meals' + app.globalData.database);
      MealTable.get(options.group_id).then( res => {
        const mealDateObj = new Date(res.data.meal_date);
        let meal_date;
      let meal_time;
      wx.getSystemInfo({
        // stupid platform issue workaround
        success: function(res) {
          if(res.platform === 'android') {
            meal_date = `${mealDateObj.getFullYear()}/${mealDateObj.getMonth() + 1}/${mealDateObj.getDate()}`
            meal_time = `${mealDateObj.getHours()}:${mealDateObj.getMinutes()}`
          } else {
            meal_date = mealDateObj.toLocaleDateString('zh-hans');
            meal_time = mealDateObj.toLocaleTimeString('zh-hans', { hour12: false, hour: '2-digit', minute:'2-digit'});
          }
        }
      })
        page.setData({
          meal: res.data,
          mealId: res.data.id,
          meal_date: meal_date,
          meal_time: meal_time
        })
      });
    }

  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {
  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  toHome: function () {
    wx.redirectTo({
      url: '/pages/index/index'
    })
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
        if (page.data.multiIndex1 === '' || page.data.multiIndex2 === '' || page.data.multiIndex3 === ''){
          wx.showToast({
            title: '请做出三个选择',
            image: '../../images/close.svg'
          })
        } else {
          page.saveMealAndChoices();
        }
      } else {
        wx.showToast({
          title: '请选择位置',
          image: '../../images/close.svg'
        })
      }
    } else {
      if (page.data.multiIndex1 === '' || page.data.multiIndex2 === '' || page.data.multiIndex3 === ''){
        wx.showToast({
          title: '请做出三个选择',
          image: '../../images/close.svg'
        })
      } else {
        page.saveMealAndChoices();
      }
    }
    
  },

  saveMealAndChoices: function () {
    const app = getApp();
    const page = this;
    let ChoicesTable = new wx.BaaS.TableObject("choices" + app.globalData.database);
    wx.showLoading({
      title: '加载中'
    })
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
          category_array: [this.data.multiArray1[1][this.data.multiIndex1[1]], this.data.multiArray2[1][this.data.multiIndex2[1]], this.data.multiArray3[1][this.data.multiIndex3[1]]],
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
      const app = getApp();
      app.addMealFromChoices(this.data.meal);
      const newchoice = ChoicesTable.create();
      newchoice.set({
        meal_id: page.data.mealId,
        category_array: [this.data.multiArray1[1][this.data.multiIndex1[1]], this.data.multiArray2[1][this.data.multiIndex2[1]], this.data.multiArray3[1][this.data.multiIndex3[1]]],
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