// components/change/change.js
import store from '../../utils/store.js';
var app = getApp();
var globalData = app.globalData;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
  },
  data: {
    // 这里是一些组件内部数据
    showCom: true,
    cardData: {},
    changeShow: false
  },
  methods: {
    // 这里是一个自定义方法
    onCloseCom() {
      this.setData({ changeShow: false });
      store.dispatch('changeShow', false);
      wx.showTabBar();
    },
    onSeeClose() {
      this.setData({
        changeShow: false
      });
      wx.showTabBar();
    },
    ifopendata() {
      var that = this;
      console.log(globalData.cardInfo)
      if (globalData.cardInfo != null) {
        that.setData({
          cardData: globalData.cardInfo
        })
        if (globalData.visitorInfo.bindWxCardEmployeeId != globalData.cardInfo.id) {
          if (globalData.cardInfo.currentExchangeStatus == 0) {
            store.dispatch('phoneSates', false);
            setTimeout(() => {
              that.setData({
                changeShow: true
              })
            }, 1000)

            wx.hideTabBar();
          } else {
            store.dispatch('phoneSates', true);
            that.setData({
              changeShow: false
            })
            wx.showTabBar();
          }
        } else {
          that.setData({
            changeShow: false
          })
          wx.showTabBar();
        }

      }
    },
    // 交换名片前授权获取电话
    getPhoneNumberH(e) {
      var that = this;
      console.log(e.detail.encryptedData)
      if (e.detail.encryptedData != null) {
        wx.request({
          url: globalData.webRequsetUrl + '/weixin/card/actice/getWxBindPhone',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            openId: globalData.openid,
            sessionKey: globalData.session_key,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          success(res) {
            store.dispatch('phoneSates', true);
            that.setData({
              changeShow: false
            })
            wx.showTabBar();
            wx.request({
              url: globalData.webRequsetUrl + '/weixin/card/actice/updateExchangeStatus',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                visitorId: globalData.visitorInfo.id,
                emplyId: globalData.cardInfo.id
              },
              success(Res) {
                console.log(Res)
              },

            })
            wx.request({
              url: globalData.webRequsetUrlT + '/radar/exchange',
              method: 'POST',
              data: {
                name: globalData.visitorInfo.nickName, //姓名
                phone: res.data.data, //电话
                companyId: globalData.companyId, //公司id 
                openId: globalData.openid,
                sfaCompanyId: globalData.cardInfo.sfaCompanyId,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorInfo.id, //访客id
                loginId: globalData.cardInfo.loginId,
                loginType: globalData.cardInfo.loginType
              },
              success: Res1 => {
                console.log(Res1);
                // this.catchtouch();
              },
              erreor: err => {
                Toast('无法连接服务器');
              }
            });
            store.dispatch('phoneSates', true);
            store.dispatch('telphone', res.data.data);
            that.triggerEvent('myevent2', { stateShouQuan: app.globalData.phoneSates, telphone: res.data.data });
            console.log(app.globalData.phoneSates)
            that.setData({ showCom: false });
            wx.showTabBar();
          },

        })
      } else {
        console.log('sssssssss');
        that.setData({ showCom: false, changeShow: false });
        store.dispatch('changeShow', false);
        wx.showTabBar();
      }

    },
    formSubmit(e) {
      wx.request({
        url: app.globalData.webRequsetUrl + '/weixin/card/actice/updateFormId',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          visitorId: globalData.visitorInfo.id,//访客id
          openId: globalData.openid,
          formId: e.detail.formId
        },
        success: function (res) {

          console.log(res)

        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },

  ready() {

  }
})


