import React, { useEffect, useState, useRef } from 'react';
import { Message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import AbnormalSingleModal from '../AllOrdersTable/components/AbnormalSingleModal';
import UploadPolicyModal from '@/components/OrderComponents/UploadPolicyModal';
import NewLogModal from '../AllOrdersTable/components/NewLogModal';
export const actions = {};

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  let { dispatch, currentUser, getDataList, random } = props;
  const MESSAGECONFIG = {
    1: '正在上传正本，暂时无法操作',
    2: '正在修改资料，暂时无法操作',
    4: '正在打入异常单，暂时无法操作',
  };

  const [showAbnormalSingleModal, setAbnormalSingleModal] = useState(false);
  const [showUploadPolicyModal, setUploadPolicyModal] = useState(false);
  const [showNewLogModal, setNewLogModal] = useState(false);

  const insureNum = useRef(0);
  const companyPolicyNum = useRef(0);

  useEffect(() => {
    if (!actions[random]) {
      let obj = {
        [random]: {
          edit: rowData => {
            if (rowData.lockState) {
              if (rowData.lockState == 2 && rowData.lockOperateNo == currentUser.workCode) {
                router.push(
                  `/order/order-mgm/modify/${rowData.traceId}/${rowData.partnerId}/${rowData.insureNum}`,
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
            lockFun(
              {
                insureNum: rowData.insureNum,
                lockState: 2,
              },
              () => {
                router.push(
                  `/order/order-mgm/modify/${rowData.traceId}/${rowData.partnerId}/${rowData.insureNum}`,
                );
              },
            );
          },
          original: rowData => {
            if (rowData.lockState) {
              if (rowData.lockState == 1 && rowData.lockOperateNo == currentUser.workCode) {
                insureNum.current = rowData.insureNum;
                companyPolicyNum.current = rowData.companyPolicyNum;
                setUploadPolicyModal(true);
              } else {
                Message.error(
                  `${rowData.lockOperateName}（${rowData.lockOperateNo}）${MESSAGECONFIG[
                    rowData.lockState
                  ] || '正在操作，暂时无法操作'}`,
                );
              }
              return;
            }
            lockFun(
              {
                insureNum: rowData.insureNum,
                lockState: 1,
              },
              () => {
                insureNum.current = rowData.insureNum;
                companyPolicyNum.current = rowData.companyPolicyNum;
                setUploadPolicyModal(true);
              },
            );
          },
          abnormalSingle: rowData => {
            if (rowData.lockState) {
              if (rowData.lockState == 4 && rowData.lockOperateNo == currentUser.workCode) {
                insureNum.current = rowData.insureNum;
                companyPolicyNum.current = rowData.companyPolicyNum;
                setAbnormalSingleModal(true);
              } else {
                Message.error(
                  `${rowData.lockOperateName}（${rowData.lockOperateNo}）${MESSAGECONFIG[
                    rowData.lockState
                  ] || '正在操作，暂时无法操作'}`,
                );
              }
              return;
            }
            lockFun(
              {
                insureNum: rowData.insureNum,
                lockState: 4,
              },
              () => {
                insureNum.current = rowData.insureNum;
                companyPolicyNum.current = rowData.companyPolicyNum;
                setAbnormalSingleModal(true);
              },
            );
          },
          newLog: rowData => {
            insureNum.current = rowData.insureNum;
            companyPolicyNum.current = rowData.companyPolicyNum;
            setNewLogModal(true);
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

  return (
    <>
      <AbnormalSingleModal
        insureNum={insureNum}
        refreshData={getDataList}
        visible={showAbnormalSingleModal}
        setModalVisible={setAbnormalSingleModal}
      />
      <UploadPolicyModal
        insureNum={insureNum}
        visible={showUploadPolicyModal}
        setModalVisible={setUploadPolicyModal}
        refreshData={getDataList}
      />
      <NewLogModal
        insureNum={insureNum}
        refreshData={getDataList}
        visible={showNewLogModal}
        setModalVisible={setNewLogModal}
      />
    </>
  );
});
