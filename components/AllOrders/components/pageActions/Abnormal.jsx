import React, { useEffect } from 'react';
import { Message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

export const actions = {};

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  let { dispatch, currentUser, getDataList, random } = props;
  const MESSAGECONFIG = {
    5: '正在处理异常，暂时无法操作',
  };

  useEffect(() => {
    if (!actions[random]) {
      let obj = {
        [random]: {
          treatmentException: rowData => {
            if (rowData.lockState) {
              if (rowData.lockState == 5 && rowData.lockOperateNo == currentUser.workCode) {
                router.push(
                  `/order/order-mgm/abnormal/${rowData.traceId}/${rowData.partnerId}/${rowData.insureNum}`,
                );
              } else {
                Message.error(
                  `${rowData.lockOperateName}（${rowData.lockOperateNo}）${MESSAGECONFIG[
                    rowData.lockState
                  ] || '正在操作，暂时无法操作'}`,
                );
              }
              return;
            }
            // 锁单状态：0-未锁单 1-上传正本锁单 2-修改资料锁单 3-批改锁单 4-移入异常锁单  5-异常处理锁单 ,
            lockFun(
              {
                insureNum: rowData.insureNum,
                lockState: 5,
              },
              () => {
                // 页面跳转
                router.push(
                  `/order/order-mgm/abnormal/${rowData.traceId}/${rowData.partnerId}/${rowData.insureNum}`,
                );
              },
            );
          },
        },
      };
      Object.assign(actions, obj);
    }
    return () => {
      if (actions[random]) {
        delete actions[random];
      }
    };
  }, []);

  const lockFun = (param, fn) => {
    if (dispatch) {
      dispatch({
        type: 'order/inureLockStart',
        payload: {
          ...param,
        },
        callback: res => {
          if (res.code === 200) {
            Message.info('订单状态已锁定');
            // 刷新数据
            if (getDataList) {
              getDataList();
            }
            if (fn) {
              fn();
            }
          } else {
            Message.error(res.msg);
          }
        },
      });
    }
  };
  return <></>;
});
