const app = getApp();
const globalData = app.globalData;

Page({
    data: {
        cover: "cover",
        videoId: "",
        src: "",
        videoInfo: {},
        userLikeVideo: false,
        commentsPage: 1,
        commentsTotalPage: 1,
        commentsList: [],
        placeholder: "说点什么...",
        red: true,
        chuan: null,
        comName: null,
        start: false,
        hiddenStop: false,
        ladeIf: true,
        buttonClicked: false,
        pages: 1,
        lastX: 0,          //滑动开始x轴位置
        lastY: 0,          //滑动开始y轴位置
        text: "没有滑动",
        currentGesture: 0, //标识手势
        leftImg:true,
        totalCount:0
    },
    //滑动移动事件
    handletouchmove: function (event) {
        var currentX = event.touches[0].pageX
        var currentY = event.touches[0].pageY
        var tx = currentX - this.data.lastX
        var ty = currentY - this.data.lastY
        var text = ""
        //左右方向滑动
        if (Math.abs(tx) > Math.abs(ty)) {
            if (tx < 0)
                text = "向左滑动";
            else if (tx > 0)
                text = "向右滑动"

        }
        //上下方向滑动
        else {
            if (ty < 0)
                text = "向上滑动"
            else if (ty > 0)
                text = "向下滑动"
        }

        //将当前坐标进行保存以进行下一次计算
        this.data.lastX = currentX
        this.data.lastY = currentY
        this.setData({
            text: text,
        });
    },

    //滑动开始事件
    handletouchtart: function (event) {
        this.data.lastX = event.touches[0].pageX
        this.data.lastY = event.touches[0].pageY
    },
    //滑动结束事件
    handletouchend: function (event) {
        this.data.currentGesture = 0;
        console.log(this.data.text);
        if (this.data.text == '向左滑动') {
            this.setData({
                indexS: this.data.indexS + 1
            });
          console.log("向左滑动");
          this.setData({
              leftImg:false
          })
          this.switchVideo()
        } 
        this.setData({
            text: "没有滑动",
            lastX: 0,
            lastY: 0,
        });
        this.videoStop();
    },
    videoCtx: {},
    onLoad: function (params) {
      console.log(globalData.cardInfo.createTime)
      this.setData({
        chuan: JSON.parse(params.chuan),
        indexS: parseInt(params.indexS),
        red: false,
        comName: globalData.cardInfo,
        
      })
      console.log(this.data.chuan.createTime)
      console.log(this.timedata(this.data.chuan.createTime))
      this.setData({
        "chuan.createTime":this.timedata(this.data.chuan.createTime)
      })
    },
    timedata(input){
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
    onShow: function () {
      
    },

    onHide: function () {
        
    },

    showSearch: function () {
        
    },

    vodeoLade(val) {
      this.setData({
        "ladeIf": false
      })
    },
    switchVideo(){
      this.setData({
        pages:this.data.pages+1
      })
      this.getVideoList(this.data.pages)
    },
    //点赞
    likeVideoOrNot(e) {
      let total1 = 'chuan.totalThumb';
      let totalThumb = this.data.chuan.totalThumb;
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/actice/videoThumb',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          videoId: this.data.chuan.id,
          employeeId: globalData.cardEmplyId,
          visitorId: globalData.visitorInfo.id,
          loginId: this.data.comName.loginId,
          loginType: this.data.comName.loginType
        },
        success: (res) => {
          console.log(res)
          if (this.data.red) {
            this.setData({
              red: !this.data.red,
              [total1]: totalThumb + 1
            })
          } else {
            this.setData({
              red: !this.data.red,
              [total1]: totalThumb - 1
            })
          }

        }
      })
    },
    //获取视频列表
    getVideoList(page) {
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/getVideoList',
        method: 'POST',
        data: {
          companyId: globalData.companyId,//公司id
          visitorId: globalData.visitorInfo.id,
          pageNum: page,
          pageSize: 1
        },
        success: (res) => {
          console.log(res);
          this.setData({
            totalCount: res.data.data.totalCount,
            chuan: res.data.data.videoList[0],
            indexS: res.data.data.videoList[0].id,
            red: false,
          })
          this.setData({
            "chuan.createTime": this.timedata(this.data.chuan.createTime)
          })
          if (this.data.pages == res.data.data.totalCount){
            this.setData({
              pages: 0
            })
          }
        }
      })
    },
    //转发

    onShareAppMessage(data) {
      this.addVideoTransfer()
      let title = `您好，我是${globalData.cardInfo.company}公司的${globalData.cardInfo.name}，这是我的电子名片，请惠存~~`
      if (globalData.cardInfo.transferTitle != null && globalData.cardInfo.transferTitle != '' && globalData.cardInfo.transferTitle != undefined) {
        title = globalData.cardInfo.transferTitle
      };
      console.log(title)
      //
      return {
        title: title,
        path: `pages/Bootpage/Bootpage?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.cardEmplyId}&video=video`,
        success: res => {
          console.log("转发成功", res);
        }
      }
    },
    //转发埋点
    addVideoTransfer(){
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/actice/addVideoTransfer',
        method: 'POST',
        data: {
          wxCardVideoId: this.data.chuan.id,
          companyId: globalData.companyId,
          wxCardVisitorId: globalData.visitorInfo.id,
          wxCardEmployeeId: globalData.cardEmplyId,
          loginId: this.data.comName.loginId,
          loginType: this.data.comName.loginType
        },
        success: res => {
          console.log(res + '+1')
        }
      });
      wx.request({
        url: globalData.webRequsetUrlT + '/radar/videoTransfer',
        method: 'POST',
        data: {
          companyId: globalData.companyId,
          wxCardVisitorId: globalData.visitorInfo.id,
          wxCardEmployeeId: globalData.cardEmplyId,
          loginId: globalData.cardInfo.loginId,
          sfaCompanyId: globalData.cardInfo.sfaCompanyId,
          loginType: globalData.cardInfo.loginType,
          type: 1,
          forwardType: 0,
        },
        success: res => {
          console.log(res + '转了')
        }
      })
    },
    // 播放时暂停
    clickPush(e) {
      let videoContext = wx.createVideoContext('myVideo');
      videoContext.pause();
      this.setData({
        start: true
      })
    },
    // 点击播放
    videoStop() {
      this.setData({
        start: false
      })
      let videoContext = wx.createVideoContext('myVideo');
      videoContext.play();

    }
})