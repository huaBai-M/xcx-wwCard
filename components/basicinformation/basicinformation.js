import store from '../../utils/store.js';
const app = getApp()
const globalData = app.globalData
const array = [
  {
    text: '工业|制造|能源|化工', id: 1
  },
  {
    text: '机械|专用设备', id: 2
  },
  {
    text: '配件|五金工具', id: 3
  },
  {
    text: '包装|印刷|办公用品', id: 4
  },
  {
    text: '服装|纺织|配饰', id: 5
  },
  {
    text: '日用百货|家用电器', id: 6
  },
  {
    text: '会计|金融|银行|保险', id: 7
  },
  {
    text: '房地产|建筑|装潢', id: 8
  },
  {
    text: '媒体|广告,媒体|广告', id: 9
  },
  {
    text: '医疗保健,医疗保健', id: 10
  },
  {
    text: '批发|零售|代理商', id: 11
  },
  {
    text: '餐饮|旅游|休闲|娱乐|体育', id: 12
  },
  {
    text: '计算机|网络|通信|电子', id: 13
  },
  {
    text: '服务|教育|培训', id: 14
  },
  {
    text: '贸易|物流', id: 15
  },
  {
    text: '农林牧渔', id: 16
  },
  {
    text: '非营利性组织', id: 17
  }
]
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    receiveData:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    basicData:{
      headImageUrl: '',
      name: '',
      telphone: '',
      company: '',
      email: '',
      title: '',
      wechat: '',
      companyLocation: '',//详情地址
      area: ['', '', ''],//区域
      productFirstId: '',//行业id
      trade: '',//行业
      openId: '',
      sfaCompanyId: '',
      // telphoneDisplay:'',
      wxCardStyleId:''
    },
    array: array,
    listsName:{},
    history:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //接收数据
    receiveDataEven(){
      console.log(this.data.receiveData)
      this.setData({
        "basicData.telphone": this.data.receiveData.phone
      })
    },
    //修改数据
    operationDataEven() {
      console.log(globalData.cardInfo)
      let data = JSON.stringify(globalData.cardInfo);
      let productFirstId=null;
      data = JSON.parse(data);
      console.log(data);
      if (data.area!=null){
        data.area = data.area.split(",");
      }else{
        data.area = ['', '', '']
      }
      
      for (let i in this.data.basicData){
        this.data.basicData[i] = data[i]
      };
      for (let i in this.data.array){
        if (this.data.array[i].text == data.trade){
          console.log(this.data.array[i]);
          productFirstId = this.data.array[i].id
        }
      }
      this.setData({
        "basicData": this.data.basicData,
        "basicData.headImageUrl": data.cardImageUrl,
        "basicData.productFirstId": productFirstId
      });
      console.log(this.data.basicData)
    },
    changePhone(){
      wx.navigateTo({
        url: `/pages/bangding/bangding?telphoneDisplay=true`,
      })
    },
    loginData(){
      this.triggerEvent('myloginevent', this.data.basicData);
    },
    operationData(){
      this.triggerEvent('myopertionevent', this.data.basicData);
    },
    bindPickerChange(data){
      let val = this.data.array[data.detail.value];
      console.log(val);
      this.setData({
        "basicData.productFirstId": val.id,
        "basicData.trade": val.text
      });
      console.log(this.data.basicData)
    },
    bindRegionChange(data){
      console.log(data.detail.value);
      this.setData({
        "basicData.area": data.detail.value,
      });
      console.log(this.data.basicData)
    },
    bindInput(data){
      let val = data.detail.value
      let type = data.target.dataset.type
      this.data.basicData[type]=val;
      console.log(this.data.basicData)
    },
    //公司名修改
    onChangeCompany(event) {
      let _this = this;
      if (event.detail.length >= 4) {
        wx.request({
          url: globalData.webRequsetUrl + '/weixin/card/login/findSfaCustomerByName',
          method: 'GET',
          data: {
            custName: event.detail
          },
          success(res) {
            console.log(res.data.data);
            if (res.data.data.length==0){
              _this.setData({
                "basicData.company": event.detail,
                history: false,
                listsName: {}
              })
            }else{
              _this.setData({
                listsName: res.data.data,
                history: true
              })
            }
           
          },
        })
      } else {
        this.setData({
          "basicData.company": event.detail,
          history: false,
          listsName:{}
        })
      }
      console.log(this.data.basicData.company);
    },
    
    clickName(data){
      console.log(data);
      this.setData({
        "basicData.company": data.currentTarget.dataset.companyName,
        history: false,
        listsName: {}
      });
      console.log(this.data.basicData)
    },
    closeTitle(){
      this.setData({
        history: false,
        listsName: {}
      });
    },
    //修改头像
    changeAvatar() {
      let avatar="";
      let _this=this;
      wx.chooseImage({
          count: 1, // 最多可以选择的图片张数，默认9
          sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success(res){
            console.log(res)
            avatar= res.tempFilePaths;

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
                    "basicData.headImageUrl": path
                  })
                },
                fail(res) {
                  console.warn(res)
                },
              })
          }
      })
    },
  }
})
