// pages/code/code.js
//获取应用实例aa
const app = getApp();
const globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: "",
    animationData1: "",
    cardData: {},
    companyData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cardData: globalData.cardInfo,
      companyData: globalData.companyInfo

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      console.log("----Countdown----");
      that.animations();
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  animations: function () {
    //创建动画
    var animation = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 100,
      transformOrigin: "50% 50%",

    })
    animation.rotate(-180).step();     //边旋转边放大

    var animation1 = wx.createAnimation({

      duration: 1000,
      timingFunction: "ease",
      delay: 100,
      transformOrigin: "50% 50%",

    })
    animation1.rotate(180).step();     //边旋转边放大
    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData: animation.export(),
      animationData1: animation1.export()
    })
  }
})