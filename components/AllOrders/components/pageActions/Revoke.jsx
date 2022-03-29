import React, { useEffect } from 'react';
import { Message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
const { confirm } = Modal;
export const actions = {};

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  let { dispatch, currentUser, getDataList, random } = props;

  useEffect(() => {
    if (!actions[random]) {
      let obj = {
        [random]: {
          recoveryPolicy: rowData => {
            confirm({
              title: '确认恢复该保单吗?',
              icon: <ExclamationCircleOutlined />,
              okType: 'primary',
              onOk() {
                if (dispatch) {
                  dispatch({
                    type: 'order/withdrawRecover',
                    payload: {
                      insureNum: rowData.insureNum,
                    },
                    callback: res => {
                      if (res.code === 200) {
                        Message.info('操作成功');
                        // 刷新数据
                        if (getDataList) {
                          getDataList();
                        }
                      } else {
                        Message.error(res.msg);
                      }
                    },
                  });
                }
              },
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

  return <></>;
});
