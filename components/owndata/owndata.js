// components/owndata/owndata.js
import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cardData:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    operation(){
      wx.navigateTo({
        url: '/pages/operation/operation',
      })
    },
    code(){
      wx.navigateTo({
        url: '/pages/code/code',
      })
    },
    ai(){
      if (globalData.cardInfo.registState == 1) {
        wx.navigateTo({
          url: '/pages/AIHref/AIHref',
          //  url: '/pages/AI/AI',
        })
      } else {
        wx.navigateTo({
          url: '/pages/AI/AI',
        })
      }
    }
  },
  ready() {
    this.setData({
      cardData:globalData.cardInfo
    })
  }
})
