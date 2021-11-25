import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Divider, Form } from 'antd';

import getColumns, { keys } from './components/columns';

export const editValues = {};

// 多模式keys配置
const fullKeys = [
  'transportType',
  'transportTool',
  'acceptInsurance',
  'insureFeeRate',
  'minInsureFee',
  'settlementFeeRate',
  'insureType',
];

// 操作项
const getOperations = options => ({
  view: [
    {
      key: 'edit',
      title: '编辑',
      onClick: options.onEditClick,
    },
  ],
  edit: [
    {
      key: 'save',
      title: '保存',
      onClick: options.onSaveClick,
    },
    {
      key: 'edit',
      title: '取消',
      onClick: options.onCancelClick,
    },
  ],
});

export default function EditableTable(props) {
  let {
    form,
  } = props;
  const {
    value,
    setListModalVisible,
    disabled,
    templateData = [],
  } = props;
  const [tableData, setTableData] = useState(value);
  const [editMap, setEditMap] = useState({});
  const [columns, setColumns] = useState([]);
  const [transportType, setTransportType] = useState(1);
  form = form || Form.useForm()[0];

  /* hooks */

  // 组件挂载后获取初始模板数据
  useEffect(() => {
    if (value && value.length) {
      onChange(value);
    }
  }, []);

  // 编辑状态改变时重新渲染表格列表
  useEffect(() => {
    setColumns(
      getColumns({
        rows: fullKeys,
        onTableChange,
        operation,
        editMap,
        disabled,
      }),
    );
  }, [editMap, disabled]);

  useEffect(() => {
    const productFeeDetails = value && value.length ? value : [];
    if (templateData.length && transportType !== '-1') {
      const data = getTableData(productFeeDetails, templateData, transportType);
      setTableData(data);
    }
  }, [value, templateData, transportType]);

  /* handlers */
  
  // 根据模板数据和当前数据生成表格数据
  const getTableData = (productFeeDetails, costRate) => {

    let id1, id2;
    productFeeDetails.forEach(pr => {
      id1 = `${transportType}_${pr.transportWay}_${pr.transportTool}`;
      costRate.forEach(co => {
        id2 = `${transportType}_${co.transportTypeId}_${co.transportToolId}`;
        console.log(id1, id2);
        if (id2 === id1) {
          co.minInsureFee = pr.minInsureFee;
          co.insureFeeRate = pr.insureFeeRate;
          co.settlementFeeRate = pr.settlementFeeRate;
          co.insureType = pr.insureType;
          co.acceptInsurance = pr.acceptInsurance;
          co.id = id2;
        }
      });
    });

    return costRate;
  };

  // 存储编辑值
  const saveEdit = id => {
    onChange(
      tableData.map(table => {
        if (table.id === id) {
          if (editMap[id]) {
            return {
              ...table,
              ...(editValues[id] || {}),
            };
          } else {
            return table;
          }
        }
        return table;
      }),
    );
    delete editValues[id];
    setEditMap({
      ...editMap,
      [id]: null,
    });
    // form.resetFields(keys.map(key => `${key}_${id}`));
  };

  // 回调设置Form.Item数据
  const onChange = value => {
    console.log('onChange', value);
    setTableData(value);
    if (props.onChange) {
      props.onChange(value);
    }
  };

  // 进入编辑模式
  const setEdit = id => {
    editValues[id] = tableData.find(item => item.id === id);
    setEditMap({
      ...editMap,
      [id]: true,
    });
  };

  // 取消编辑
  const cancelEdit = id => {
    setEditMap({
      ...editMap,
      [id]: null,
    });

    form.resetFields(keys.map(key => `${key}_${id}`));
  };

  // 表格字段同步更新
  const onTableChange = (attr, value, data) => {
    if (editMap[data.id]) {
      editValues[data.id] = {
        ...(editValues[data.id] || {}),
        [attr]: value,
      };
    }
  };

  // 操作
  const operation = getOperations({
    onEditClick: data => {
      setEdit(data.id);
    },
    onSaveClick: data => {
      saveEdit(data.id);
    },
    onCancelClick: data => {
      delete editValues[data.id];
      cancelEdit(data.id);
    },
  });

  return (
    <div>
      <Form form={form}>
        <Table columns={columns} dataSource={tableData} pagination={false} />
      </Form>
    </div>
  );
}
