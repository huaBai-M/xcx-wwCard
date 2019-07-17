import store from '../../utils/store.js';
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
//获取应用实例
const app = getApp()
const globalData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [],
    activeType: {},
    show: false,
    username: '',
    password: '',
    groupName: '',
    modify: false,
    modifyData: {},
    num: -1,
    type:"1"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.type=="0"){
      console.log(globalData.callGroup);
      this.setData({
        groupName: globalData.callGroup.groupName,
        type: options.type
      });
    }
    this.findGroupType()
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
  //点击选择组类型
  selectedType(e) {
    let typeIndex = e.currentTarget.dataset;
    if (typeIndex.typeI == this.data.num) {
      this.setData({
        "num": -1,
        "activeType": []
      })
      return false;
    }
    this.setData({
      "num": typeIndex.typeI,
      "activeType": typeIndex
    })
  },
  userNameInput: function (e) {
    this.setData({
      "groupName": e.detail.value
    })
  },
  showIf() {
    this.setData({
      show: true
    });
  },
  usernameFun(val) {
    this.setData({
      "username": val.detail
    })
  },
  //确定
  confirmAdd(){
    if (this.data.groupName == '') {
      Toast('请输入组名称');
      return false
    }
    let activeType = this.data.activeType;
    console.log(activeType)
    Dialog.confirm({
      title: '提示',
      message: '确定要创建当前分组么？'
    }).then(() => {
      // on confirm
      if (activeType.typeIndex != undefined) {
        this.addGroupData(this.data.groupName, activeType.typeName, activeType.typeIndex)
      } else {
        this.addGroupData(this.data.groupName, '', '')
      }

    }).catch(() => {
      // on cancel
    });   
  },
  findGroupType() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/findGroupType',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
      },
      success: (res) => {
        console.log(res)
        this.setData({
          types: res.data.data
        });
        if (this.data.type=="0"){
          for(let i in this.data.types){
            if (globalData.callGroup.groupTypeId == this.data.types[i].id){
              console.log(i)
                this.setData({
                  num:i
                })
              }
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  //增加分组
  addGroupData(groupName, groupType, groupTypeId) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/addGroup',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
        groupName: groupName,
        groupType: groupType,
        groupTypeId: groupTypeId
      },
      success: res => {
        console.log(res);
        Toast('创建成功');
        wx.navigateBack({
          delta: 1
        })
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  //新增分组类型
  addGroupType(typeName) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/addGroupType',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
        typeName: typeName,
      },
      success: res => {
        console.log(res);
        this.setData({
          "username": '',
          show: false
        });
        this.findGroupType()
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  //修改接口调用
  editGroup() {

    if (this.data.groupName == '') {
      Toast('分组名不能为空');
    };
    let typeName = this.data.activeType.typeName
    let groupTypeId = this.data.activeType.typeIndex
    if (groupTypeId == undefined) {
      typeName = ''
      groupTypeId = ''
    }
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/editGroup',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorInfo.id,//访客Id
        groupName: this.data.groupName,
        groupId: globalData.callGroup.groupId,
        groupType: typeName,
        groupTypeId: groupTypeId
      },
      success: res => {
        console.log(res);
        if (res.statusCode != 200) {
          Toast('错误');
          return false
        }
        Toast('修改成功');
        wx.redirectTo({
          url: `/pages/callGroup/callGroup`,
        });
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      if (this.data.username != '') {
        for (let i in this.data.types) {
          if (this.data.username == this.data.types[i].name) {
            Toast('已存在组类型');
            this.setData({
              "username": '',
              "show": false
            })
            return false
          }
        }
        this.addGroupType(this.data.username)
      } else {
        Toast('内容不能为空');
        this.setData({
          show: false
        });
      }
    } else {
      this.setData({
        show: false
      });
    };
  },
  cancel: function () {
    Dialog.confirm({
      title: '提示',
      message: '确定要取消创建分组么？'
    }).then(() => {
      wx.navigateBack({
        delta: 1
      })
    }).catch(() => {
      // on cancel
    });
  },
  /**
   * 用户点击右上角分享
   */
  //转发
  onShareAppMessage(data) {
    return {
      path: `pages/Bootpage/Bootpage?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.cardEmplyId}`,
      success: res => {
        console.log("转发成功", res);
      }
    }
  },
})