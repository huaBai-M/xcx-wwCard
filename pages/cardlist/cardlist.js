import store from '../../utils/store.js';

//index.js
//获取应用实例
const app = getApp()
const globalData = app.globalData
Page({
  data: {
    abtClass:true,
    cardlist:{},
    page:1,
    show:false,
    groupingdata:{},
    columns:[]
  },
  //切换
  activeAbt(val){
    if (val.target.dataset.index == 0) {
      this.setData({
        "abtClass": true
      })
      this.onRefresh()
    } else {
      this.setData({
        "abtClass": false
      })
    }
  },

  //获取名片列表
  navigaeToCall(page) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getRelation',
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' }, // 默认值
      data: { pageNum: page, visitorId: globalData.visitorInfo.id },
      success: (res) => {
        console.log("获取名片列表");
        let data = res.data.data;
        for (let i in data){
          data[i].visitTime = this.timedata(data[i].visitTime)
        };
        if(data.length==0){
          return false
        }
        if(page==1){
          this.setData({
            cardlist: data
          });
        }else{
          this.setData({
            cardlist: this.data.cardlist.concat(data)
          });
        }
        if (this.data.abtClass){
          this.selectComponent('#cardlists').datashow();
        }
       
      },
      fail: res => {

      }
    });
  },
  addGroup(){
    wx.navigateTo({
      url: '/pages/addCallGroup/addCallGroup',
    });
  },
  allGroup(e){
    console.log(e.currentTarget.dataset.item);
    store.dispatch('callGroup', e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/callGroup/callGroup',
    });
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
  onLoad() {
    // store.dispatch('test', { "text": "aaa" });
  },
  onShow(){

    this.onRefresh()
    this.findGroupCard()
  },
  //上拉刷新
  onReachBottom() {
    if (this.data.abtClass){
      this.setData({
        page: this.data.page + 1
      })
      this.navigaeToCall(this.data.page)
    }else{
      
    }

  },
  //刷新页面
  onRefresh(){
    console.log("刷新");
    this.setData({
      page: 1
    })
    this.navigaeToCall(1)
  },
  //分组
  onGrouping(data){
    let card = data.detail;
    this.setData({
      groupingdata: card,
      show: true
    })
  },
  clearPopup(){

  },
  //选择分组
  confirm(e){
    console.log(data)
    let data = e.detail.value
    console.log(this.data.groupingdata);
    this.toGroup(this.data.groupingdata.relationId, data.groupId)
  },
  cancel(){
    this.setData({
      show:false
    })
  },
  //分享
  onShareAppMessage(e){
    if (e.target==undefined){
      return {
        path: `pages/Bootpage/Bootpage?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.cardEmplyId}`,
        success: res => {
          console.log("转发成功", res);
        }
      }
      return false
    }
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
  //添加到分组
  toGroup(relationId, groupId) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/toGroup',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
        relationId: relationId,
        groupId: groupId
      },
      success: (res) => {
        console.log(res);
        this.setData({
          page: 0,
          show:false,
        })
        this.navigaeToCall(1)
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  //获取分组信息
  findGroupCard() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/findGroupCard',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id//访客Id
      },
      success: (res) => {
        console.log(res);
        let data=[]
        for(let i in res.data.data){
          data.push({
            text: res.data.data[i].groupName,
            groupName: res.data.data[i].groupName,
            groupId: res.data.data[i].groupId,
            groupType: res.data.data[i].groupType,
            groupTypeId: res.data.data[i].groupTypeId,
            relations: res.data.data[i].relations,
          });
        };
        this.setData({
          columns: data
        });
        if (!this.data.abtClass){
          // this.selectComponent('#groupimg').imgmake();
        }
        
      },
      fail: res => {
        console.log(res)
      }
    });
  },

})
