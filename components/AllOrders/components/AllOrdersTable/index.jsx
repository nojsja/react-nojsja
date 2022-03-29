import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Message, message } from 'antd';
import getColumns from './columns';

const mapStateToProps = state => ({
  selectInfo: state.common.selectInfo,
  permissionsConf: state.auth.conf,
});

export default connect(mapStateToProps)(props => {
  const {
    tableData,
    pagination,
    setPagination,
    setcurrentDataIndex,
    pageType,
    uploudPageType,
    getDataList,
    selectInfo,
    random,
    recycleData,
    permissionsConf,
  } = props;

  // 判断是否是第一次进入，如果是第一次进入则不请求接口,防止多次调用接口
  const [isFirst, setIsFirst] = useState(true);
  // 表格列项
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, setRowSelection] = useState(null);

  /* -------------- hooks -------------- */
  useEffect(() => {
    if (!isFirst && !pagination.isSetTheTotal) {
      getDataList();
    }
    setIsFirst(false);
  }, [pagination]);

  useEffect(() => {
    // 需要判断是否是管理员权限
    setRowSelection({
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
      },
    });
    // 设置列
    setColumns(
      getColumns({
        setcurrentDataIndex,
        pageType,
        uploudPageType,
        selectInfo,
        random,
      }),
    );
  }, [props]);
  // 分页切换事件
  const onChangeTable = paginationProps => {
    setPagination(pagination => ({ ...pagination, ...paginationProps, isSetTheTotal: false }));
  };

  const setTheRecycleData = () => {
    if (pageType == 'out' || pageType == 'upload' || pageType == 'correct') {
      if (permissionsConf.forceUnlockAuth) {
        return true;
      }
    }
    return false;
  };

  // 管理员权限数据回收
  const recycleDataFun = () => {
    if (selectedRows.length) {
      let selectArr = selectedRows
        .filter(el => el.lockState)
        .map(el => ({
          insureNum: el.insureNum,
          lockState: el.lockState,
        }));
      recycleData(selectArr, () => {
        setRowSelection(rowSelection => ({
          ...rowSelection,
          selectedRowKeys: [],
        }));
      });
    } else {
      Message.error('请勾选一条数据进行操作');
    }
  };

  return (
    <>
      <Table
        rowSelection={setTheRecycleData() ? rowSelection : false}
        columns={columns}
        dataSource={tableData}
        onChange={onChangeTable}
        pagination={pagination}
        scroll={{ x: 1500, y: 500 }}
        rowKey="id"
      />
      {/* 撤销单和退保单不显示回收数据 */}
      {setTheRecycleData() ? (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type="primary" onClick={recycleDataFun}>
            回收数据
          </Button>
        </div>
      ) : null}
    </>
  );
});
