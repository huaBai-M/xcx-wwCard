import store from '../../utils/store.js';
import Dialog from '../../dist/dialog/dialog';
//获取应用实例
const app = getApp();
const globalData = app.globalData
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:Object,
    start:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    cardData:{},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    datashow(){
      this.setData({
        cardData:this.data.data
      })
    },
    clickCard(e){
      let card = e.currentTarget.dataset.card;
      if (card.status==-1){
        return false
      };
      store.dispatch('cardEmplyId', card.cardId);
      store.dispatch('companyId', card.companyId);
      wx.switchTab({
        url: '/pages/index/index',
      });
    },
    //屏蔽
    deleteCall(e){
      let card = e.currentTarget.dataset.card;
      Dialog.confirm({
        title: '提示',
        message: '确定要屏蔽当前名片么？'
      }).then((res) => {
        this.deleteRelation(card)
      }).catch(() => {
        // on cancel
      });
    },
    //开启名片
    openCardPage(e) {
      let card = e.currentTarget.dataset.card;
      Dialog.confirm({
        title: '提示',
        message: '确定要开启当前名片么？'
      }).then((res) => {
        this.recoverRelation(card)
      }).catch(() => {
      });
    },
    //分组
    grouping(e){
      let card = e.currentTarget.dataset.card;
      console.log("分组")
      this.triggerEvent("mygrouping", card)
    },
    recoverRelation(card){
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/recoverRelation',
        method: 'GET',
        data: {
          emplyId: card.cardId, //名片id
          openId: globalData.openid,
        },
        success: res => {
          this.triggerEvent("mycardvent")
        }
      });
    },
    deleteRelation(card){
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/deleteRelation',
        method: 'GET',
        data: {
          emplyId: card.cardId, //名片id
          openId: globalData.openid,
        },
        success:(res) => {
          this.triggerEvent("mycardvent")
        }
      });
    },
    //移出
    rmGroup(e) {
      let card = e.currentTarget.dataset.card;
      console.log(card)
      Dialog.confirm({
        title: '提示',
        message: '确定要移出当前名片么？'
      }).then((res) => {
        wx.request({
          url: globalData.webRequsetUrl + '/weixin/card/group/rmGroup',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            visitorId: globalData.visitorInfo.id,
            relationId: card.relationId,
          },
          success: res => {
            console.log(res);
            this.triggerEvent("mycardvent")
          }
        });
      }).catch(() => {
        // on cancel
      });

    },
  }
})
