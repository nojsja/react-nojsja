import React from 'react';
import { Divider, Checkbox, InputNumber, Form, Input } from 'antd';
import { costRateReg, positiveReg, illegalCharReg, quillEmptyReg } from '@/utils/validator';

import QuiiEditorWraper from '@/components/QuillEditorWrapper';
import { computeValues } from '../index';

export default props => {
  const { onTableChange, setAllChecked, allChecked, disabled, rows = keys } = props;

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
        const now = computeValues.value ? computeValues.value[data.id] : false;
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
                  const now = computeValues.value ? computeValues.value[data.id] : false;
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
    settlementFeeRate: {
      title: '结算费率',
      dataIndex: 'settlementFeeRate',
      key: 'settlementFeeRate',
      render: (value, data) => (
        <Form.Item
          name={`settlementFeeRate_${data.id}`}
          validateFirst={true}
          rules={[
            { pattern: costRateReg, message: '结算费率值为十万分之一到1之间的数' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const now = computeValues.value ? computeValues.value[data.id] : false;
                if (now && now.acceptInsurance) {
                  if (!now.settlementFeeRate) {
                    return Promise.reject(new Error('请输入结算费率'));
                  }
                  if (!costRateReg.test(now.settlementFeeRate)) {
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
    cost: {
      title: '费用',
      dataIndex: 'cost',
      key: 'cost',
      render: (value, data) => (
        <Form.Item
          name={`cost_${data.id}`}
          validateFirst={true}
          rules={[
            { pattern: positiveReg, message: '费用值为正数' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const now = computeValues.value ? computeValues.value[data.id] : false;
                if (now && now.acceptInsurance) {
                  if (!now.cost) {
                    return Promise.reject(new Error('请输入费用'));
                  }
                  if (!positiveReg.test(computeValues.value[data.id].cost)) {
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
              onChange={value => onTableChange('cost', value, data)}
            />
          ) : (
            <span>{data.cost}</span>
          )}
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
                  const now = computeValues.value ? computeValues.value[data.id] : false;
                  if (now && now.acceptInsurance) {
                    if (!now.insureType) {
                      return Promise.reject(new Error('请输入险别'));
                    }
                    if (!illegalCharReg.test(now.insureType)) {
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
    payFree: {
      title: '免赔',
      dataIndex: 'payFree',
      key: 'payFree',
      render: (value, data) => {
        return (
          <Form.Item
            name={`payFree_${data.id}`}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const now = computeValues.value ? computeValues.value[data.id] : false;
                  if (now && now.acceptInsurance) {
                    if (!now.payFree) {
                      return Promise.reject(new Error('请输入免赔政策'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            {!disabled ? (
              <QuiiEditorWraper
                disabled={false}
                onChange={value => onTableChange('payFree', value, data)}
                value={data.payFree}
              />
            ) : (
              <QuiiEditorWraper
                disabled={true}
                onChange={value => onTableChange('payFree', value, data)}
                value={data.payFree}
              />
            )}
          </Form.Item>
        );
      },
    },
    specialAgreement: {
      title: '特别约定',
      dataIndex: 'specialAgreement',
      key: 'specialAgreement',
      render: (value, data) => {
        return (
          <Form.Item
            name={`specialAgreement_${data.id}`}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const now = computeValues.value ? computeValues.value[data.id] : false;
                  if (now && now.acceptInsurance) {
                    if (!now.specialAgreement) {
                      return Promise.reject(new Error('请输入特别约定'));
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            {!disabled ? (
              <QuiiEditorWraper
                disabled={false}
                onChange={value => onTableChange('specialAgreement', value, data)}
                value={data.specialAgreement}
              />
            ) : (
              <QuiiEditorWraper
                disabled={true}
                onChange={value => onTableChange('specialAgreement', value, data)}
                value={data.specialAgreement}
              />
            )}
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
  'settlementFeeRate',
  'insureType',
];
