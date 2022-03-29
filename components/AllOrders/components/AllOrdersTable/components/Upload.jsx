import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Divider, Message } from 'antd';
import { actions } from '../../pageActions/Upload';

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
  // 异常单
  const abnormalSingle = () => {
    actions[random].abnormalSingle(rowData);
  };
  // 新增日志
  const newLog = () => {
    actions[random].newLog(rowData);
  };

  return (
    <>
      {editUser && editType === 1 ? (
        editUser === currentUserName ? (
          <a onClick={original}>
            <span style={{ color: 'red' }}>{editUserName}</span>正在上传正本
          </a>
        ) : (
          <span>
            <span style={{ color: 'red' }}>{editUserName}</span>正在上传正本
          </span>
        )
      ) : (
        <a onClick={original}>上传正本</a>
      )}
      <Divider type="vertical" />
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
      ) : (
        <a onClick={modifyData}>修改资料</a>
      )}
      <Divider type="vertical" />
      {editUser && editType === 4 ? (
        editUser === currentUserName ? (
          <a onClick={abnormalSingle}>
            <span style={{ color: 'red' }}>{editUserName}</span>正在打入异常单
          </a>
        ) : (
          <span>
            <span style={{ color: 'red' }}>{editUserName}</span>正在打入异常单
          </span>
        )
      ) : (
        <a onClick={abnormalSingle}>异常单</a>
      )}
      <Divider type="vertical" />
      <a onClick={newLog}>新增日志</a>
    </>
  );
});
