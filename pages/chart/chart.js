import store from '../../utils/store.js';
const app = getApp();
var inputVal = '';
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
const globalData = app.globalData;
Page(store.createPage({
  data: {
    focusCheck: false,
    msgList: [],
    newmsgList: [],
    inputVal: '',
    nim: "",
    showform: true,
    myAppKey: "",
    myAccount: "",//账号
    myToken: "",//密码
    toAccount: "",//和谁聊天
    scrollHeight: '100vh',
    inputBottom: 0,
    scrolltop: "100000",
    sessionId: "",
    headUrlMIN: "",
    headUrlMINGet: "",
    sign: 0,
    historyif: true
  },
  watch: {
    chart(msg) {
      console.log('有新消息啦', msg, this);
      console.log(msg);
      if (msg.from == this.data.toAccount) {
        this.getMsgHtmlT('', msg);
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let nickname = options.nickname;
    if (nickname == 'null') {
      nickname = ''
    }
    console.log(nickname, "名")
    wx.setNavigationBarTitle({
      title: nickname
    })
    this.setData({
      toAccount: options.toAccount,
      headUrlMINGet: options.headUrlMINGet,
      myAccount: globalData.visitorInfo.accid,
      headUrlMIN: globalData.visitorInfo.avatarUrl,
      sign: options.sign
    });
    app.globalData.appnim.getHistoryMsgs({
      scene: 'p2p',
      to: this.data.toAccount,
      done: this.getHistoryMsgsDone,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    store.dispatch('iftoAccid', false);
    // wx.setNavigationBarTitle({
    //   title: globalData.cardData.nickName
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  //别人
  getMsgHtml(headSrc, str) {
    var msgList = this.data.msgList
    msgList.push({
      speaker: 'server',
      contentType: 'text',
      content: str.text,
      time: str.time
    })
    this.upView(msgList);
    // this.setData({
    //   msgList: msgList
    // })
  },
  getMsgHtmlT(headSrc, str) {
    console.log("是否", str)
    var newmsgList = this.data.newmsgList
    var msgList = this.data.msgList
    newmsgList.push({
      speaker: 'server',
      contentType: 'text',
      content: str.text,
      time: str.time
    })
    msgList.push({
      speaker: 'server',
      contentType: 'text',
      content: str.text,
      time: str.time
    })
    // this.upView(msgList);
    this.setData({
      newmsgList: newmsgList,
      msgList: msgList
    })
  },
  //自己
  sendMsgHtml(headSrc, str) {
    var msgList = this.data.msgList
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: str.text,
      time: str.time
    })
    console.log("自己")
    //this.upView(msgList);
  },
  //结束list
  upView(msgList) {
    console.log("结束list")
  },
  getHistoryMsgsDone(error, obj) {
    console.log('获取p2p历史消息' + (!error ? '成功' : '失败'));
    console.log(error);
    console.log(obj);
    if (!error) {
      console.log(obj.msgs);
      for (var index = obj.msgs.length - 1; index >= 0; index--) {
        var from = obj.msgs[index].from;
        // 别人
        if (from == this.data.toAccount) {
          this.getMsgHtml('', obj.msgs[index]);
        }
        // 自己
        if (from == this.data.myAccount) {
          this.sendMsgHtml('', obj.msgs[index]);
        }

        this.data.sessionId = obj.msgs[index].sessionId;
        this.setData({
          sessionId: obj.msgs[index].sessionId
        })
        console.log(this.data.sessionId);
      }
      this.setData({
        msgList: this.data.msgList,
        scrollHeig6ht: (windowHeight - 0) + 'px',
        toView: 'msg-' + (this.data.msgList.length - 1),
      });
      app.globalData.appnim.resetAllSessionUnread();
      //如有未读数要显示
      if (this.data.sign != 0 && this.data.sign != undefined) {
        console.log("有未读消息", this.data.sign);
        console.log(this.data.msgList);
        console.log(this.data.msgList.slice(-this.data.sign))
        this.setData({
          newmsgList: this.data.msgList.slice(-this.data.sign)
        })
      }
    }
  },
  onPullDownRefresh() {

  },
  historyfun() {
    var list = JSON.stringify(this.data.msgList)
    this.setData({
      newmsgList: JSON.parse(list),
      historyif: false
    })
    this.setData({
      scrollHeig6ht: (windowHeight - 0) + 'px',
      toView: 'msg-' + (this.data.newmsgList.length - 1),
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 获取聚焦
   */
  focus(e) {
    keyHeight = e.detail.height;
    console.log(keyHeight)
    this.setData({
      scrollHeig6ht: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  formSubmit(val) {
    console.log(val.detail.formId);
    this.setData({
      "showform": false,
      focusCheck: true
    });
    wx.request({
      url: app.globalData.webRequsetUrl + '/weixin/card/actice/updateFormId',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客id
        openId: globalData.openid,
        formId: val.detail.formId
      },
      success: function (res) {

        console.log(res)

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  inputValchange(e) {
    console.log(e)
    this.setData({
      inputVal: e.detail.value
    });
  },
  sendClick(e) {
    if (this.data.inputVal == '') {
      return false;
    }
    console.log(e.detail.value)
    this.data.newmsgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    });
    this.data.msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    this.sendTextFun(this.data.inputVal)
    this.setData({
      newmsgList: this.data.newmsgList,
      msgList: this.data.msgList,
      inputVal: ""
    });
    console.log(this.data.inputVal)

  },
  sendClickT() {
    if (this.data.inputVal == '') {
      return false;
    }
    this.data.newmsgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: this.data.inputVal
    });
    this.data.msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: this.data.inputVal
    })
    this.sendTextFun(this.data.inputVal)
    this.setData({
      newmsgList: this.data.newmsgList,
      msgList: this.data.msgList,
      inputVal: ""
    });
    setTimeout(() => {
      this.setData({
        inputVal: ""
      });
    }, 200)
    console.log(this.data.inputVal)
  },
  //发送消息im
  sendTextFun(text) {
    app.globalData.appnim.sendText({
      scene: 'p2p',
      to: this.data.toAccount,
      text: text,
      done: this.sendMsgDone
    });
    console.log('正在发送p2p text消息, id=');
  },
  sendMsgDone(error, msg) {
    console.log(error);
    console.log(msg);
    wx.request({
      url: globalData.webRequsetUrlT + '/radar/ask',
      method: 'post',
      data: {
        companyId: globalData.companyId, //公司id
        openId: globalData.openid,//
        loginId: globalData.cardInfo.loginId,//账户id
        sfaCompanyId: globalData.cardInfo.sfaCompanyId,
        loginType: globalData.cardInfo.loginType,//账户类型
        wxCardEmployeeId: globalData.cardInfo.id,//名片id
        wxCardVisitorId: globalData.visitorInfo.id,//访客id
      },
      success: res => {
        console.log(res)
      }
    });
    console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
  },
  /**
   * 退回上一页
   */
  toBackClick() {

    // wx.navigateBack({})
  },
  onUnload: function () {
    // let pages = getCurrentPages().length - 1;
    // console.log('需要销毁的页面：' + pages);
    // wx.navigateBack({
    //   delta: pages
    // })
  }

}))
