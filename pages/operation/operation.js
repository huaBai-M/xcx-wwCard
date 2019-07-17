import store from '../../utils/store.js';
const app = getApp();
const globalData = app.globalData;
import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveData:{},
    nameMol:"默认版",
    mols:{}
  },
  onMyopertionEvent(e) {
    console.log(e.detail);
    let _this = this;
    let data = e.detail;
    if (data.headImageUrl == '' || data.headImageUrl == null || data.headImageUrl == undefined) {
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
    if (data.email != '') {
      if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(data.email))) {
        Toast("邮箱地址格式不正确~");
        return false;
      };
    };
    if (globalData.openid == "") {
      console.log("openid为空");
      return false;
    };
    data.openId = globalData.openid
    data.sfaCompanyId = globalData.cardInfo.sfaCompanyId;
    data.id = globalData.cardInfo.id;
    data.area=data.area.join(",")
    console.log(data);
    console.log(globalData.cardInfo)
    let transferTitle=""
    if(globalData.cardInfo.transferTitle!=null){
      transferTitle = globalData.cardInfo.transferTitle.replace(globalData.cardInfo.name, data.name);
    }else{
       transferTitle = globalData.cardInfo.transferTitle
    }
    data.transferTitle = transferTitle;
    data.wxCardStyleId = globalData.cardInfo.wxCardStyleId
    console.log(data)
    Dialog.confirm({
      title: '提示',
      message: '确定要保存当前编辑的注册信息么？'
    }).then(() => {
      // 
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/updateEmplyeeInfo',
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: data,
        success(res) {
          console.log(res);
          if (res.data.status != 200) {
            return false;
          };
          Toast(res.data.data);
          _this.findCardInfo();
          
        },

      })

    }).catch(() => {
      // on cancel
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.telphoneDisplay!=undefined){
      let cardInfo = globalData.cardInfo;
      cardInfo.telphoneDisplay = options.telphoneDisplay;
      store.dispatch('cardInfo', cardInfo);
      console.log(globalData.cardInfo)
      this.selectComponent('#basicinformation').operationDataEven();
    }else{
      if (options.wxCardStyleId != undefined){
        let cardInfo = globalData.cardInfo;
        cardInfo.wxCardStyleId = +(options.wxCardStyleId);
        console.log(cardInfo);
        store.dispatch('cardInfo', cardInfo);
        console.log(globalData.cardInfo);
      }
      if (options.headImg != undefined && options.headImg != '') {
        let cardInfo = globalData.cardInfo;
        cardInfo.cardImageUrl = options.headImg;
        console.log(cardInfo);
        store.dispatch('cardInfo', cardInfo);
        console.log(globalData.cardInfo);
      }
      
      this.selectComponent('#basicinformation').operationDataEven();
    }
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
    this.getModules();
  },
  concel(){
    Dialog.confirm({
      title: '提示',
      message: '确定要取消编辑么？'
    }).then(() => {
      // on confirm
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch(() => {
      // on cancel
    });
  },
  confirm(){
    console.log("112")
    this.selectComponent('#basicinformation').operationData();
  },
  //修改埋点
  findCardInfo(){
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
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },
  //跳转到修改模板页面
  linkToMol:function(){
    wx.redirectTo({
      url: '/pages/module/module',
    })
  },
  //获取模板信息
  getModules() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/findCardModels',
      method: 'GET',
      data: {},
      success: res => {
        console.log(res.data.data);
        let cardInfo = globalData.cardInfo;
        let styleId = globalData.cardInfo.wxCardStyleId;
        this.setData({
          mols: res.data.data
        })
        if (styleId==null){
          // this.setData({
          //   nameMol: '默认版'
          // })
          return false;
        }else {
          let mols = this.data.mols;
          var nameMol = mols[styleId - 1].name;
          this.setData({
            nameMol: nameMol
          })
        }
       
        console.log(this.data.nameMol)
      }
    });
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