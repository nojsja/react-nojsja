import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { actions } from '../../pageActions/Pay';

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  const { rowData, currentUser, random } = props;

  // 模拟当前用户
  let currentUserName = currentUser.workCode;
  let editUser = rowData.lockOperateNo;
  let editUserName = rowData.lockOperateName;
  let lockState = rowData.lockState;

  // 修改方法
  const modifyData = () => {
    actions[random].edit(rowData);
  };

  return (
    <>
      {lockState ? (
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
    </>
  );
});
