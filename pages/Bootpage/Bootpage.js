import store from '../../utils/store.js';
import IMController from '../../utils/im.js';
//index.js
//获取应用实例
const app = getApp()
const globalData = app.globalData
Page({
  data: {
    multipleSlots:false,
    imgUrls: [
      'https://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/propaganda/banner_01.png',
      'https://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/propaganda/banner_02.png',
      'https://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/propaganda/banner_03.png',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    show: false,
    username: '',
    password: '',
    wordPhone: "",
    applyName: "",
    applyPhone: "",
    applyTest: "",
    experienceName: "",
    experiencePhone: "",
  },
  getUserInfoResult(e) {
    //授权成功后处理 ： 展示tabbar 隐藏modal
    if (e.detail.userInfo) {
      let data = e.detail.userInfo;
      console.log(data)
    }

  },
  getUserInfoResult1(e){
    console.log(e)
  },
  ifurl(options){
    if (options.scene != undefined) {
      //扫码进入
      console.log('扫码进入');
      let urlDataArr = decodeURIComponent(options.scene);
      urlDataArr = urlDataArr.split("A");
      store.dispatch('cardEmplyId', urlDataArr[1]);
      store.dispatch('companyId', urlDataArr[0]);
      store.dispatch('source', 1);
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      //首先判断是否是视频或消息进入的
      if (options.video =="video"){
        console.log("视频进入");
        store.dispatch('cardEmplyId', options.wxCardEmployeeId);
        store.dispatch('companyId', options.companyId);
        if (globalData.visitorInfo){
          wx.switchTab({
            url: '/pages/video/video',
          });
          return false
        }else{
          wx.switchTab({
            url: `/pages/index/index`,
          });
          return false
        }
       
      };
      //消息进入
      if (options.url != undefined) {
        store.dispatch('cardEmplyId', options.wxCardEmployeeId);
        store.dispatch('companyId', options.companyId);
        store.dispatch('ifurlim', true);
        if (globalData.ifurlimok){
          wx.switchTab({
            url: `/pages/chartlist/chartlist`,
          });
        }
        console.log(options.wxCardEmployeeId)
        console.log(options.companyId);
        
        return false
      };
      if (options.companyId != undefined && options.wxCardEmployeeId != undefined) {
        //转发进入
        console.log('转发进入');
        wx.switchTab({
          url: '/pages/index/index',
        });
        store.dispatch('source', 0);
        store.dispatch('cardEmplyId', options.wxCardEmployeeId);
        store.dispatch('companyId', options.companyId);
      } else {
        //判断是否有用户信息如有进入列表页，入没有进入宣传页
        if (globalData.visitorInfo) {
          //进入列表页
          console.log('进入列表页');
          wx.redirectTo({
            url: '/pages/cardlist/cardlist',
          })
          store.dispatch('source', 3);
          this.navigaeToCall()
        } else {
          //进入宣传页
          console.log('进入宣传页');
          this.setData({
            multipleSlots:true
          })
        }

      }
    }
  },
  //获取名片列表
  navigaeToCall() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getRelation',
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' }, // 默认值
      data: { pageNum: 1, visitorId: globalData.visitorInfo.id },
      success: res => {
        console.log("获取名片列表");
      },
      fail: res => {
        
      }
    });
  },
  onLoad(options) {
    console.log(options);
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
                    new IMController({
                      myAppKey: globalData.myAppKey,
                      myAccount: globalData.visitorInfo.accid,
                      myToken: globalData.visitorInfo.token,
                    });
                    console.log(res.data.data);
                    _this.ifurl(options)
                  } else {
                    //需要授权
                    _this.ifurl(options)
                  }
                },
                fail: res => {
                  console.log(res)
                }
              });
            },fail: res => {
              console.log(res);
              this.setData({
                multipleSlots: true
              })
            }
          })
        }
      }
    });
  },
  //引导页
  onClose(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      setTimeout(() => {
        this.setData({
          show: false
        });
      }, 1000);
    } else {
      this.setData({
        show: false
      });
    }
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  popup() {
    this.setData({
      "show": true
    })
  },
  nameTest(val) {
    console.log(val)
    if (val.detail.value == '' && val.target.dataset.type == 1) {
      Toast('姓名不能为空');
      return false
    } else if (val.detail.value != '' && val.target.dataset.type == 1) {
      this.setData({
        "applyName": val.detail.value
      })
      return false
    }
    if (val.target.dataset.type == 2) {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(val.detail.value))) {
        Toast("手机号码有误，请重填");
        this.setData({
          "applyPhone": ""
        })
        return false
      } else {
        this.setData({
          "applyPhone": val.detail.value
        })
        return false
      }
    }

    if (val.target.dataset.type == 22) {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(val.detail.value))) {
        Toast("手机号码有误，请重填");
        this.setData({
          "experiencePhone": ""
        })
        return false
      } else {
        this.setData({
          "experiencePhone": val.detail.value
        })
        return false
      }
    }

    if (val.target.dataset.type == 11) {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(val.detail.value))) {
        Toast("手机号码有误，请重填");
        this.setData({
          "wordPhone": ""
        })
      } else {
        this.setData({
          "wordPhone": val.detail.value
        })
      }
    }
  },
  submitWork() {
    if (this.data.wordPhone == '') {
      Toast("手机号码不能为空");
      return false
    };
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/official/saveConcact',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        openId: globalData.userInfo.openId,
        name: "",
        telphone: this.data.wordPhone
      },
      success: res => {
        Toast("提交成功");
        this.setData({
          "wordPhone": ""
        })
      }
    });
  },
  submitfoot() {
    if (this.data.applyPhone == '') {
      Toast("手机号码不能为空");
      return false
    };
    if (this.data.applyName == '') {
      Toast("姓名不能为空");
      return false
    };
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/official/saveConcact',
      method: 'POST',
      data: {
        openId: globalData.userInfo.openId,
        name: this.data.applyName,
        telphone: this.data.applyPhone
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: res => {
        Toast("提交成功");
        this.setData({
          "applyPhone": "",
          "applyName": ""
        })
      }
    });
  },
  submitexperiencePhone() {
    if (this.data.experiencePhone == '') {
      Toast("手机号码不能为空");
      return false
    };
    if (this.data.applyName == '') {
      Toast("姓名不能为空");
      return false
    };
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/official/saveConcact',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        openId: globalData.userInfo.openId,
        name: this.data.applyName,
        telphone: this.data.experiencePhone
      },
      success: res => {
        Toast("提交成功");
        this.setData({
          "experiencePhone": "",
          "applyName": "",
          "show": false
        });
      }
    });
  },
})
