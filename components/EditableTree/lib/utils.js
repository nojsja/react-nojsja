"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayRemove = arrayRemove;
exports.deepClone = deepClone;
exports.deepComparison = deepComparison;
exports.fnDebounce = fnDebounce;
exports.fnThrottle = fnThrottle;
exports.getRandomString = void 0;
exports.longNameFormatterNoTail = longNameFormatterNoTail;
exports.secondsToTime = secondsToTime;
exports.typeCheck = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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
  var _Object$prototype = Object.prototype,
      hasOwnProperty = _Object$prototype.hasOwnProperty,
      toString = _Object$prototype.toString; // 获取变量类型

  var getTypeOf = function getTypeOf(data) {
    if (data !== data) return 'nan';

    switch (toString.call(data)) {
      case '[object Null]':
        return 'null';

      case '[object Array]':
        return 'array';

      case '[object Object]':
        return 'object';

      case '[object RegExp]':
        return 'regexp';

      case '[object Date]':
        return 'date';

      default:
        return _typeof(data);
    }
  }; // 基本类型比较


  var is = function is(d1, d2, type) {
    if (type === 'nan') return true;
    if (type === 'date' || type === 'regexp') return d1.toString() === d2.toString();
    return d1 === d2;
  }; // 递归比较


  var compare = function compare(d1, d2) {
    var type1 = getTypeOf(d1);
    var type2 = getTypeOf(d2);

    if (type1 !== type2) {
      return false;
    }

    if (type1 === 'object' || type1 === 'array') {
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


function deepClone(data) {
  var map = new WeakMap();

  var isObjType = function isObjType(obj, type) {
    if (_typeof(obj) !== 'object') return false;
    return Object.prototype.toString.call(obj) === "[object ".concat(type, "]");
  };

  var _clone = function _clone(target) {
    if (target === null) return null;
    if (target !== target) return NaN;
    if (_typeof(target) !== 'object') return target;
    var base; // 对正则对象做特殊处理

    if (isObjType(target, 'RegExp')) return new RegExp(target.source, target.flags); // 对Date对象做特殊处理

    if (isObjType(target, 'Date')) return new Date(target.getTime());
    base = isObjType(target, 'Array') ? [] : {}; // 处理循环引用

    if (map.get(target)) return map.get(target);
    map.set(target, base);

    for (var i in target) {
      base[i] = _clone(target[i]);
    }

    return base;
  };

  return _clone(data);
}

;