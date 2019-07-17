// pages/module/module.js
import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData
import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    molId:1,
    mols:{},
    num:1,
    headImg:'',
    headImgSate:true,
    cardData:{},
    companyInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getModules();
    this.getCardInfo();
    this.getCompanyInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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

  },
  // 选择模板
  selected:function(e){
    var ids = e.currentTarget.dataset.ids;
    var that = this;
    // console.log(ids)
    that.setData({
      molId: ids+1,
      num: ids
    })
    console.log(that.data.molId)
  },
  //修改头像
  changeAvatar() {
    let avatar = "";
    let _this = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success(res) {
        console.log(res)
        avatar = res.tempFilePaths;

      },
      fail(res) {
        console.warn(res)
      },
      complete() {
        wx.uploadFile({
          url: globalData.webRequsetUrl + '/weixin/card/file/imageUpload',
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          filePath: avatar[0],
          success(res) {
            let path = JSON.parse(res.data).data;
            console.log(path);
            _this.setData({
              headImg: path,
              headImgSate:false
            })
          },
          fail(res) {
            console.warn(res)
          },
        })
      }
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
        this.setData({
          mols: res.data.data
        })
        console.log(this.data.mols)
      }
    });
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
        this.setData({
          companyInfo: res.data.data
        })
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
        if (res.data.data.wxCardStyleId==null){
          _this.setData({
            cardData: res.data.data,
            num: 0,
            molId: 1
          })
        }else{
          _this.setData({
            cardData: res.data.data,
            num: res.data.data.wxCardStyleId-1 ,
            molId: res.data.data.wxCardStyleId
          })
        }
       
        console.log(this.data.num)
        store.dispatch('cardInfo', res.data.data);
        this.selectComponent('#cardtop').showdata();
      }
    });
  },
  //点击保存
  confirm() {
    Dialog.confirm({
      title: '提示',
      message: '确定要选择当前模板么？'
    }).then(() => {
      // on confirm
      this.saveModule(); 
    }).catch(() => {
      // on cancel
    });
  },
  //点击取消
  concel() {
    Dialog.confirm({
      title: '提示',
      message: '确定要取消当前选择模板么？'
    }).then(() => {
      // on confirm
      wx.redirectTo({
        url: '/pages/operation/operation'
      })
    }).catch(() => {
      // on cancel
    });
  },
  //保存模板和头像
  saveModule() {
    
    let _this = this;
    console.log(_this.data.molId)
    let wxCardStyleId = _this.data.molId;
    let nameMol = _this.data.nameMol;
    let cardData = _this.data.cardData;
    let headImg = '';
    if (_this.data.headImg == ''){
      headImg = cardData.cardImageUrl;
    }else {
      headImg = _this.data.headImg;
    }
    let data = {
      area: cardData.area,
      name: cardData.name,
      company: cardData.company,
      companyLocation: cardData.companyLocation,
      email: cardData.email,
      id: cardData.id,
      openId: globalData.openid,
      telphone: cardData.telphone,
      trade: cardData.trade,
      wxCardStyleId: wxCardStyleId,
      headImageUrl: headImg,
      title: cardData.title,
      wechat: cardData.wechat,
      productFirstId: cardData.productFirstId,
      sfaCompanyId: cardData.sfaCompanyId,
      transferTitle: cardData.transferTitle
    };
    console.log(data);
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
        wx.redirectTo({
          url: '/pages/operation/operation?headImg=' + headImg + '&wxCardStyleId=' + wxCardStyleId,
        })
      },

    })
  },
})