// pages/bangding/bangding.js
import Toast from '../../dist/toast/toast';
const app = getApp()
const globalData = app.globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
        voteTitle: null,
        tel: '',
        code:'',
        codeReal:'',
        send: false,
        currentTime: 60,
        disabled: true,
        telphoneDisplay:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
      console.log(options);
      if (options.telphoneDisplay){
        this.setData({
          telphoneDisplay: options.telphoneDisplay
        });
        wx.setNavigationBarTitle({
          title: '添加其它号码'
        })
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
      if (this.data.telphoneDisplay){
          return false
        }
        wx.request({  //埋点
            url: globalData.webRequsetUrlT + '/weixin/card/burialRecords',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                visitorId: globalData.visitorInfo.id, //访客id ,
                operationType: 0,
                sfaCompanyId: globalData.cardInfo.sfaCompanyId
            },
            success(res) {
                console.log('返回埋点')
                console.log(res)
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

    },
    //验证码倒计时函数
    getCode (options) {
        var that = this;
        var currentTime = that.data.currentTime;
        var interval = setInterval(function () {
            that.setData({
                send: true,
                currentTime: (currentTime - 1)
            })
            currentTime--;
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    send: false,
                    currentTime: 60
                })
            }
        }, 1000)
    },
    //验证码倒计时结束
    formName (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    formCode (e) {
        this.setData({
            code: e.detail.value
        })
    },
    successPhone(){

    },
    //获取验证码
    clickPost (e) {
        var that = this;
        var mobile = that.data.tel;
        if (!(/^1[34578]\d{9}$/.test(mobile)) || mobile.length > 11) {
            Toast('请输入正确的手机号')
        } else {
            that.getCode();
            wx.request({
              url: globalData.webRequsetUrl + '/weixin/card/getMobileCode',
              method: 'GET',
              header: {
                'content-type': 'application/json' // 默认值
              },
              data: {
                mobile: mobile
              },
              success(res) {
                console.log(res)
                Toast("验证码已发送");
                that.setData({
                  send: true,
                  codeReal: res.data.data
                })
              }
            });
            //修改进入不调用埋点
            if (this.data.telphoneDisplay) {
              return false
            }
            wx.request({  //埋点
                url: globalData.webRequsetUrlT + '/weixin/card/burialRecords',
                method: 'GET',
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                  visitorId: globalData.visitorInfo.id, //访客id ,
                  operationType: 1,
                  sfaCompanyId: globalData.cardInfo.sfaCompanyId
                },
                success(res) {
                    console.log('发送验证码埋点')
                    console.log(res)
                }
            })

        }
    },
  //跳转前埋点  
  burialRecords(){
    wx.request({  //埋点
      url: globalData.webRequsetUrlT + '/weixin/card/burialRecords',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id, //访客id ,
        operationType: 2,
        sfaCompanyId: globalData.cardInfo.sfaCompanyId
      },
      success(res) {
        console.log('完成埋点',res)
      }
    })
  },
    // 点击绑定
    clickBang(e) {
      var phone = this.data.tel;
      var code = this.data.code;
        if (phone == '' || code == '') {
            Toast('请输入完整的手机号和验证码');
        } else if (code !== this.data.codeReal){
            Toast('验证码不正确，请重新输入')
        }else{
          //判断是否为修改进入
          if (this.data.telphoneDisplay){
            console.log(1558)
            wx.reLaunch({
              url: '/pages/operation/operation?telphoneDisplay=' + phone,
              })
              return false
            }
            wx.request({
              url: globalData.webRequsetUrl + '/weixin/card/login/check',
                method: 'GET',
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                    phone: phone,
                    openId: globalData.openid
                },
                success(res) {
                  wx.reLaunch({
                    url: '/pages/login/login?phone=' + phone,
                  })
                }
            })
        }
    },
})