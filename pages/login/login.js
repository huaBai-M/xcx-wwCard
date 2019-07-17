// pages/login/login.js
import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData
import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveData: {}
     
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      "receiveData": options
    });
    this.selectComponent('#basicinformation').receiveDataEven();
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

  },
  concel(){
    Dialog.confirm({
      title: '提示',
      message: '确定要取消编辑么？'
    }).then(() => {
      this.burialRecords(3);
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch(() => {
      // on cancel
    });
  },
  confirm(){
    this.selectComponent('#basicinformation').loginData();
  },
  onMyloginEvent(e){
    console.log(e.detail);
    let _this=this;
    let data = e.detail;
    if (data.headImageUrl == '' || data.headImageUrl == null || data.headImageUrl==undefined) {
      Toast("头像不能为空~");
      return false
    };
    if (data.name == '' || data.name == null || data.name == undefined) {
      Toast("姓名不能为空~");
      return false
    };
    if (data.company == '' || data.company == null || data.company == undefined) {
      Toast("公司名称不能为空~");
      return false
    };
    if (data.trade == '' || data.trade == null || data.trade == undefined) {
      Toast("公司行业不能为空~");
      return false
    };
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(data.email))) {
      Toast("邮箱地址格式不正确~");
      return false;
    };
    if (globalData.openid == "") {
      console.log("openid为空");
      return false;
    };
    data.openId = globalData.openid
    data.sfaCompanyId = globalData.cardInfo.sfaCompanyId
    console.log(data)
    Dialog.confirm({
      title: '提示',
      message: '确定要保存当前编辑的注册信息么？'
    }).then(() => {
      // 
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/login/regist',
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: data,
        success(res) {
          console.log(res);
          if (res.data.status!=200){
            Toast(res.data.msg);
            return false;
          };
          Toast(res.data.msg);
          store.dispatch('companyId', res.data.data.companyId);
          store.dispatch('cardEmplyId', res.data.data.id);
          _this.burialRecords(4);
          wx.switchTab({
            url: '/pages/index/index',
          })
        },

      })

    }).catch(() => {
      // on cancel
    });
  },
  burialRecords(operationType){
    wx.request({  //埋点
      url: globalData.webRequsetUrl + '/weixin/card/burialRecords',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,
        operationType: operationType
      },
      success(res) {
        console.log('登陆埋点')
        console.log(res)
      }
    })
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

  }
})