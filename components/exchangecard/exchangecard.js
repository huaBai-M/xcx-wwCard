import Toast from '../../dist/toast/toast';
import store from '../../utils/store.js';
const app = getApp();
const globalData = app.globalData;
// components/exchangecard/exchangecard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openshow: Boolean,
    telphone:String,  
  },
  /**
   * 组件的初始数据
   */
  data: {
    cardInfo: {},
    companyInfo: {},
    visitorInfo: {},
    information:{},
    disabled:false,
  },
  attached(){ 
    console.log(this.data.openshow);
  },
  moved(){

  },
  detached(){ 

  },
  /**
   * 组件的方法列表
   */
  methods: {
    catchtouch () {
      return this.data.catchtouch
    },
    //监听父组件调用
    onshow(){
      let changeTel = 'information.tel';
      console.log(this.data.telphone)
      this.setData({
        cardInfo: globalData.cardInfo,
        visitorInfo: globalData.visitorInfo,
        companyInfo: globalData.companyInfo,
        [changeTel]: this.data.telphone
      });
    },
    onClose(e) {

      this.setData({
        openshow: false,
      });
    },
    changeHide(e) {
      this.setData({
        openshow: false
      });
    },
    //更新交换名片name phone complay 
    nameval(res) {
      let typeVal = res.currentTarget.dataset.type;
      let value = res.detail.value;
      if (typeVal == "name") {
        this.setData({
          "information.name": value
        })
      } else if (typeVal == "phone") {
        this.setData({
          "information.tel": value
        })
      } else if (typeVal == "company") {
        this.setData({
          "information.company": value
        })
      } else if (typeVal == "job") {
        this.setData({
          "information.job": value
        })
      }
    },
    //交换名片
    clickCard() {
      if (this.data.information.name == "" || this.data.information.tel == "") {
        Toast('内容不能为空');
        return false
      };
      if (!(/^1(3|4|5|7|8|6)\d{9}$/.test(this.data.information.tel))) {
        Toast('手机号码有误，请重填');
        return false;
      };
      wx.request({
        url: globalData.webRequsetUrlT + '/radar/exchange',
        method: 'POST',
        data: {
          company: this.data.information.company, //公司名称 
          name: this.data.information.name, //姓名
          phone: this.data.information.tel, //电话
          title: this.data.information.job, //职位  
          companyId: globalData.companyId, //公司id 
          openId: globalData.openid,
          sfaCompanyId: globalData.cardInfo.sfaCompanyId,
          wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
          wxCardVisitorId: globalData.visitorInfo.id, //访客id
          loginId: globalData.cardInfo.loginId,
          loginType: globalData.cardInfo.loginType
        },
        success: res => {
          console.log(res);
          this.changeHide();
          Toast('交换成功');
          // this.catchtouch();
        },
        erreor: err => {
          Toast('无法连接服务器');
        }
      });
    },
  },
  //页面加载后..
  ready() {

  }
})
