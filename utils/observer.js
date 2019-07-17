const events = Symbol('events');
class Observer {
  constructor() {
    this[events] = {};
  }
  on(eventName, callback) {
    this[events][eventName] = this[events][eventName] || [];
    this[events][eventName].push(callback);
  }
  emit(eventName, param) {
    if (this[events][eventName]) {
      this[events][eventName].forEach((value, index) => {
        value(param);
      })
    }
  }

  clear(eventName) {
    this[events][eventName] = [];
  }

  off(eventName, callback) {
    this[events][eventName] = this[events][eventName] || [];
    this[events][eventName].forEach((item, index) => {
      if (item === callback) {
        this[events][eventName].splice(index, 1);
      }
    })
  }

  one(eventName, callback) {
    this[events][eventName] = [callback];
  }
}

const observer = new Observer();

export {
  Observer,
  observer
}
