/* -------------- 正则 -------------- */

// 经纪费率正则：[1, 0.00001]
export const costRateReg = /(^1$)|(^0\.([0-9]){0,4}([1-9]))$/;
// 排序号正则：大于0的正整数
export const sortReg = /^[1-9]\d*$/;
// 正则：非负数
export const nonNegativeReg = /^\d+(\.\d+)?$/;
// QuillEditor 空字符串正则
export const quillEmptyReg = /^<p><br><\/p>$/;
// 非中文正则
export const notChineseReg = /^[^\u4e00-\u9fa5]*$/g;
// 中文正则
export const chineseReg = /^[\u4e00-\u9fa5]*$/;
// 非法字符正则
export const illegalCharReg = /^[^\&\*\^%#@\!！\{\}\\\/\/\=\<\>\?\.\~\|;；]*$/;
// 非法字符正则(简单版)
export const simpleIllegalCharReg = /^[^\&\*\^\!\{\}\\\/\/\<\>\~\|]*$/;
// 正整数正则
export const positiveIntegerReg = /^[1-9]\d*$/;
// 正数正则
export const positiveReg = /(^[1-9]\d*(\.)?\d*$)|(^0\.\d*[1-9]\d*$)/;
// 数字字母中文正则，例如用户名中不允许特殊字符
export const noSpecialReg = /^[a-zA-Z0-9\u4E00-\u9FA5]+$/;
// 只允许数字字母正则，例如证件号码
export const alphanumericReg = /^[a-zA-Z0-9]+$/;
// 验证是是身份证（简单验证）
export const IDCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
// 真实姓名验证 中国人一般是2-4位的名字
export const trueNameReg = /^[\u4e00-\u9fa5]{2,4}$/;

/* -------------- handlers -------------- */

// 检验对象是否每个属性都有值
export const objectEmptyAttrValidator = value => {
  if (!value) return false;
  return Object.entries(value).every(
    ([key, value]) =>
      value !== '' &&
      value !== null &&
      value !== undefined &&
      (value instanceof Array ? value.length > 0 : true),
  );
};

// 费率设置校验
export const costRateValidator = value => {
  if (!value || !value.length) return false;
  let hasSelected = false;

  for (let i = 0; i < value.length; i++) {
    if (
      value[i].acceptInsurance &&
      (!costRateReg.test(value[i].insureFeeRate) ||
        !costRateReg.test(value[i].settlementFeeRate) ||
        !positiveReg.test(value[i].minInsureFee) ||
        !illegalCharReg.test(value[i].insureType))
    ) {
      console.log(value[i]);
      return Promise.reject(new Error('请完善已勾选承保项的费率设置'));
    }
    hasSelected = hasSelected || value[i].acceptInsurance;
  }
  // if (!hasSelected) {
  //   return Promise.reject(new Error('请至少勾选一项进行承保'));
  // }
  return Promise.resolve();
};

// 费率设置校验-simple
export const costRateValidatorSimple = value => {
  if (!value || !value.length) return false;
  let hasSelected = false;

  for (let i = 0; i < value.length; i++) {
    if (
      value[i].acceptInsurance &&
      (!costRateReg.test(value[i].insureFeeRate) || !positiveReg.test(value[i].minInsureFee))
    ) {
      return Promise.reject(new Error('请完善已勾选承保项的费率设置'));
    }
    hasSelected = hasSelected || value[i].acceptInsurance;
  }
  // if (!hasSelected) {
  //   return Promise.reject(new Error('请至少勾选一项进行承保'));
  // }
  return Promise.resolve();
};
