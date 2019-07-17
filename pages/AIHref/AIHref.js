// pages/AIHref/AIHref.js
const app = getApp();
const globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //http://jzl123.cn/syb2/mobiledataAnalysisController/getBusinessCardByXcc?xcxOpenId=
    // console.log(wx.getStorageSync('openid'))
    let url = `https://sybnew.wayboo.com/mobiledataAnalysisController/getBusinessCardByXcc?xcxOpenId=${globalData.openid}`
    console.log(url)
    this.setData({
      url:url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    globalData.iftoAccid=false;
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
    console.log("返回上一页")
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

  //转发
  onShareAppMessage(data) {
    return {
      path: `pages/Bootpage/Bootpage?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.cardEmplyId}`,
      success: res => {
        console.log("转发成功", res);
      }
    }
  },
  toBackClick() {
    console.log("返回上一页")
  },
})