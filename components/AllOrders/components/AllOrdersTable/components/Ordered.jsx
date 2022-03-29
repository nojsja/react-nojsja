import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Divider, Message } from 'antd';
import { actions } from '../../pageActions/Ordered';

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  const { rowData, currentUser, random } = props;
  let currentUserName = currentUser.workCode;
  let editUser = rowData.lockOperateNo;
  let editUserName = rowData.lockOperateName;
  let editType = rowData.lockState;
  // 上传保单
  const uploadOriginal = () => {
    actions[random].uploadOriginal(rowData);
  };
  // 修改方法
  const modifyData = () => {
    actions[random].edit(rowData);
  };
  const downloadPolicy = () => {
    actions[random].downloadPolicy(rowData);
  };

  return (
    <>
      {editUser && editType === 1 ? (
        editUser === currentUserName ? (
          <a onClick={uploadOriginal}>
            <span style={{ color: 'red' }}>{editUserName}</span>正在上传保单
          </a>
        ) : (
          <span>
            <span style={{ color: 'red' }}>{editUserName}</span>正在上传保单
          </span>
        )
      ) : (
        <a onClick={uploadOriginal}>上传保单</a>
      )}
      <Divider type="vertical" />
      <a onClick={downloadPolicy}>下载保单</a>
      <Divider type="vertical" />
      {rowData.issueState !== 5 ? (
        editUser && editType === 2 ? (
          editUser === currentUserName ? (
            <a onClick={modifyData}>
              <span style={{ color: 'red' }}>{editUserName}</span>正在修改资料
            </a>
          ) : (
            <span>
              <span style={{ color: 'red' }}>{editUserName}</span>正在修改资料
            </span>
          )
        ) : (
          <a onClick={modifyData}>修改资料</a>
        )
      ) : null}
    </>
  );
});
