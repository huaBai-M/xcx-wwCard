import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData
// components/cardtop/cardtop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headImg:String,
    molId:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    cardData: {},
    companyData:{},
    cardImageUrl:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showdata(){
      this.setData({
        cardData: globalData.cardInfo,
        companyData: globalData.companyInfo
      })
      console.log(globalData.cardInfo.cardImageUrl);
      if (globalData.cardInfo.cardImageUrl==null){
        this.setData({
          cardImageUrl:'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg'
        })
      }else {
        this.setData({
          cardImageUrl: globalData.cardInfo.cardImageUrl
        })
      }
    }
  }
})
