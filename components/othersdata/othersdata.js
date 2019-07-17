// components/othersdata/othersdata.js
import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    card:Object,
    stateShouQuan:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    renqi:true,
    dianzan: true,
    zhuanfa: true,
    abtdisabled: false,
    trueOrFalse:true,
    cardData:{},
    companyData:{},
    stateShouQuan:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showdata(){
      console.log(this.data.card);
      console.log(globalData.companyInfo)
      this.setData({
        cardData: this.data.card,
        companyData: globalData.companyInfo
      })
    },
    okzhuanfa(){
      console.log("转发成功")
      this.setData({
        zhuanfa:false
      })
    },
    erweimaAdd() {
      wx.navigateTo({
        url: '/pages/cardCode/cardCode',
      })
    },
    //点赞
    clickDianzan(e) {
      var _this = this;
      this.setData({
        "abtdisabled": true
      })
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/actice/thumb',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          employeeId: globalData.cardEmplyId, //名片id
          visitorId: globalData.visitorInfo.id, //访客id
          loginId: _this.data.cardData.loginId,
          loginType: _this.data.cardData.loginType
        },
        success: res => {
          console.log(_this.data.cardData.thumb);
          _this.setData({
            dianzan: !_this.data.dianzan,
            "abtdisabled": false
          })
        }
      });
    },
    //
    showHide(){
      this.setData({
        trueOrFalse: !this.data.trueOrFalse
      })
    },
    //拨打电话
    telerPhone(res) {
      let val = res.currentTarget.dataset.value
      //调取
      wx.request({
        url: globalData.webRequsetUrlT + '/radar/active',
        method: 'POST',
        data: {
          companyId: globalData.companyId, //公司id
          wxCardEmployeeId: globalData.cardEmplyId, //名片id
          wxCardVisitorId: globalData.visitorInfo.id, //访客id 
          openId: globalData.openid,
          type: res.currentTarget.dataset.type,
          loginId: this.data.cardData.loginId,
          loginType: this.data.cardData.loginType,
          sfaCompanyId: this.data.cardData.sfaCompanyId,
        },
        success: res => {
          console.log(res);
          wx.makePhoneCall({
            phoneNumber: val
          })
        }
      });
    },
    //复制
    copy(res) {
      console.log(res.currentTarget.dataset.type);
      let val = res.currentTarget.dataset.value
      if (res.currentTarget.dataset.type == 5) {
        wx.setClipboardData({
          data: val,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) { }
            })
          }
        })
        return false
      }
      wx.setClipboardData({
        data: val,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) { }
          })
        }
      })

    },
    //交换手机号
    onShowChange(){
      this.triggerEvent('myevent', { msg: "1", data: true });
    },
    getPhoneNumber(e){
      let _this=this;
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/actice/getWxBindPhone',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          openId:globalData.openid,
          sessionKey: globalData.session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success(res) {
          _this.triggerEvent('myevent', {msg:"0", data: res });
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
                    store.dispatch('phoneSates', true);
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
          _this.setData({
            stateShouQuan:true
          })
        },

      })
    },
    //同步通讯录
    phoneOpen() {
      //调取
      wx.request({
        url: globalData.webRequsetUrlT + '/radar/active',
        method: 'POST',
        data: {
          companyId: globalData.companyId, //公司id
          openId: globalData.openid,
          type: 2,
          wxCardEmployeeId: globalData.cardEmplyId, //名片id
          wxCardVisitorId: globalData.visitorInfo.id, //访客id 
          loginId: this.data.cardData.loginId,
          sfaCompanyId: this.data.cardData.sfaCompanyId,
          loginType: this.data.cardData.loginType
        },
        success: res => {
          console.log(res);
          wx.addPhoneContact({
            firstName: this.data.cardData.name,
            mobilePhoneNumber: this.data.cardData.telphone,
            organization: this.data.cardData.company,
          })
        }
      });
    },
  },
  ready() {
    this.setData({
      stateShouQuan: globalData.phoneSates
    })
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
