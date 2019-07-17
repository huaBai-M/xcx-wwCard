// components/recommend/recommend.js
import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    product:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    HotProduct:{},
    currentSwiper:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //进入详情页
    clickPro(e) {
      console.log(e);
      let data = e.currentTarget.dataset.value;
      console.log(data.displayImgs);
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
          store.dispatch('productsdata', data);
          wx.navigateTo({
            url: '/pages/detail/detail',
          })
        }
      });
    },
    obtaindata(){
      this.setData({
        HotProduct: this.data.product
      })
    },
    swiperChange(e){
      this.setData({
        currentSwiper: e.detail.current
      })
    },
    
  }
})
