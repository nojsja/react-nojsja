import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Divider, Message } from 'antd';
import { actions } from '../../pageActions/Out';

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  const { rowData, currentUser, random } = props;
  let currentUserName = currentUser.workCode;
  let editUser = rowData.lockOperateNo;
  let editUserName = rowData.lockOperateName;
  let editType = rowData.lockState;
  // 出正本
  const original = () => {
    actions[random].original(rowData);
  };
  // 修改方法
  const modifyData = () => {
    actions[random].edit(rowData);
  };

  return (
    <>
      {editUser && editType === 1 ? (
        editUser === currentUserName ? (
          <a onClick={original}>
            <span style={{ color: 'red' }}>{editUserName}</span>正在出正本
          </a>
        ) : (
          <span>
            <span style={{ color: 'red' }}>{editUserName}</span>正在出正本
          </span>
        )
      ) : rowData.companyProcessState === 1 ? null : (
        <a onClick={original}>点击出正本</a>
      )}
      {rowData.companyProcessState === 1 ? null : <Divider type="vertical" />}
      {editUser && editType === 2 ? (
        editUser === currentUserName ? (
          <a onClick={modifyData}>
            <span style={{ color: 'red' }}>{editUserName}</span>正在修改资料
          </a>
        ) : (
          <span>
            <span style={{ color: 'red' }}>{editUserName}</span>正在修改资料
          </span>
        )
      ) : rowData.companyProcessState === 1 ? null : (
        <a onClick={modifyData}>修改资料</a>
      )}
    </>
  );
});
