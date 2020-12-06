"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepComparison = deepComparison;
exports.fnDebounce = fnDebounce;
exports.fnThrottle = fnThrottle;
exports.arrayRemove = arrayRemove;
exports.longNameFormatterNoTail = longNameFormatterNoTail;
exports.secondsToTime = secondsToTime;
exports.deepClone = deepClone;
exports.typeCheck = exports.getRandomString = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* 获取随机字符串 */
var getRandomString = function getRandomString() {
  return Math.random().toString(36).substr(2);
};
/**
 * [deepComparison 深比较]
 * @param  {[any]} data [any]
 * @return {[Boolean]}      [是否相同]
 */


exports.getRandomString = getRandomString;

function deepComparison(data1, data2) {
  var hasOwnProperty = Object.prototype.hasOwnProperty; // 获取变量类型

  var getType = function getType(d) {
    if (_typeof(d) === 'object') {
      if (!(d instanceof Object)) {
        return 'null';
      }

      if (d instanceof Date) {
        return 'date';
      }

      if (d instanceof RegExp) {
        return 'regexp';
      } // object / array //


      return 'object';
    }

    if (d !== d) return 'nan';
    return _typeof(d).toLowerCase();
  }; // 基本类型比较


  var is = function is(d1, d2, type) {
    if (type === 'nan') return true;
    if (type === 'date' || type === 'regexp') return d1.toString() === d2.toString();
    return d1 === d2;
  }; // 递归比较


  var compare = function compare(d1, d2) {
    var type1 = getType(d1);
    var type2 = getType(d2);

    if (type1 !== type2) {
      return false;
    }

    if (type1 === 'object') {
      var keys1 = Object.keys(d1).filter(function (k) {
        return hasOwnProperty.call(d1, k);
      });
      var keys2 = Object.keys(d2).filter(function (k) {
        return hasOwnProperty.call(d2, k);
      });

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (var i = 0; i < keys1.length; i += 1) {
        if (!keys2.includes(keys1[i]) || !compare(d1[keys1[i]], d2[keys1[i]])) {
          return false;
        }
      }

      return true;
    }

    return is(d1, d2, type1);
  };

  return compare(data1, data2);
}
/**
   * @param  {Function} fn         [回调函数]
   * @param  {[Time]}   delayTime  [延迟时间(ms)]
   * @param  {Boolean}  isImediate [是否需要立即调用]
   * @param  {[type]}   args       [回调函数传入参数]
  */


function fnDebounce() {
  var fnObject = {};
  var timer;
  return function (fn, delayTime, isImediate, args) {
    // 设置定时器方法
    var setTimer = function setTimer() {
      timer = setTimeout(function () {
        fn(args); // 清除定时器

        clearTimeout(timer);
        delete fnObject[fn];
      }, delayTime);
      fnObject[fn] = {
        delayTime: delayTime,
        timer: timer
      };
    }; // 立即调用


    if (!delayTime || isImediate) return fn(args); // 判断函数是否已经在调用中

    if (fnObject[fn]) {
      clearTimeout(timer); // 定时器

      setTimer(fn, delayTime, args);
    } else {
      // 定时器
      setTimer(fn, delayTime, args);
    }
  };
}
/**  [节流函数]
   * @param  {Function} fn         [回调函数]
   * @param  {[Time]}   delayTime  [延迟时间(ms)]
   * @param  {Boolean}  isImediate [是否需要立即调用]
   * @param  {[type]}   args       [回调函数传入参数]
  */


function fnThrottle() {
  var fnObject = {};
  var timer;
  return function (fn, delayTime, isImediate, args) {
    // 设置定时器方法
    var setTimer = function setTimer() {
      timer = setTimeout(function () {
        fn(args); // 清除定时器

        clearTimeout(timer);
        delete fnObject[fn];
      }, delayTime);
      fnObject[fn] = {
        delayTime: delayTime,
        timer: timer
      };
    }; // 立即调用


    if (!delayTime || isImediate) return fn(args); // 判断函数是否已经在调用中

    if (fnObject[fn]) return; // 定时器

    setTimer(fn, delayTime, args);
  };
}

function arrayRemove(array, item) {
  if (!array || !item) return;
  var index = array.indexOf(item);

  if (index !== -1) {
    array.splice(index, 1);
  }
}
/* 判断类型 */


var typeCheck = function typeCheck(target, type) {
  switch (type) {
    case 'array':
      return Array.prototype.isPrototypeOf(target);

    case 'object':
      return !Array.isArray(target) && target !== null && (target || '').toString() === '[object Object]';

    default:
      return _typeof(target) === type;
  }
};
/**
  * longNameFormatter [长名保留前后位数]
  * @param  {[String]} str [字符串]
  * @param  {[Number]} limit [超过多少位字符开始省略显示，推荐50]
  * @return {[Number]} param [desc]
  */


exports.typeCheck = typeCheck;

function longNameFormatterNoTail(name) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

  if (name.length < limit) {
    return name;
  }

  return "".concat(name.slice(0, limit), "...");
}

;
/**
  * secondsToTime [seconds -> time]
  * @author nojsja
  * @param  {[Number]} seconds [seconds]
  * @return {[String]} [hh:mm:ss]
  */

function secondsToTime(seconds) {
  var h = Math.floor(seconds / 3600);
  h = h < 10 ? "0".concat(h) : h;
  var m = Math.floor(seconds / 60 % 60);
  m = m < 10 ? "0".concat(m) : m;
  var s = Math.floor(seconds % 60);
  s = s < 10 ? "0".concat(s) : s;
  return "".concat(h, ":").concat(m, ":").concat(s);
}
/**
* deepClone [clone an object]
* @param  {[Any]} parent [target]
* @return {[Any]}
*/


function deepClone(parent) {
  // 维护两个储存循环引用的数组
  var parents = [];
  var children = [];

  var getRegExp = function getRegExp(re) {
    var flags = '';
    if (re.global) flags += 'g';
    if (re.ignoreCase) flags += 'i';
    if (re.multiline) flags += 'm';
    return flags;
  };

  var isType = function isType(obj, type) {
    var typeString = Object.prototype.toString.call(obj);
    var flag;

    switch (type) {
      case 'Array':
        flag = typeString === '[object Array]';
        break;

      case 'Date':
        flag = typeString === '[object Date]';
        break;

      case 'RegExp':
        flag = typeString === '[object RegExp]';
        break;

      default:
        flag = false;
    }

    return flag;
  };

  var _clone = function _clone(parent) {
    if (_typeof(parent) !== 'object' || parent === null) return parent;
    var child, proto, index;

    if (isType(parent, 'Array')) {
      child = [];
    } else if (isType(parent, 'RegExp')) {
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
      return child;
    } else if (isType(parent, 'Date')) {
      child = new Date(parent.getTime());
      return child;
    } else {
      proto = Object.getPrototypeOf(parent);
      child = Object.create(proto);
    } // 处理循环引用


    index = parents.indexOf(parent);
    if (index != -1) return children[index];
    parents.push(parent);
    children.push(child);

    for (var i in parent) {
      child[i] = _clone(parent[i]);
    }

    return child;
  };

  return _clone(parent);
}

;