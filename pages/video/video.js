import store from '../../utils/store.js';
import Toast from '../../dist/toast/toast';
//获取应用实例
const app = getApp()
const globalData = app.globalData
Page(store.createPage({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {},
    visitorInfo: {},
    videoData:[],
    page:1,
    totalCount:0,
    show:true,
    userState:false,
  },
  getVideoList(page){
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getVideoList',
      method: 'POST',
      data: {
        companyId: globalData.companyId,//公司id
        visitorId: globalData.visitorInfo.id,
        pageNum: page,
        pageSize: 6
      },
      success: (res) => {
        console.log(res);
        if (res.data.data.totalCount==0){
          this.setData({
            show:false
          });
        };
        if (page==1){
          this.setData({
            videoData: res.data.data.videoList,
            totalCount: res.data.data.totalCount
          })
        }else{
          if (res.data.data.videoList.length!=0){
            this.setData({
              videoData: this.data.videoData.concat(res.data.data.videoList),
              totalCount: res.data.data.totalCount
            })
            console.log()
          }else{
            Toast("没有更多啦~");
            this.setData({
              page:this.data.page-1
            })
          };
        };
        
      }
    })
  },
  playVideo(e){
    let id = e.currentTarget.id;
    let data = JSON.stringify(this.data.videoData[id]);
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/actice/addVideoVisit',
      method: 'POST',
      data: {
        companyId: globalData.companyId,//公司id
        wxCardVisitorId: globalData.visitorInfo.id,
        wxCardEmployeeId: globalData.cardEmplyId,
        loginId: globalData.cardInfo.loginId,
        loginType: globalData.cardInfo.loginType,
        wxCardVideoId: this.data.videoData[id].id,
      },
      success: (res) => {
        // 回调函数
        console.log(res);
        wx.navigateTo({
          url: '/pages/play/play?chuan=' + data + "&indexS=" + id,
        })
      }
    })
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
    if (globalData.cardInfo.imAccid == undefined) {
      app.getcompanyInfo();
      app.getcardInfo().then((res) => {
        store.dispatch('cardInfo', res.data.data);
        this.setData({
          cardInfo: globalData.cardInfo,
          visitorInfo: globalData.visitorInfo
        });
        //registState是否付费  0=未注册 1=已注册 2=试用 ,
        if (globalData.visitorInfo.registState == 0 && this.data.visitorInfo.bindWxCardEmployeeId == this.data.cardInfo.id) {
          this.setData({
            userState: true
          })
        } else {
          this.getVideoList(1);
        }
      });
      return false
    }
    this.setData({
      cardInfo: globalData.cardInfo,
      visitorInfo: globalData.visitorInfo
    });
    //registState是否付费  0=未注册 1=已注册 2=试用 ,
    if (globalData.visitorInfo.registState == 0 && this.data.visitorInfo.bindWxCardEmployeeId == this.data.cardInfo.id) {
      this.setData({
        userState: true
      })
    } else {
      this.getVideoList(1);
    }
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
    this.setData({
      page: this.data.page+1
    })
    this.getVideoList(this.data.page)
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
}))