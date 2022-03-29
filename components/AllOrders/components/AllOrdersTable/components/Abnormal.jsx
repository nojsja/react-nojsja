import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { actions } from '../../pageActions/Abnormal';

const mapStateToProps = state => ({
  currentUser: state.employee.userInfo,
});
export default connect(mapStateToProps)(props => {
  const { rowData, currentUser, random } = props;

  let currentUserName = currentUser.workCode;
  let editUser = rowData.lockOperateNo;
  let editUserName = rowData.lockOperateName;

  const treatmentException = () => {
    actions[random].treatmentException(rowData);
  };

  return (
    <>
      {editUser ? (
        editUser === currentUserName ? (
          <a onClick={treatmentException}>
            <span style={{ color: 'red' }}>{editUserName}</span>正在处理异常
          </a>
        ) : (
          <span>
            <span style={{ color: 'red' }}>{editUserName}</span>正在处理异常
          </span>
        )
      ) : (
        <a onClick={treatmentException}>点击处理异常</a>
      )}
    </>
  );
});
