import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { actions } from '../../pageActions/Revoke';

const mapStateToProps = state => ({});
export default connect(mapStateToProps)(props => {
  const { rowData, random } = props;
  // 恢复保单
  const recoveryPolicy = () => {
    actions[random].recoveryPolicy(rowData);
  };
  useEffect(() => {}, [rowData]);

  return (
    <>
      <a onClick={recoveryPolicy}>恢复保单</a>
    </>
  );
});
