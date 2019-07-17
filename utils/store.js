import {
  Observer
} from './observer'

const bindWatcher = Symbol('bindWatcher');
const unbindWatcher = Symbol('unbindWatcher');

class Store extends Observer {
  constructor() {
    super();
    this.app = null;
  }
  // 创建app
  createApp(options) {
    const {
      onLaunch
    } = options;
    const store = this;
    options.onLaunch = function (...params) {
      store.app = this;
      if (typeof onLaunch === 'function') {
        onLaunch.apply(this, params);
      }
    }
    return options;
  }
  // 创建页面
  createPage(options) {
    const {
      globalData = [],
      watch = {},
      onLoad,
      onUnload
    } = options;
    const store = this;
    // 保存globalData更新回调的引用
    const globalDataWatcher = {};
    // 保存watch监听回调的引用
    const watcher = {};
    // 劫持onLoad
    options.onLoad = function (...params) {
      store[bindWatcher](globalData, watch, globalDataWatcher, watcher, this);
      if (typeof onLoad === 'function') {
        onLoad.apply(this, params);
      }
    }
    // 劫持onUnload
    options.onUnload = function () {
      store[unbindWatcher](watcher, globalDataWatcher);
      if (typeof onUnload === 'function') {
        onUnload.apply(this);
      }
    }
    delete options.globalData;
    delete options.watch;
    return options;
  }
  // 创建组件
  createComponent(options) {
    const {
      globalData = [],
      watch = {},
      attached,
      detached
    } = options;
    const store = this;
    // 保存globalData更新回调的引用
    const globalDataWatcher = {};
    // 保存watch监听回调的引用
    const watcher = {};
    // 劫持attached
    options.attached = function (...params) {
      store[bindWatcher](globalData, watch, globalDataWatcher, watcher, this);
      if (typeof attached === 'function') {
        attached.apply(this, params);
      }
    }
    // 劫持detached
    options.detached = function () {
      store[unbindWatcher](watcher, globalDataWatcher);
      if (typeof detached === 'function') {
        detached.apply(this);
      }
    }
    delete options.globalData;
    delete options.watch;
    return options;
  }
  // 派发一个action更新状态
  dispatch(action, payload) {
    this.app.globalData[action] = payload;
    this.emit(action, payload);
  }
  /**
   * 1. 初始化页面关联的globalData并且监听更新
   * 2. 绑定watcher
   * @param {Array} globalData
   * @param {Object} watch
   * @param {Object} globalDataWatcher
   * @param {Object} watcher
   * @param {Object} instance 页面实例
   */
  [bindWatcher](globalData, watch, globalDataWatcher, watcher, instance) {
    const instanceData = {};
    for (let prop of globalData) {
      instanceData[prop] = this.app.globalData[prop];
      globalDataWatcher[prop] = payload => {
        instance.setData({
          [prop]: payload
        })
      }
      this.on(prop, globalDataWatcher[prop]);
    }
    for (let prop in watch) {
      watcher[prop] = payload => {
        watch[prop].call(instance, payload);
      }
      this.on(prop, watcher[prop])
    }
    instance.setData(instanceData);
  }
  /**
   * 解绑watcher与globalDataWatcher
   * @param {Object} watcher
   * @param {Object} globalDataWatcher 
   */
  [unbindWatcher](watcher, globalDataWatcher) {
    // 页面卸载前 解绑对应的回调 释放内存
    for (let prop in watcher) {
      this.off(prop, watcher[prop]);
    }
    for (let prop in globalDataWatcher) {
      this.off(prop, globalDataWatcher[prop])
    }
  }
}

export default new Store()
