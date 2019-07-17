import store from '../../utils/store.js';
//获取应用实例
const app = getApp()
const globalData = app.globalData;
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productBanner:[],
    products:{},
    companyInfo:{},
    cardInfo:{},
    visitorInfo:{},
    height:"",
    page:1
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(globalData.companyInfo);
    this.setData({
      companyInfo: globalData.companyInfo,
      cardInfo: globalData.cardInfo,
      page:1,
      visitorInfo: globalData.visitorInfo
    })
    if (globalData.companyInfo!=null){
      this.setData({
        productBanner: JSON.parse(globalData.companyInfo.productBanner)
      });
      this.getProduct(1)
    }else{
      this.setData({
        productBanner: []
      });
      this.getProduct(1)
    }
   
  },
  //进入详情页
  clickPro(e){
    console.log(e);
    let data = e.currentTarget.dataset;
    wx.request({
      url: globalData.webRequsetUrlT + '/weixin/card/actice/productVisit',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        productId: data.id, //产品id 
        visitorId: globalData.visitorInfo.id, //访客id 
      },
      success: res => {
        console.log(res);
      }
    });
    wx.request({
      url: globalData.webRequsetUrlT + '/radar/productVisit',
      method: 'POST',
      data: {
        wxCardProductId: data.id, //产品id 
        companyId: globalData.companyId, //公司id
        sfaCompanyId: globalData.cardInfo.sfaCompanyId,
        openId: globalData.openid,
        wxCardEmployeeId: globalData.cardEmplyId, //名片id
        wxCardVisitorId: globalData.visitorInfo.id, //访客id 
        loginId: globalData.cardInfo.loginId,
        loginType: globalData.cardInfo.loginType
      },
      success: res => {
        console.log(res);
        store.dispatch('productsdata', data.html);
        wx.navigateTo({
          url: '/pages/detail/detail' ,
        })
      }
    });
  },
  getProduct(page){
    wx.request({
      url: app.globalData.webRequsetUrl + '/weixin/card/getProduct',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        pageNum: page,
        companyId: globalData.companyId, //公司id
        openId: globalData.openid
      },
      success:  (res)=> {
        console.log(res);
        let data=res.data.data;
        for(let i in data){
          data[i].html = this.removeHTMLTag(data[i].displayImgs)
        }
        if(page==1){
          this.setData({
            products:data
          })
        }else{
          if(data.length!=0){
            this.setData({
              products: this.data.products.concat(data)
            })
          }else{
            Toast("没有更多啦~");
            this.setData({
              page: this.data.page - 1
            })
          }
        }
        
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
    return str;
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
      console.log(12);
      this.setData({
        page:this.data.page+1
      })
    console.log(this.data.page)
    this.getProduct(this.data.page)
  },

  //转发
  onShareAppMessage(data) {
    return {
      path: `pages/Bootpage/Bootpage?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.cardEmplyId}`,
      success: res => {
        console.log("转发成功", res);
      }
    }
  },
})