import store from '../../utils/store.js';
var WxParse = require('../../wxParse/wxParse.js');
//index.js
//获取应用实例
const app = getApp()
const globalData = app.globalData
Page(store.createPage({
  data: {
    HotProduct: {},
    cardData: {},
    companyInfo: {},
    visitorInfo: {},
    show: false,
    userState: true,
    telphone: "",
    stateShouQuan: false,
    showform: true,
    showform1: true,
    showform2: true,
    molId: 1,
    headImg: ''
  },
  globalData: ['visitorInfo'],
  watch: {
    visitorInfo(val) {
      let pages = getCurrentPages()    //获取加载的页面
      let currentPage = pages[pages.length - 1]    //获取当前页面的对象
      let url = currentPage.route    //当前页面url
      if (url != 'pages/index/index') {
        return false
      }
      console.log("更新");
      console.log(val);
      this.setData({
        visitorInfo: val,

      })
      this.visit()
      //判断查看的名片是不是自己的
      //registState是否付费  0=未注册 1=已注册 2=试用 ,
      if (this.data.cardData.id != this.data.visitorInfo.bindWxCardEmployeeId) {
        this.selectComponent('#othersdata').showdata();
      }
      if (this.data.visitorInfo.registState == 0) {
        this.setData({
          userState: false
        })
      } else {
        if (this.data.visitorInfo.bindWxCardEmployeeId == this.data.cardData.id) {
          this.setData({
            userState: false
          })
        }
      }

    }
  },
  //打开交换名片弹框
  openexchangecard() {
    this.setData({
      show: true
    })
    this.selectComponent('#exchangecard').onshow();
  },
  //获取公司信息
  getCompanyInfo() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getCompanyInfo',
      method: 'GET',
      data: {
        companyId: globalData.companyId, //公司id
        openId: globalData.openid
      },
      success: res => {
        store.dispatch('companyInfo', res.data.data);
        this.selectComponent('#cardtop').showdata();
        // if (res.data.data.id != globalData.cardInfo.id) {
        //   this.selectComponent('#othersdata').showdata();
        // }
        this.setData({
          companyInfo: res.data.data
        })
        if (res.data.data != null ){
          WxParse.wxParse('description', 'html', res.data.data.description, this, 0);
        }else{
          WxParse.wxParse('description', 'html', '', this, 0);
        }
        
       // console.log(res.data.data.description)
      }
    });
  },
  //获取名片信息
  getCardInfo() {
    let _this = this
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getCardInfo',
      method: 'GET',
      data: {
        cardEmplyId: globalData.cardEmplyId, //名片id
        companyId: globalData.companyId, //公司id
        openId: globalData.openid,
        source: globalData.source
      },
      success: (res) => {
        if (res.data.data.wxCardStyleId != null) {
          _this.setData({
            molId: res.data.data.wxCardStyleId
          })
        }
        _this.setData({
          cardData: res.data.data
        })

        _this.getHotProduct();
        console.log(res.data.data.id)
        console.log(globalData.cardInfo.id)
        if (res.data.data.id == globalData.cardInfo.id) {
          store.dispatch('cardInfo', res.data.data);
        } else {
          store.dispatch('cardInfo', res.data.data);
          this.selectComponent('#changebox').ifopendata();
        }
        store.dispatch('cardInfo', res.data.data);
        this.selectComponent('#cardtop').showdata();

        // if (res.data.data.id != globalData.cardInfo.bindWxCardEmployeeId) {
        //   console.log("更新名片数据")
        //   this.selectComponent('#othersdata').showdata();
        // }
        // this.visit()
        //判断查看的名片是不是自己的
        //registState是否付费  0=未注册 1=已注册 2=试用 ,
        if (this.data.visitorInfo.registState == 0) {
          this.setData({
            userState: false
          })
        } else {
          if (this.data.visitorInfo.bindWxCardEmployeeId == this.data.cardData.id) {
            this.setData({
              userState: false
            })
          }
        }
      }
    });
  },
  //进入名片列表
  calling() {
    wx.redirectTo({
      url: '/pages/cardlist/cardlist',
    })
  },
  //进入我的名片
  findCardInfo() {
    let _this = this;
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/login/findCardInfo',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        openId: globalData.openid
      },
      success(res) {
        console.log(res)
        store.dispatch('companyId', res.data.data.companyId);
        store.dispatch('cardEmplyId', res.data.data.id);
        _this.getCardInfo();
        _this.getCompanyInfo();
        // _this.getHotProduct();
      }
    })
  },
  //获取推荐产品
  getHotProduct() {
    let _this = this;
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getHotProduct',
      method: 'GET',
      data: {
        companyId: globalData.companyId, //公司id
        openId: globalData.openid
      },
      success: res => {
        _this.setData({
          HotProduct: _this.arrHandle(res.data.data)
        });
        console.log(res.data.data,"推荐产品");
        // if(res.data.data.length==0){
        //   _this.getProduct()
        // };
        if (this.data.HotProduct.length != 0) {
          this.selectComponent('#recommend').obtaindata();
        }
      }
    });
  },
  getProduct() {
    let _this=this;
    wx.request({
      url: app.globalData.webRequsetUrl + '/weixin/card/getProduct',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        pageNum: 1,
        companyId: globalData.companyId, //公司id
        openId: globalData.openid
      },
      success: (res) => {
        console.log(res);
        let data=[];
        for(let i in res.data.data){
         data.push(res.data.data[i]);
         data[i].lastVisitImgs = "[]"
        };
        console.log(data,"产品");
        _this.setData({
          HotProduct: _this.arrHandle(data)
        });
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  //处理推荐产品函数
  arrHandle(arr) {
    const len = arr.length;
    var that = this;
    let result = []
    const sliceNum = 2;
    if (len % 2 != 0) {
      arr.push(arr[0])
    }
    for (let k = 0; k <= len - 1; k++) {
      arr[k].lastVisitImgs = JSON.parse(arr[k].lastVisitImgs);
    }
    for (let i = 0; i < len / sliceNum; i++) {
      result.push(arr.slice(i * sliceNum, (i + 1) * sliceNum))
    }
    return result;
  },
  //首页埋点
  visit() {
    if (globalData.visitstart) {
      return false;
    };
    wx.request({
      url: globalData.webRequsetUrlT + '/radar/visit',
      method: 'POST',
      data: {
        companyId: globalData.companyId, //公司id 
        openId: globalData.openid,
        wxCardEmployeeId: globalData.cardEmplyId, //名片id
        wxCardVisitorId: globalData.visitorInfo.id, //访客id 
        loginId: this.data.cardData.loginId,
        sfaCompanyId: this.data.cardData.sfaCompanyId,
        loginType: this.data.cardData.loginType
      },
      success: res => {
        console.log('首页埋点')
        store.dispatch('visitstart', true);
        console.log(res);
      }
    });
  },
  //转发
  onShareAppMessage(data) {
    let _this = this;
    console.log(data);
    //埋点
    wx.request({
      url: globalData.webRequsetUrlT + '/radar/transfer',
      method: 'POST',
      data: {
        companyId: globalData.companyId, //公司id 
        forwardType: 0,
        type: 1,
        wxCardEmployeeId: globalData.cardEmplyId, //名片id
        wxCardVisitorId: globalData.visitorInfo.id, //访客id 
        loginId: this.data.cardData.loginId,
        sfaCompanyId: this.data.cardData.sfaCompanyId,
        loginType: this.data.cardData.loginType
      },
      success: res => {
        console.log("转发埋点成功", res);
        if (res.data.data.id != globalData.cardInfo.id) {
          _this.selectComponent('#othersdata').okzhuanfa();
        }

      }
    });
    let title = `您好，我是${this.data.cardData.company}公司的${this.data.cardData.name}，这是我的电子名片，请惠存~~`
    if (this.data.cardData.transferTitle != null && this.data.cardData.transferTitle != '' && this.data.cardData.transferTitle != undefined) {
      title = this.data.cardData.transferTitle
    };
    console.log(title)
    //
    return {
      title: title,
      // imageUrl:"http://tmp/wx8219ae22dc9edc3a.o6zAJs48GiI_szGalkWj….6UwabFuNSeDuee90c3e3fc6cb4bf8b5507e91b753706.png",
      path: `pages/Bootpage/Bootpage?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.cardEmplyId}`,
      success: res => {
        console.log("转发成功", res);
      }
    }
  },
  //登录绑定
  createdCard() {
    console.log(155)
    wx.request({  //埋点
      url: globalData.webRequsetUrl + '/weixin/card/burialRecords',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id, //访客id 
        operationType: 5
      },
      success(res) {
        console.log(res)
      }
    })
    wx.navigateTo({
      url: '/pages/bangding/bangding',
    })
  },
  //监听子组件
  onMyEvent(data) {
    console.log(data);

    if (data.detail.msg == '0') {
      console.log(data.detail.data.data.data)
      this.setData({
        show: true,
        telphone: data.detail.data.data.data
      })

    } else {
      this.setData({
        show: true,
      })
    }
    this.selectComponent('#exchangecard').onshow();
  },
  //子组件传参
  onMyEvent2: function (e) {
    this.setData({
      telphone: e.detail.telphone,
      stateShouQuan: e.detail.stateShouQuan
    })
    console.log('index-shouquan')
    console.log(this.data.stateShouQuan)
    console.log(this.data.telphone)
  },
  onLoad() {
    // this.getCardInfo();
    // this.getCompanyInfo();
    // this.getHotProduct();
  },
  onShow() {
    store.dispatch('iftoAccid', true);
    this.getCardInfo();
    this.getCompanyInfo();

  },
  // 名片列表获取formId
  formSubmit(val) {
    console.log(val.detail.formId);
    this.setData({
      "showform": false
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
  // 创建/登陆 获取formId
  formSubmit1(val) {
    console.log(val.detail.formId);
    this.setData({
      "showform1": false
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
  // 进入我的，名片获取formId
  formSubmit2(val) {
    console.log(val.detail.formId);
    this.setData({
      "showform2": false
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
  binderror(e) {
    console.log('shibai');
    console.log(e)
  }
}))
