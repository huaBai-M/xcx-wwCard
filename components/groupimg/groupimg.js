// components/groupimg/groupimg.js
class Card {
  palette(views) {
    return ({
      width: '100rpx',
      height: '100rpx',
      borderRadius: '0rpx',
      background: '#fff',
      views: views,
    });
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      img:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    template: {},
  },
  attached() {
    let views = [];
    console.log(this.data.img);
    var url = ''
    for(let i in this.data.img){
      url = this.data.img[i].headImageUrl.replace(/http/g, "https")
      console.log(url.indexOf("https://erpbucket.oiaqye7985.com"))
      //https://erpbucket.img-cn-qingdao.aliyuncs.com
      //https://erpbucket.img-cn-qingdao.aliyuncs.com 
      if (url.indexOf("https://erpbucket.oiaqye7985.com") != -1 ){
        url ="https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
      }
      if (url.indexOf("https://erpbucket.img-cn-qingdao.aliyuncs.com") != -1) {
        url = "https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
      }
      if (url.indexOf("https://erpbucket.img-cn-qingdao.aliyuncs.com ") != -1) {
        url = "https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
      }
      if (url == undefined || url == null || url =='string'){
        url = "https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
      }
      if(i==0){
        views.push(this._image(0, 50, 50, 0, 0, url));
      }else if(i==1){
        views.push(this._image(0, 50, 50, 0, 50, url));
      }else if(i==2){
        views.push(this._image(0, 50, 50, 50, 0, url));
      }else{
        views.push(this._image(0, 50, 50, 50, 50, url));
      }
     
    }
    this.setData({
      template: new Card().palette(views),
    })
  },
  moved() {
  },
  detached() {
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    imgmake() {
      let views = [];
      console.log(this.data.img);
      var url = ''
      for (let i in this.data.img) {
        url = this.data.img[i].headImageUrl.replace(/http/g, "https")
        console.log(url.indexOf("https://erpbucket.oiaqye7985.com"))
        //https://erpbucket.img-cn-qingdao.aliyuncs.com
        //https://erpbucket.img-cn-qingdao.aliyuncs.com 
        if (url.indexOf("https://erpbucket.oiaqye7985.com") != -1) {
          url = "https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
        }
        if (url.indexOf("https://erpbucket.img-cn-qingdao.aliyuncs.com") != -1) {
          url = "https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
        }
        if (url.indexOf("https://erpbucket.img-cn-qingdao.aliyuncs.com ") != -1) {
          url = "https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
        }
        if (url == undefined || url == null || url == 'string') {
          url = "https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
        }
        if (i == 0) {
          views.push(this._image(0, 50, 50, 0, 0, url));
        } else if (i == 1) {
          views.push(this._image(0, 50, 50, 0, 50, url));
        } else if (i == 2) {
          views.push(this._image(0, 50, 50, 50, 0, url));
        } else {
          views.push(this._image(0, 50, 50, 50, 50, url));
        }

      }
      this.setData({
        template: new Card().palette(views),
      })
    },
    onImgOK(){

    },
    downLoad(url) {


    },
    _image(index ,win, hei, top, left, url) {
      return (
        {
          type: 'image',
          url: url,
          css: {
            width: `${win}rpx`,
            height: `${hei}rpx`,
            top: `${top}rpx`,
            left: `${left}rpx`,
            borderRadius: `${0}rpx`,
          },
        }
      );
    },
  }
})
