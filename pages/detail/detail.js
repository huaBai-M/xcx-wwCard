import store from '../../utils/store.js';
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
const globalData = app.globalData
Page(store.createPage({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],
    proId: '',
    message: [],
    comName: [],
    phoneMessage: true,
    stateShouQuan: true
  },
  globalData: ['productsdata'],
  watch:{
    productsdata(data){
      console.log("详情页更新",data)
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      products: globalData.productsdata,
      comName: globalData.cardInfo,
      stateShouQuan: globalData.phoneSates,
    });
    WxParse.wxParse('displayImgs', 'html', this.data.products.displayImgs, this, 0);
  },
  toMessage(){
    wx.switchTab({
      url: '/pages/chartlist/chartlist',
    })
  },
  phoneCall(){
    wx.request({
      url: globalData.webRequsetUrlT + '/radar/active',
      method: 'POST',
      data: {
        companyId: globalData.companyId, //公司id
        openId: globalData.openid,
        type: 1,
        wxCardEmployeeId: globalData.cardEmplyId, //名片id
        wxCardVisitorId: globalData.visitorInfo.id, //访客id 
        loginId: globalData.cardInfo.loginId,
        sfaCompanyId: globalData.cardInfo.sfaCompanyId,
        loginType: globalData.cardInfo.loginType
      },
      success: res => {
        console.log(res);
        wx.makePhoneCall({
          phoneNumber: globalData.cardInfo.telphone
        })
      }
    });
  },
  getPhoneNumbers(e){
    wx.switchTab({
      url: '/pages/chartlist/chartlist'
    })
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/actice/getWxBindPhone',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        openId: globalData.openId,
        sessionKey: globalData.session_key,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success:(res)=> {
        console.log(res)
          wx.request({
              url: globalData.webRequsetUrl + '/weixin/card/actice/updateExchangeStatus',
              method: 'POST',
              header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                  visitorId: globalData.visitorInfo.bindWxCardEmployeeId,
                  emplyId: globalData.cardInfo.id
              },
              success(Res) {
                  console.log(Res)
              },

          })
        store.dispatch('phoneSates', true);
        store.dispatch('telphone', res.data.data);
        this.setData({
          stateShouQuan: true
        })
        wx.switchTab({
          url: '/pages/chartlist/chartlist'
        })
      },

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
      if (globalData.cardInfo.currentExchangeStatus == 0){
          this.setData({
              stateShouQuan:false
          })
      }else{
          this.setData({
              stateShouQuan: true
          })
      }
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

  //转发
  onShareAppMessage(data) {
    return {
      path: `pages/Bootpage/Bootpage?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.cardEmplyId}`,
      success: res => {
        console.log("转发成功", res);
      }
    }
  },
}))