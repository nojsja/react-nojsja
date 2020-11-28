/* 获取随机字符串 */
export const getRandomString = () => Math.random().toString(36).substr(2);

/**
 * [deepComparison 深比较]
 * @param  {[any]} data [any]
 * @return {[Boolean]}      [是否相同]
 */
export function deepComparison(data1, data2) {
  const { hasOwnProperty } = Object.prototype;

  // 获取变量类型
  const getType = (d) => {
    if (typeof d === 'object') {
      if (!(d instanceof Object)) {
        return 'null';
      }
      if (d instanceof Date) {
        return 'date';
      }
      if (d instanceof RegExp) {
        return 'regexp';
      }

      // object / array //
      return 'object';
    }
    if (d !== d) return 'nan';
    return (typeof d).toLowerCase();
  };

  // 基本类型比较
  const is = (d1, d2, type) => {
    if (type === 'nan') return true;
    if (type === 'date' || type === 'regexp') return d1.toString() === d2.toString();
    return (d1 === d2);
  };

  // 递归比较
  const compare = (d1, d2) => {
    const type1 = getType(d1);
    const type2 = getType(d2);

    if (type1 !== type2) {
      return false;
    }

    if (type1 === 'object') {
      const keys1 = Object.keys(d1).filter(k => hasOwnProperty.call(d1, k));
      const keys2 = Object.keys(d2).filter(k => hasOwnProperty.call(d2, k));
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let i = 0; i < keys1.length; i += 1) {
        if (
          !keys2.includes(keys1[i]) ||
          !compare(d1[keys1[i]], d2[keys1[i]])) {
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
 export function fnDebounce() {
  const fnObject = {};
  let timer;

  return (fn, delayTime, isImediate, args) => {
    // 设置定时器方法
    const setTimer = () => {
      timer = setTimeout(() => {
        fn(args);
        // 清除定时器
        clearTimeout(timer);
        delete (fnObject[fn]);
      }, delayTime);

      fnObject[fn] = {
        delayTime,
        timer,
      };
    };

    // 立即调用
    if (!delayTime || isImediate) return fn(args);

    // 判断函数是否已经在调用中
    if (fnObject[fn]) {
      clearTimeout(timer);
      // 定时器
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
 export function fnThrottle() {
  const fnObject = {};
  let timer;

  return (fn, delayTime, isImediate, args) => {
    // 设置定时器方法
    const setTimer = () => {
      timer = setTimeout(() => {
        fn(args);
        // 清除定时器
        clearTimeout(timer);
        delete (fnObject[fn]);
      }, delayTime);

      fnObject[fn] = {
        delayTime,
        timer,
      };
    };

    // 立即调用
    if (!delayTime || isImediate) return fn(args);

    // 判断函数是否已经在调用中
    if (fnObject[fn]) return;
    // 定时器
    setTimer(fn, delayTime, args);
  };
}

export function arrayRemove(array, item) {
  if (!array || !item) return;

  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

/* 判断类型 */
export const typeCheck = (target, type) => {
  switch (type) {
    case 'array':
      return Array.prototype.isPrototypeOf(target);
    case 'object':
      return !Array.isArray(target) && target !== null && (target || '').toString() === '[object Object]';
    default:
      return (typeof target) === type;
  }
};

/**
  * longNameFormatter [长名保留前后位数]
  * @param  {[String]} str [字符串]
  * @param  {[Number]} limit [超过多少位字符开始省略显示，推荐50]
  * @return {[Number]} param [desc]
  */
 export function longNameFormatterNoTail (name, limit = 50) {
  if (name.length < limit) {
    return name;
  }
  return `${name.slice(0, (limit))}...`;
};

/**
  * secondsToTime [seconds -> time]
  * @author nojsja
  * @param  {[Number]} seconds [seconds]
  * @return {[String]} [hh:mm:ss]
  */
export function secondsToTime(seconds) {
  let h = Math.floor(seconds / 3600);
  h = h < 10 ? `0${h}` : h;
  let m = Math.floor((seconds / 60 % 60));
  m = m < 10 ? `0${m}` : m;
  let s = Math.floor((seconds % 60));
  s = s < 10 ? `0${s}` : s;

  return `${h}:${m}:${s}`;
}

/**
* deepClone [clone an object]
* @param  {[Any]} parent [target]
* @return {[Any]}
*/

export function deepClone(parent) {
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];
  
  const getRegExp = re => {
    var flags = '';
    if (re.global) flags += 'g';
    if (re.ignoreCase) flags += 'i';
    if (re.multiline) flags += 'm';
    return flags;
  };
  
  const isType = (obj, type) => {
    if (typeof obj !== 'object') return false;
    const typeString = Object.prototype.toString.call(obj);
    let flag;
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

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== 'object') return parent;
    if (parent !== parent) return NaN;

    let child, proto, index;

    if (isType(parent, 'Array')) {
      child = [];
    } else if (isType(parent, 'RegExp')) {
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, 'Date')) {
      child = new Date(parent.getTime());
    } else {
      proto = Object.getPrototypeOf(parent);
      child = Object.create(proto);
    }

    // 处理循环引用
    index = parents.indexOf(parent);
    if (index != -1) return children[index];
    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      child[i] = _clone(parent[i]);
    }

    return child;
  };

  return _clone(parent);
};