import { notification } from 'antd';
import getLang from './lang';

const openNotification = (type, code, message, apiDesc) => {
  let typeLang = '';
  const lang = getLang((JSON.parse(localStorage.getItem('USER_CONFIG')) || {}).lang);
  switch (type) {
    case 'success':
      typeLang = lang.operationSuccess;
      break;
    case 'info':
      typeLang = lang.attentionPlease;
      break;
    case 'warning':
      typeLang = lang.warning;
      break;
    case 'error':
      typeLang = lang.operationFailed;
      break;
    default: {
      typeLang = '';
    }
  }
  if (code && !apiDesc) {
    notification[type]({
      message: typeLang,
      description: lang[code],
    });
  } else if (message && !apiDesc) {
    notification[type]({
      message: typeLang,
      description: message,
    });
  } else if (code && apiDesc) {
    notification[type]({
      message: typeLang,
      description: `${lang[apiDesc]}，[${lang[code] || lang.error}]`,
    });
  } else if (message && apiDesc) {
    notification[type]({
      message: typeLang,
      description: `${lang[apiDesc]}，[${message}]`,
    });
  }
};

export default openNotification;
