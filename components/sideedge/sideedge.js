import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData
// components/sideedge/sideedge.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stateShouQuan:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    sideHide: true,
    white: false,
    stateShouQuan: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示隐藏侧边栏
    clickSide(e) {
      this.setData({
        sideHide: false
      })
    },
    //电话
    clickWhite(e) {
      this.setData({
        "white": true
      })
      console.log(this.data.white);
      wx.makePhoneCall({
        phoneNumber: globalData.cardInfo.telphone,
        success: res => {
          console.log(res)
        }
      })

      wx.request({
        url: globalData.webRequsetUrlT + '/radar/active',
        method: 'POST',
        data: {
          companyId: globalData.companyId, //公司id
          openId: globalData.openid,
          sfaCompanyId: globalData.cardInfo.sfaCompanyId,
          type: 1,
          wxCardEmployeeId: globalData.cardEmplyId, //名片id
          wxCardVisitorId: globalData.visitorInfo.id, //访客id 
          loginId: globalData.cardInfo.loginId,
          loginType: globalData.cardInfo.loginType
        },
        success: res => {
          console.log(res);
        }
      });
    },
    //留言
    clickBlue(e) {
      this.setData({
        white: false
      })
      wx.switchTab({
        url: '/pages/chartlist/chartlist'
      })
    },
    phoneCall(){
      
    },
    // 跳转信息页面前授权获取电话
    getPhoneNumbers(e) {
      let _this = this;
      this.setData({
        "white": false
      })
      wx.switchTab({
        url: '/pages/chartlist/chartlist',
      })
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
            // fromType: 0,
            // fromId: shopId,
            // fromEmplyId: emplyId
          },
          success(res) {
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
            let changeTel = 'change.tel';
            _this.setData({
              [changeTel]: res.data.data,
              phoneMessage: false,
              stateShouQuan: globalData.phoneSates
            })
            wx.switchTab({
              url: '/pages/chartlist/chartlist',
            })
          },

        })
      }

    },
  },
    ready() {
        // console.log(globalData.phoneSates)
        this.setData({
            stateShouQuan: globalData.phoneSates
        })
        // console.log(this.data.stateShouQuan)
        if (globalData.cardInfo.currentExchangeStatus == 0) {
            this.setData({
                stateShouQuan: false
            })
        } else {
            this.setData({
                stateShouQuan: true
            })
        }
    }
})
