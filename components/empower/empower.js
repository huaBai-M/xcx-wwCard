import store from '../../utils/store.js';
const app = getApp();
const globalData = app.globalData;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {

  },
  data: {
    isShow: false,
  },
  watch: {
    openid(val) {
      console.log(val)
    }
  },
  methods: {
    //不可滚动 
    noneview() {
      return false
    },
    //点击授权
    getUserInfoResult: function (e) {
      //授权成功后处理 ： 展示tabbar 隐藏modal
      if (e.detail.userInfo) {
        this.setData({ isShow: false });
        wx.showTabBar({})
        console.log("点击授权")
        console.log(e.detail.userInfo)
        this.userMessageSave(e.detail.userInfo)
      }

    },
    // 保存用户信息
    userMessageSave(data) {
      let _this = this;
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/save',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          avatarUrl: data.avatarUrl,
          city: data.city,
          country: data.country,
          // id: null,
          gender: data.gender,
          nickName: _this.emoji2Str(data.nickName),
          openId: globalData.openid,
          province: data.province,
          source: globalData.source,
          companyId: globalData.companyId,
          cardId: globalData.cardEmplyId,
        },
        success(res) {
          console.log("获取用户信息")
          console.log(res);
          store.dispatch('visitorInfo', res.data.data);
          store.dispatch('result', false);
          new IMController({
            myAppKey: globalData.myAppKey,
            myAccount: globalData.visitorInfo.accid,
            myToken: globalData.visitorInfo.token,
          });
        }
      })
    },
    emoji2Str(str) {
      return unescape(escape(str).replace(/\%uD.{3}/g, ''));
    },
  },
  //页面加载后..
  ready() {
    let _this=this
    //首先判断是否有访客数据
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: globalData.webRequsetUrl + '/weixin/code',
            data: {
              code: res.code
            },
            success(res) {
              store.dispatch('openid', res.data.data.openid);
              store.dispatch('session_key', res.data.data.session_key);
              //查看是否有访客信息，如没有需要授权
              wx.request({
                url: globalData.webRequsetUrl + '/weixin/getVisitor',
                data: {
                  openId: globalData.openid
                },
                success: res => {
                  if (res.data.data) {
                    store.dispatch('visitorInfo', res.data.data);
                  } else {
                    //需要授权
                    if (globalData.result){
                      _this.setData({ isShow: true });
                    }
                  }
                },
                fail: res => {
                  console.log(res)
                }
              });
            }
          })
        }
      }
    });

  }
})
