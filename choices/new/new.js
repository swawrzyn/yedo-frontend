// choices/new/new.js
var cityData = require('../../utils/city.js'); 
Page({

  /**
   * Page initial data
   */
  data: {
    // content: [],
    // px: ['最新发布', '推荐排序', '租金由低到高', '租金由高到低', '面积由小到大', '面积由大到小'], //排序列表内容
    // qyopen: false, //点击地铁区域筛选滑动弹窗显示效果，默认不显示
    // qyshow: true, //用户点击闭关区域的弹窗设置，默认不显示
    // nzopen: false, //价格筛选弹窗
    // pxopen: false, //排序筛选弹窗
    // nzshow: true,
    // pxshow: true,
    // isfull: false,
    // cityleft: cityData.getCity(), //获取地铁区域的下拉框筛选项内容
    // citycenter: {}, //选择地铁区域左边筛选框后的显示的中间内容部分
    // cityright: {}, //选择地铁区域的中间内容部分后显示的右边内容
    // select1: '地铁', //地铁区域选中后的第二个子菜单，默认显示地铁下的子菜单
    // select2: '', //地铁区域选择部分的中间
    // select3: '', //地铁区域选择部分的右边
    // shownavindex: '',
    // // 价格筛选框设置
    // leftMin: 0,
    // leftMax: 10000, //左边滑块最大值
    // rightMin: 0, //右边滑块的最小值
    // rightMax: 10000, //右边滑块最大值
    // leftValue: 1000, //左边滑块默认值
    // rightValue: 6000, //右边滑块默认值
    // leftPer: '50', //左边滑块可滑动长度：百分比
    // rightPer: '50', //右边滑块可滑动长度

    // pxIndex: 0, //排序内容下拉框，默认第一个
    array1: ['American', 'Chinese', 'Italian', 'Japanese','Mexican','Korean'],
    array1_zh: ['美国菜', '中餐', '意大利菜', '日本菜', '墨西哥菜', '韩国菜'],
    index1: 0,
    index2: 1,
    index3: 2,
    // objectArray: [
    //   {
    //     id: 0,
    //     name: 'American'
    //   },
    //   {
    //     id: 1,
    //     name: 'Chinese'
    //   },
    //   {
    //     id: 2,
    //     name: 'Italian'
    //   },
    //   {
    //     id: 3,
    //     name: 'Japanese'
    //   },
    //   {
    //     id: 4,
    //     name: 'Mexican'
    //   },
    //   {
    //     id: 5,
    //     name: 'Korean'
    //   }
    // ],
    // index: 0,
    covers: ["../../images/food-cover/food1.jpg", "../../images/food-cover/food2.jpg", "../../images/food-cover/food3.jpg", "../../images/food-cover/food4.jpg", "../../images/food-cover/food5.jpg"],
    cover_url: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options);
    const app = getApp();
    const page = this;
    // this.setData({
    //   citycenter: this.data.cityleft['地铁'],
    // })
    let index = Math.round(Math.random() * (page.data.covers.length - 1));
    this.setData({
      cover_url: page.data.covers[index]
    })
    if (app.globalData.tempMeal){
      this.setData({
        meal: app.globalData.tempMeal,
      })
    } else {
      const MealTable = new wx.BaaS.TableObject('meals');
      MealTable.get(options.group_id).then( res => {
        const meal_date_string = res.data.meal_date.substr(0, 10);
        page.setData({
          meal: res.data,
          mealId: res.data.id,
          meal_date: meal_date_string
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

  addChoices: function() {
    let ChoicesTable = new wx.BaaS.TableObject("choices");
    const app = getApp();
    const page = this;
    let choices;

    if (app.globalData.tempMeal) {
      app.addMeal(this.data.meal).then(res => {
        page.setData({
          mealId: res.id
        });
        return res.id
      }).then(res => {
        choices = [
          {
            meal_category: this.data.array1_zh[this.data.index1],
            rank: 3,
            meal_id: res,
          },
          {
            meal_category: this.data.array1_zh[this.data.index2],
            rank: 2,
            meal_id: res,
          },
          {
            meal_category: this.data.array1_zh[this.data.index3],
            rank: 1,
            meal_id: res,
          }
        ]
        ChoicesTable.createMany(choices).then(res => {
          wx.redirectTo({
            url: `/groups/show/show?id=${page.data.mealId}&new=true`,
          })
        });
      })
    } else {
      choices = [
        {
          meal_category: this.data.array1_zh[this.data.index1],
          rank: 3,
          meal_id: page.data.mealId,
        },
        {
          meal_category: this.data.array1_zh[this.data.index2],
          rank: 2,
          meal_id: page.data.mealId,
        },
        {
          meal_category: this.data.array1_zh[this.data.index3],
          rank: 1,
          meal_id: page.data.mealId,
        }
      ]
      ChoicesTable.createMany(choices).then(res => {
        wx.redirectTo({
          url: `/groups/show/show?id=${this.data.mealId}&new=true`,
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
   // 地铁区域列表下拉框是否隐藏
  // listqy: function (e) {
  //   if (this.data.qyopen) {
  //     this.setData({
  //       qyopen: false,
  //       nzopen: false,
  //       pxopen: false,
  //       nzshow: true,
  //       pxshow: true,
  //       qyshow: false,
  //       isfull: false,
  //       shownavindex: 0
  //     })
  //   } else {
  //     this.setData({
  //       qyopen: true,
  //       pxopen: false,
  //       nzopen: false,
  //       nzshow: true,
  //       pxshow: true,
  //       qyshow: false,
  //       isfull: true,
  //       shownavindex: e.currentTarget.dataset.nav
  //     })
  //   }

  // },
  // 价格下拉框是否隐藏
  // list: function (e) {
  //   if (this.data.nzopen) {
  //     this.setData({
  //       nzopen: false,
  //       pxopen: false,
  //       qyopen: false,
  //       nzshow: false,
  //       pxshow: true,
  //       qyshow: true,
  //       isfull: false,
  //       shownavindex: 0
  //     })
  //   } else {
  //     this.setData({
  //       content: this.data.nv,
  //       nzopen: true,
  //       pxopen: false,
  //       qyopen: false,
  //       nzshow: false,
  //       pxshow: true,
  //       qyshow: true,
  //       isfull: true,
  //       shownavindex: e.currentTarget.dataset.nav
  //     })
  //   }
  // },
  // 排序下拉框是否隐藏
  // listpx: function (e) {
  //   if (this.data.pxopen) {
  //     this.setData({
  //       nzopen: false,
  //       pxopen: false,
  //       qyopen: false,
  //       nzshow: true,
  //       pxshow: false,
  //       qyshow: true,
  //       isfull: false,
  //       shownavindex: 0
  //     })
  //   } else {
  //     this.setData({
  //       content: this.data.px,
  //       nzopen: false,
  //       pxopen: true,
  //       qyopen: false,
  //       nzshow: true,
  //       pxshow: false,
  //       qyshow: true,
  //       isfull: true,
  //       shownavindex: e.currentTarget.dataset.nav
  //     })
  //   }
  //   console.log(e.target)
  // },
  // 地铁区域第一栏选择内容
  // selectleft: function (e) {
  //   console.log('用户选中左边菜单栏的索引值是：' + e.target.dataset.city);
  //   this.setData({
  //     cityright: {},
  //     citycenter: this.data.cityleft[e.currentTarget.dataset.city],
  //     select1: e.target.dataset.city,
  //     select2: ''
  //   });
  // },
  // 地铁区域中间栏选择的内容
  // selectcenter: function (e) {
  //   console.log('选中地铁线下的地铁站' + e.target.dataset.city);
  //   this.setData({
  //     cityright: this.data.citycenter[e.currentTarget.dataset.city],
  //     select2: e.target.dataset.city
  //   });
  // },
  // 地铁区域左边栏选择的内容
  // selectright: function (e) {
  //   // console.log(e._relatedInfo.anchorRelatedText)
  //   console.log('选中地铁线下的地铁站' + e.currentTarget.dataset.city);
  //   this.setData({
  //     select3: e._relatedInfo.anchorRelatedText
  //   });
  // },
  // 点击灰色背景隐藏所有的筛选内容
  // hidebg: function (e) {
  //   this.setData({
  //     qyopen: false,
  //     nzopen: false,
  //     pxopen: false,
  //     nzshow: true,
  //     pxshow: true,
  //     qyshow: true,
  //     isfull: false,
  //     shownavindex: 0,
  //   })
  // },
  // 地铁区域清空筛选项
  // quyuEmpty: function () {
  //   this.setData({
  //     select1: '',
  //     select2: '',
  //     select3: ''
  //   })
  // },
  // 地铁区域选择筛选项后，点击提交
  // submitFilter: function () {
  //   console.log('选择的一级选项是：' + this.data.select1);
  //   console.log('选择的二级选项是：' + this.data.select2);
  //   console.log('选择的三级选项是：' + this.data.select3);
  //   // 隐藏地铁区域下拉框
  //   this.setData({
  //     value1: this.data.select1,
  //     value2: this.data.select2,
  //     value3: this.data.select3,
  //     qyopen: false,
  //     nzopen: false,
  //     pxopen: false,
  //     nzshow: true,
  //     pxshow: true,
  //     qyshow: false,
  //     isfull: false,
  //     shownavindex: 0
  //   })
  // },
  // 排序内容下拉框筛选
  // selectPX: function (e) {
  //   console.log('排序内容下拉框筛选的内容是' + e.currentTarget.dataset.index);
  //   this.setData({
  //     pxIndex: e.currentTarget.dataset.index,
  //     nzopen: false,
  //     pxopen: false,
  //     qyopen: false,
  //     nzshow: true,
  //     pxshow: false,
  //     qyshow: true,
  //     isfull: false,
  //     shownavindex: 0
  //   });
  //   console.log('当前' + this.data.pxIndex);
  // },
})