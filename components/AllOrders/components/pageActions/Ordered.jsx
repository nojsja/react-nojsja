import React, { useEffect, useState, useRef } from 'react';
import { Message } from 'antd';
import { connect } from 'dva';
import request from 'umi-request';
import router from 'umi/router';
import { apiUrl } from '@/services/apiUrl';
import UploadPolicyModal from '@/components/OrderComponents/UploadPolicyModal';
export const actions = {};

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  let { dispatch, currentUser, getDataList, random } = props;
  const MESSAGECONFIG = {
    1: '正在上传保单，暂时无法操作',
    2: '正在修改资料，暂时无法操作',
  };
  const [showUploadPolicyModal, setUploadPolicyModal] = useState(false);
  const insureNum = useRef(0);

  useEffect(() => {}, []);

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
            // 锁单状态：0-未锁单 1-上传正本锁单 2-修改资料锁单 3-批改锁单 4-移入异常锁单  5-异常处理锁单 ,
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
          uploadOriginal: rowData => {
            if (rowData.lockState) {
              if (rowData.lockState == 1 && rowData.lockOperateNo == currentUser.workCode) {
                insureNum.current = rowData.insureNum;
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
                setUploadPolicyModal(true);
              },
            );
          },
          downloadPolicy: rowData => {
            request
              .get(`${apiUrl}/file/download/${rowData.fileId}`, {
                responseType: 'blob',
                getResponse: true,
              })
              .then(res => {
                let blob = res.data;
                let response = res.response;
                let fileName = '保单下载.pdf';
                // 获取服务端下发的文件名称
                let disposition = response.headers.get('content-disposition');
                let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                let matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                  fileName = decodeURI(matches[1].replace(/['"]/g, ''));
                  // 处理特殊情况文件名称中包含utf-8
                  fileName = fileName.replace('utf-8', '');
                }
                // 开始下载
                // 组装a标签
                let elink = document.createElement('a');
                // 设置下载文件名
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(new Blob([blob], { type: blob.type }));
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href);
                document.body.removeChild(elink);
                Message.success('下载成功');
              })
              .catch(err => {
                Message.error('下载失败');
              });
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
      <UploadPolicyModal
        insureNum={insureNum}
        visible={showUploadPolicyModal}
        setModalVisible={setUploadPolicyModal}
        refreshData={getDataList}
        hideNotUploadPolicyModal={true}
      />
    </>
  );
});
