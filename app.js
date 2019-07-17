//app.js
import store from 'utils/store.js'
App(store.createApp({
  globalData: {
    cardInfo: {},//名片信息
    companyInfo: {},//公司信息
    visitorInfo: {},//访客信息
    openid: null,
    session_key: null,
    source:0,
    companyId:-1,
    cardEmplyId:-1,
    visitstart:false,
    phoneSates: false,
    appnim:null,
    iftoAccid:true,
    ifurlim: false,
    ifurlimok:false,
    result:true,
    myAppKey:"e6f40473963ff1306324fc0fa30b9708",
    chartlist: [],//信息列表
    chart: [],
    productsdata: {},//详情页数据
    callGroup:{},//分组
    // webRequsetUrl: 'http://192.168.1.131:8085',
    // webRequsetUrlT: 'http://192.168.1.131:8082',
    webRequsetUrl: "https://card.wayboo.com",
    webRequsetUrlT: 'https://card.wayboo.com',
    telphone:'',
    stateImg:false
  },
  onLaunch(e) {
    if (wx.canIUse('getUpdateManager')) {
      console.log("更新")
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getcardInfo() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.webRequsetUrl + '/weixin/card/getCardInfo',
        method: 'GET',
        data: {
          cardEmplyId: this.globalData.cardEmplyId, //名片id
          companyId: this.globalData.companyId, //公司id
          openId: this.globalData.openid,
          source: this.globalData.source
        },
        success: (res) => {
          resolve(res)
        }
      }); 
    });
  },
  getcompanyInfo(){
      wx.request({
        url: this.globalData.webRequsetUrl + '/weixin/card/getCompanyInfo',
        method: 'GET',
        data: {
          companyId: this.globalData.companyId, //公司id
          openId: this.globalData.openid
        },
        success: res => {
          store.dispatch('companyInfo', res.data.data);
        }
      });
  },
  //  判断场景值
  onShow(res) {
    var that = this;
    console.log(res)
    if (res.scene === 1038 || res.scene === 1047 || res.scene == 1124 || res.scene == 1011) {
        that.globalData.stateImg = false;
    }else {
        that.globalData.stateImg = true;
    }
  }
}))