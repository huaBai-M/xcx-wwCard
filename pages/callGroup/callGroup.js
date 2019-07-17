import store from '../../utils/store.js';
// pages/callGroup/callGroup.js
const app = getApp()
const globalData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grounpData:{},
    cardNameVal:"",
    hideSet:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findByGroupId()
  },
  BgClassFun(){
    this.setData({
      hideSet: !this.data.hideSet
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  hideSetFun() {
    this.setData({
      hideSet: !this.data.hideSet
    })
  },
  modify(){
    wx.navigateTo({
      url: `/pages/addCallGroup/addCallGroup?type=${0}`,
    });
  },
  //获取数据
  findByGroupId() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/findByGroupId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
        groupId: globalData.callGroup.groupId,
      },
      success: (res) => {
        let data = res.data.data.relations;
        console.log(data)
        for (let i in data) {
          data[i].visitTime = this.timedata(data[i].visitTime)
        };
        this.setData({
          grounpData: res.data.data,
          relations:data
        });
        console.log(this.data.grounpData);
        this.selectComponent('#cardlists').datashow();
        this.selectComponent('#groupimg').imgmake();
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  //删除组
  deleteGro() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/deleteGroup',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
        groupId: globalData.callGroup.groupId,
      },
      success: res => {
        console.log(res);
        wx.navigateBack({
          delta: 1
        })
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  //时间排序
  downQuery(){
    this.setData({
      timeShow: true
    })
    this.CardByName('', this.data.grounpData.groupId, false);
  },
  topQuery(){
    this.setData({
      timeShow: false
    })
    this.CardByName('', this.data.grounpData.groupId, true);
  },
  search(){
    this.CardByName(this.data.cardNameVal, this.data.grounpData.groupId, true);
  },
  //
  CardByName(cardName, groupId, isDesc) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/findGroupCardByName',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
        cardName: cardName,
        groupId: groupId,
        isDesc: isDesc
      },
      success: (res) => {
        let data = res.data.data;
        console.log(data)
        for (let i in data) {
          data[i].visitTime = this.timedata(data[i].visitTime)
        };
        this.setData({
          "grounpData.relations": data,
        });
        this.selectComponent('#cardlists').datashow();
        this.selectComponent('#groupimg').imgmake();
      },
      fail: (res) => {

        console.log(res)
      }
    });
  },
  cardName(val) {
    console.log(val);
    this.setData({
      "cardNameVal": val.detail.value
    })
  },
  timedata(input) {
    var d = new Date(input);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    var hour = d.getHours();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    return year + '-' + month + '-' + day + '/' + hour + ':' + minutes;
  },
  //刷新页面
  onRefresh() {
    this.findByGroupId()
  },
  onGrouping(){

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
  onShareAppMessage(e) {
    let card = e.target.dataset.card;
    console.log(card)
    let title = `您好，我是${card.company}公司的${card.emplyName}，这是我的电子名片，请惠存~~`
    if (card.transferTitle != null && card.transferTitle != '' && card.transferTitle != undefined) {
      title = card.transferTitle
    };
    console.log(title)
    return {
      title: title,
      path: `pages/Bootpage/Bootpage?companyId= ${card.companyId}&wxCardEmployeeId=${card.cardId}`,
      success: res => {
        console.log("转发成功", res);
      }
    }
  },
})