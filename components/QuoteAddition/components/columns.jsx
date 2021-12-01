import React from 'react';
import { Divider, Checkbox, InputNumber, Form, Input } from 'antd';
import { costRateReg, positiveReg, illegalCharReg, quillEmptyReg } from '@/utils/validator';

import QuiiEditorWraper from '@/components/QuillEditorWrapper';
import { computeValues } from '../index';

export default props => {
  const { onTableChange, setAllChecked, allChecked, disabled, rows = keys, id } = props;

  const columns = {
    acceptInsurance: {
      title: data => {
        return (
          <Checkbox
            disabled={disabled}
            onChange={e => setAllChecked(e.target.checked)}
            defaultChecked={allChecked}
          >
            选择
          </Checkbox>
        );
      },
      dataIndex: 'acceptInsurance',
      key: 'acceptInsurance',
      render: (value, data) => {
        const now = computeValues.get(id) ? computeValues.get(id)[data.id] : false;
        return (
          <Form.Item name={`acceptInsurance_${data.id}`}>
            {!disabled ? (
              <Checkbox
                onChange={e => onTableChange('acceptInsurance', e.target.checked, data)}
                defaultChecked={now ? now.acceptInsurance : value}
              />
            ) : (
              <Checkbox disabled={true} defaultChecked={now ? now.acceptInsurance : value} />
            )}
          </Form.Item>
        );
      },
    },
    company: {
      title: '保险公司',
      dataIndex: 'company',
      key: 'company',
      render: (text, record) => {
        return <Form.Item>{text}</Form.Item>;
      },
    },
    insureFeeRate: {
      title: '费率',
      dataIndex: 'insureFeeRate',
      key: 'insureFeeRate',
      render: (value, data) => {
        return (
          <Form.Item
            name={`insureFeeRate_${data.id}`}
            rules={[
              { pattern: costRateReg, message: '承保费率值为十万分之一到1之间的数' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const now = computeValues.get(id) ? computeValues.get(id)[data.id] : false;
                  console.log('validator');
                  if (now && now.acceptInsurance) {
                    if (!now.insureFeeRate) {
                      return Promise.reject(new Error('请输入承保费率'));
                    }
                    if (!costRateReg.test(now.insureFeeRate)) {
                      return Promise.reject(new Error('承保费率值为十万分之一到1之间的数'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            {!disabled ? (
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
    settlementRate: {
      title: '结算费率',
      dataIndex: 'settlementRate',
      key: 'settlementRate',
      render: (value, data) => (
        <Form.Item
          name={`settlementRate_${data.id}`}
          validateFirst={true}
          rules={[
            { pattern: costRateReg, message: '结算费率值为十万分之一到1之间的数' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const now = computeValues.get(id) ? computeValues.get(id)[data.id] : false;
                if (now && now.acceptInsurance) {
                  if (!now.settlementRate) {
                    return Promise.reject(new Error('请输入结算费率'));
                  }
                  if (!costRateReg.test(now.settlementRate)) {
                    return Promise.reject(new Error('结算费率值为十万分之一到1之间的数'));
                  }
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          {!disabled ? (
            <InputNumber
              step={0.01}
              disabled={disabled}
              onChange={value => onTableChange('settlementRate', value, data)}
              defaultValue={value}
            />
          ) : (
            <span>{data.settlementRate}</span>
          )}
          {/* {data.underwritting ? (
          ) : null} */}
        </Form.Item>
      ),
    },
    assessAmount: {
      title: '费用',
      dataIndex: 'assessAmount',
      key: 'assessAmount',
      render: (value, data) => (
        <Form.Item
          name={`assessAmount_${data.id}`}
          validateFirst={true}
          rules={[
            { pattern: positiveReg, message: '费用值为正数' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const now = computeValues.get(id) ? computeValues.get(id)[data.id] : false;
                if (now && now.acceptInsurance) {
                  if (!now.assessAmount) {
                    return Promise.reject(new Error('请输入费用'));
                  }
                  if (!positiveReg.test(computeValues.get(id)[data.id].assessAmount)) {
                    return Promise.reject(new Error('费用值为正数'));
                  }
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          {!disabled ? (
            <InputNumber
              step={10}
              disabled={disabled}
              defaultValue={value}
              addonAfter="RMB"
              onChange={value => onTableChange('assessAmount', value, data)}
            />
          ) : (
            <span>{data.assessAmount}</span>
          )}
        </Form.Item>
      ),
    },
    policyType: {
      title: '险别',
      dataIndex: 'policyType',
      key: 'policyType',
      render: (value, data) => {
        return (
          <Form.Item
            name={`policyType_${data.id}`}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const now = computeValues.get(id) ? computeValues.get(id)[data.id] : false;
                  if (now && now.acceptInsurance) {
                    if (!now.policyType) {
                      return Promise.reject(new Error('请输入险别'));
                    }
                    if (!illegalCharReg.test(now.policyType)) {
                      return Promise.reject(new Error('存在非法字符'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            {!disabled ? (
              <Input
                disabled={disabled}
                onChange={e => onTableChange('policyType', e.target.value, data)}
                defaultValue={data.policyType}
              />
            ) : (
              <span>{data.policyType}</span>
            )}
          </Form.Item>
        );
      },
    },
    freeCompe: {
      title: '免赔',
      dataIndex: 'freeCompe',
      key: 'freeCompe',
      render: (value, data) => {
        return (
          <Form.Item
            name={`freeCompe_${data.id}`}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const now = computeValues.get(id) ? computeValues.get(id)[data.id] : false;
                  if (now && now.acceptInsurance) {
                    if (!now.freeCompe) {
                      return Promise.reject(new Error('请输入免赔政策'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <QuiiEditorWraper
              disabled={disabled}
              onChange={value => onTableChange('freeCompe', value, data)}
              defaultValue={data.freeCompe}
            />
          </Form.Item>
        );
      },
    },
    convention: {
      title: '特别约定',
      dataIndex: 'convention',
      key: 'convention',
      render: (value, data) => {
        return (
          <Form.Item
            name={`convention_${data.id}`}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const now = computeValues.get(id) ? computeValues.get(id)[data.id] : false;
                  if (now && now.acceptInsurance) {
                    if (!now.convention) {
                      return Promise.reject(new Error('请输入特别约定'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <QuiiEditorWraper
              disabled={disabled}
              onChange={value => onTableChange('convention', value, data)}
              defaultValue={data.freeCompe}
            />
          </Form.Item>
        );
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
  'settlementRate',
  'policyType',
];
