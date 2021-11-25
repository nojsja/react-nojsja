import React from 'react';
import { Divider, Checkbox, InputNumber, Form, Input } from 'antd';
import { costRateReg, positiveReg, illegalCharReg } from 'utils/validator';

import { editValues } from '../index';

export default props => {
  const {
    onTableChange, operation,
    editMap, disabled,
    rows = keys, setAllChecked,
    allChecked
  } = props;

  const columns = {
    transportType: {
      title: '运输方式',
      key: 'transportType',
      dataIndex: 'transportType',
      render: (text, record) => {
        return <Form.Item>{text}</Form.Item>;
      },
    },
    transportTool: {
      title: '运输工具',
      dataIndex: 'transportTool',
      key: 'transportTool',
      render: (text, record) => {
        return <Form.Item>{text}</Form.Item>;
      },
    },
    acceptInsurance: {
      title: '是否承保',
      dataIndex: 'acceptInsurance',
      key: 'acceptInsurance',
      render: (value, data) => {
        return (
          <Form.Item name={`acceptInsurance_${data.id}`}>
            {editMap[data.id] ? (
              <Checkbox
                disabled={disabled}
                onChange={e => onTableChange('acceptInsurance', e.target.checked, data)}
                defaultChecked={value}
              />
            ) : (
              <Checkbox disabled={true} defaultChecked={value} />
            )}
          </Form.Item>
        );
      },
    },
    insureFeeRate: {
      title: '承保费率',
      dataIndex: 'insureFeeRate',
      key: 'insureFeeRate',
      render: (value, data) => {
        return (
          <Form.Item
            name={`insureFeeRate_${data.id}`}
            rules={[{ pattern: costRateReg, message: '承保费率值为十万分之一到1之间的数' }]}
          >
            {editMap[data.id] ? (
              <InputNumber
                step={0.01}
                disabled={disabled}
                onChange={value => onTableChange('insureFeeRate', value, data)}
                defaultValue={value}
              />
            ) : (
              <span>{data.insureFeeRate}</span>
            )}
            {/* {data.underwritting ? (
            ) : null} */}
          </Form.Item>
        );
      },
    },
    minInsureFee: {
      title: '最低费用',
      dataIndex: 'minInsureFee',
      key: 'minInsureFee',
      render: (value, data) => (
        <Form.Item
          name={`minInsureFee_${data.id}`}
          rules={[{ pattern: positiveReg, message: '最低费用值为正数' }]}
        >
          {editMap[data.id] ? (
            <InputNumber
              step={10}
              disabled={disabled}
              defaultValue={value}
              onChange={value => onTableChange('minInsureFee', value, data)}
            />
          ) : (
            <span>{data.minInsureFee}</span>
          )}
          {/* {data.underwritting ? (
          ) : null} */}
        </Form.Item>
      ),
    },
    settlementFeeRate: {
      title: '结算费率',
      dataIndex: 'settlementFeeRate',
      key: 'settlementFeeRate',
      render: (value, data) => (
        <Form.Item
          name={`settlementFeeRate_${data.id}`}
          rules={[{ pattern: costRateReg, message: '结算费率值为十万分之一到1之间的数' }]}
        >
          {editMap[data.id] ? (
            <InputNumber
              step={0.01}
              disabled={disabled}
              onChange={value => onTableChange('settlementFeeRate', value, data)}
              defaultValue={value}
            />
          ) : (
            <span>{data.settlementFeeRate}</span>
          )}
          {/* {data.underwritting ? (
          ) : null} */}
        </Form.Item>
      ),
    },
    insureType: {
      title: '险别',
      dataIndex: 'insureType',
      key: 'insureType',
      render: (value, data) => {
        return (
          <Form.Item
            name={`insureType_${data.id}`}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (editValues[data.id] && editValues[data.id].acceptInsurance) {
                    if (!editValues[data.id].insureType) {
                      return Promise.reject(new Error('请输入险别'));
                    }
                    if (!illegalCharReg.test(editValues[data.id].insureType)) {
                      return Promise.reject(new Error('存在非法字符'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            {editMap[data.id] ? (
              <Input
                disabled={disabled}
                onChange={e => onTableChange('insureType', e.target.value, data)}
                defaultValue={data.insureType}
              />
            ) : (
              <span>{data.insureType}</span>
            )}
          </Form.Item>
        );
      },
    },
    operation: {
      title: '操作',
      width: 200,
      fixed: 'right',
      key: 'operation',
      render: data => {
        const action = editMap[data.id] ? 'edit' : 'view';
        return (operation[action] || []).map((item, i) => (
          <a key={item.id} onClick={() => item.onClick(data)}>
            <span>
              {item.title}
              {i !== operation[action].length - 1 && <Divider type="vertical" />}
            </span>
          </a>
        ));
      },
    },
  };

  return Object.keys(columns)
    .filter(key => {
      const accessable = rows.includes(key);

      if (key === 'operation') {
        return !disabled;
      }

      return accessable;
    })
    .map(item => columns[item]);
};

export const keys = [
  'acceptInsurance',
  'insureFeeRate',
  'minInsureFee',
  'settlementFeeRate',
  'insureType',
];
