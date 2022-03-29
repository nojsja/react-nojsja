import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Divider, Message } from 'antd';
import { actions } from '../../pageActions/Correct';

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  const { rowData, currentUser, random } = props;
  let currentUserName = currentUser.workCode;
  let editUser = rowData.lockOperateNo;
  let editUserName = rowData.lockOperateName;
  let editType = rowData.lockState;
  // 批单
  const original = () => {
    actions[random].original(rowData);
  };
  // 修改方法
  const modifyData = () => {
    actions[random].edit(rowData);
  };

  return (
    <>
      {editUser && editType === 3 ? (
        editUser === currentUserName ? (
          <a onClick={original}>
            <span style={{ color: 'red' }}>{editUserName}</span>正在批单
          </a>
        ) : (
          <span>
            <span style={{ color: 'red' }}>{editUserName}</span>正在批单
          </span>
        )
      ) : rowData.companyProcessState === 1 ? null : (
        <a onClick={original}>点击开始批单</a>
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
