import store from './store.js'
import NIM from './NIM_Web_NIM_weixin_v5.8.0.js'
let app = getApp();
let usersall = {};
let sessionsAll = [];
let statusArr = [];
// IM对象类
export default class IMController {
  constructor(headers) {
    app.globalData.appnim = NIM.getInstance({
      db: false,
      appKey: headers.myAppKey,
      account: headers.myAccount,
      token: headers.myToken,
      syncSessionUnread: true,
      onconnect: this.onConnect,
      onwillreconnect: this.onWillReconnect,
      ondisconnect: this.onDisconnect,
      onerror: this.onError,
      onsessions: this.onSessions,
      onupdatesession: this.onUpdateSession,
      onpushevents: this.onPushEvents,
      onRoamingMsgs: this.onRoamingMsgs,
      onmsg: this.onMsg,
    });
  };
  //
  onMsg(msg) {
     console.log('收到消息', msg.scene, msg.type, msg);
    store.dispatch('chart', msg);
  };
   onPushEvents(param) {
     console.log('订阅事件', param.msgEvents);
     let msgEvents = param.msgEvents
     if (msgEvents) {
       statusArr = [];
       msgEvents.map((data) => {
         statusArr.push({
           status: updateMultiPortStatus(data),
           account: data.account
         })
       })
     }
     if (app.globalData.chartlist.lenght!=0){
       console.log("可以刷新状态");
       getTheSame(app.globalData.chartlist, statusArr)
     }
   };
  onConnect(param) {
    console.log('连接成功');
    console.log(app);
    if (app.globalData.ifurlim){
        store.dispatch('ifurlim', false);
        store.dispatch('ifurlimok', true);
        wx.switchTab({
          url: `/pages/chartlist/chartlist`,
        });
       
    }
  };
  onWillReconnect(obj) {
    // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
    console.log('即将重连');
    console.log(obj.retryCount);
    console.log(obj.duration);
  };
  onDisconnect(error) {
    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    console.log('丢失连接');
    //  app.globalData.nim1.connect();
    console.log(error);
    if (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          break;
        // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
        case 417:
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          break;
        default:
          break;
      }
    }
  };
  onError(error) {
    console.log(error);
  };
  onSessions(sessions) {
    console.log('收到会话列表', sessions);
    console.log("跟新用户参数和界面");
    sessionsAll = sessions;
    updateAccounts(sessionsAll);
    
  };
  onUpdateSession(session) {
    console.log('会话更新了', session);
    console.log(sessionsAll);

    for (var i in sessionsAll) {
      if (sessionsAll[i].id == session.id) {
        sessionsAll.splice(i, 1)
      }
    }
    sessionsAll.splice(0, 0, session);
    updateAccounts(sessionsAll);
  };
}

//消息用的函数
function updateAccounts(sessions) {
  var accounts = new Array();
  //更新 用户资料 
  accounts = new Array();
  for (var index in sessions) {
    accounts.push(sessions[index].to);
  }
  app.globalData.appnim.getUsers({
    accounts: accounts,
    done: getUsersDone
  });
};
function getUsersDone(error, users) {
  console.log('获取用户资料' + (!error ? '成功' : '失败'));
  usersall= users;
  updateSessionsUI(sessionsAll);
}
function updateSessionsUI(sessions) {
  console.log("刷新界面")
  // 刷新界面
  //alert("刷新界面");
  var chatList = [];
  var allSign = 0;
  // console.log(sessions)
  for (var index in sessions) {
    var user = getUser(sessions[index].to);
    if (user != "") {
      var chat = new Object();;
      chat.img = user.avatar;
      chat.title = user.nick;
      chat.content = sessions[index].lastMsg.text;
      chat.status = "离线";
      chat.time = showtime(sessions[index].updateTime);
      chat.account = user.account
      if (sessions[index].unread != "0") {
        chat.sign = sessions[index].unread;
      } else {
        chat.sign = "";
      }
      chatList.push(chat);
      allSign = parseInt(allSign) + parseInt(sessions[index].unread);
    }
  }
  if (allSign > 0) {
    //有新消息
    store.dispatch('allSign', allSign);
    wx.showTabBarRedDot({
      index:3
    })
  }
  getTheSame(chatList, statusArr)
}
function getUser(accid) {
  for (var index in usersall) {
    if (usersall[index].account == accid) {
      return usersall[index];
    }
  }
  return "";
}
//数据刷新
function getTheSame(attendUid, dataattendUid) {
  var c = dataattendUid.toString();
  for (var i = 0; i < attendUid.length; i++) {
    if (c.indexOf(attendUid[i].toString()) > -1) {
      for (var j = 0; j < dataattendUid.length; j++) {
        if (attendUid[i].account == dataattendUid[j].account) {
          attendUid[i].status = dataattendUid[j].status
        }
      }
    }
  }
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  console.log(url);
  if (url !="pages/AIHref/AIHref"){
    store.dispatch('chartlist', attendUid);
  }
  
}
function showtime(time) {
  var now = new Date(time);
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var month = now.getMonth() + 1;
  var day = now.getDate() < 10 ? '0' + now.getDate() : '' + now.getDate();
  var timeValue = "" + ((hours >= 12) ? "下午 " : "上午 ")
  timeValue += ((hours > 12) ? hours - 12 : hours)
  timeValue += ((minutes < 10) ? ":0" : ":") + minutes
  //timeValue += ((seconds < 10) ? ":0" : ":") + seconds
  return month + "/" + day + timeValue
}
function updateMultiPortStatus(data) {
  if (data.account) {
    let account = data.account
    let multiPortStatus = ''

    function getMultiPortStatus(customType, custom) {
      // 服务器下推多端事件标记的特定序号对应值
      var netState = {
        0: '',
        1: 'Wifi',
        2: 'WWAN',
        3: '2G',
        4: '3G',
        5: '4G'
      }
      var onlineState = {
        0: '在线',
        1: '忙碌',
        2: '离开'
      }

      var custom = custom || {}
      if (customType !== 0) {
        // 有serverConfig.online属性，已被赋值端名称
        custom = custom[customType]
      } else if (custom[4]) {
        custom = custom[4]
        multiPortStatus = '电脑'
      } else if (custom[2]) {
        custom = custom[2]
        multiPortStatus = 'iOS'
      } else if (custom[1]) {
        custom = custom[1]
        multiPortStatus = 'Android'
      } else if (custom[16]) {
        custom = custom[16]
        multiPortStatus = 'Web'
      } else if (custom[64]) {
        custom = custom[64]
        multiPortStatus = 'Mac'
      }
      if (custom) {
        custom = JSON.parse(custom)
        if (typeof custom['net_state'] === 'number') {
          var tempNetState = netState[custom['net_state']]
          if (tempNetState) {
            multiPortStatus += ('[' + tempNetState + ']')
          }
        }
        if (typeof custom['online_state'] === 'number') {
          multiPortStatus += onlineState[custom['online_state']]
        } else {
          multiPortStatus += '在线'
        }
      }
      return multiPortStatus
    }
    // demo自定义多端登录同步事件
    if (+data.type === 1) {
      if (+data.value === 1 || +data.value === 2 || +data.value === 3 || +data.value === 10001) {
        var serverConfig = JSON.parse(data.serverConfig)
        var customType = 0
        multiPortStatus = ''
        // 优先判断serverConfig字段
        if (serverConfig.online) {
          if (serverConfig.online.indexOf(4) >= 0) {
            multiPortStatus = '电脑'
            customType = 4
          } else if (serverConfig.online.indexOf(2) >= 0) {
            multiPortStatus = 'iOS'
            customType = 2
          } else if (serverConfig.online.indexOf(1) >= 0) {
            multiPortStatus = 'Android'
            customType = 1
          } else if (serverConfig.online.indexOf(16) >= 0) {
            multiPortStatus = 'Web'
            customType = 16
          } else if (serverConfig.online.indexOf(64) >= 0) {
            multiPortStatus = 'Mac'
            customType = 64
          }
        }
        if (data.custom && (Object.keys(data.custom).length > 0)) {
          var portStatus = getMultiPortStatus(customType, data.custom)
          // 如果serverConfig里有属性而custom里没有对应属性值
          if ((multiPortStatus !== '') && (portStatus === '')) {
            multiPortStatus += '在线'
          } else {
            multiPortStatus = portStatus
            // multiPortStatus += portStatus
          }
        } else if (customType !== 0) {
          multiPortStatus += '在线'
        } else {
          multiPortStatus = '离线'
        }
        return multiPortStatus
      }
    }
  }
  return '离线'
};
//
