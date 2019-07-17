import store from '../../utils/store.js';
import IMController from '../../utils/im.js';
const app = getApp();
const globalData = app.globalData;
Page(store.createPage({

  /**
   * 页面的初始数据
   */
  data: {
    chatList: {},
    ifhide: false,
  },
  watch: {
    chartlist(data){
      console.log("消息页面", data);
      this.setData({
        chatList:data
      });
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      chatList: globalData.chartlist
    });
    console.log(this.ifsign(globalData.cardInfo.imAccid))
    if (globalData.cardInfo.imAccid==undefined){
      app.getcompanyInfo();
      app.getcardInfo().then((res)=>{
        store.dispatch('cardInfo', res.data.data);
        wx.navigateTo({
          url: `../chart/chart?toAccount=${globalData.cardInfo.imAccid}&headUrlMINGet=${globalData.cardInfo.cardImageUrl}&nickname=${globalData.cardInfo.name}&sign=${this.ifsign(globalData.cardInfo.imAccid)}`,
        })
      })
      return false
    }
    wx.hideTabBarRedDot({
      index: 3
    });
    
    console.log(globalData.iftoAccid)
    if(globalData.iftoAccid){
      //跳转聊天页
      wx.navigateTo({
        url: `../chart/chart?toAccount=${globalData.cardInfo.imAccid}&headUrlMINGet=${globalData.cardInfo.cardImageUrl}&nickname=${globalData.cardInfo.name}&sign=${this.ifsign(globalData.cardInfo.imAccid)}`,
      })
    }
  },
  //数据刷新
  getTheSame(attendUid, id, cardData) {

  },
  ifwatch(){

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //跳转聊天页面
  chartPage(e) {
    // app.globalData.appnim.resetAllSessionUnread()
    wx.navigateTo({
      url: `../chart/chart?toAccount=${e.currentTarget.dataset.session}&headUrlMINGet=${e.currentTarget.dataset.headimg}&nickname=${e.currentTarget.dataset.nickname}&sign=${e.currentTarget.dataset.sign}`,
    })
  },
  ifsign(e){
    console.log(e)
    for (let i in this.data.chatList){
      if (e == this.data.chatList[i].account){
       // break
        console.log("未读", this.data.chatList[i].account);
        let sign = this.data.chatList[i].sign == "" ? 0 : this.data.chatList[i].sign
        if (sign==undefined){
          return 0
        }
        return sign;
      }else{
        console.log("未读1", this.data.chatList[i].sign)
        return 0
      }
    }
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

  }
}))