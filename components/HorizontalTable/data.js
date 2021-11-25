import React from 'react';
import { Row, Col, Button } from 'antd';

export const insureInfoConf = {
  title: () => {
    return (
      <Row>
        <Col span={6}>保险信息</Col>
        <Col span={6}>上一张保单：123456</Col>
        <Col span={6}>支付状态(客户已确认)</Col>
        <Col span={6}>保险公司号码：12121212</Col>
      </Row>
    );
  },
  form: [
    {
      label: '发票抬头',
      dataIndex: 'invoice',
      key: 'invoice',
    },
    {
      label: '纳税人识别号',
      dataIndex: 'taxpayerIdentificationNumber',
      key: 'taxpayerIdentificationNumber',
    },
    {
      label: '承保公司',
      dataIndex: 'underwritingCompany',
      key: 'underwritingCompany',
      render: (value, data) => {
        return `${value.companyName}-${value.companyBranch}`;
      },
    },
    {
      label: '险种名称',
      dataIndex: 'insuranceName',
      key: 'insuranceName',
    },
    {
      label: '投保单号',
      dataIndex: 'insureNumber',
      key: 'insureNumber',
    },
    {
      label: '保单号码',
      dataIndex: 'policyNumber',
      key: 'prevInsureNumber',
    },
    {
      label: '被保险人',
      dataIndex: 'insuredName',
      key: 'insuredName',
    },
    {
      label: '被保险人类型',
      dataIndex: 'insuredType',
      key: 'insuredType',
    },
    {
      label: '提交日期',
      dataIndex: 'dateOfSubmission',
      key: 'dateOfSubmission',
    },
    {
      label: '支付日期',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
    },
  ],
};

export const insureGoodsConf = {
  title: '货物信息',
  form: [
    {
      label: '货物种类',
      dataIndex: 'goodsType',
      key: 'goodsType',
    },
    {
      label: '货物标记(MARKS & NOS)',
      dataIndex: 'goodsMark',
      key: 'goodsMark',
    },
    {
      label: '货物项目(DESCRIBE OF GOODS)',
      dataIndex: 'description',
      key: 'description',
    },
    {
      label: '包装及数量',
      dataIndex: 'packagingAndQuantity',
      key: 'packagingAndQuantity',
    },
    {
      label: '提单/运单号',
      dataIndex: 'waybillNumber',
      key: 'waybillNumber',
    },
    {
      label: '包装方式',
      dataIndex: 'packingType',
      key: 'packingType',
    },
    {
      label: '发票号(INVOICE NO)',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },

    {
      label: '发票金额',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      render: (value, data) => {
        return `${value} 汇率：${data.exchangeRate}`;
      },
    },

    {
      label: '合同号(CONTRACT NO)',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
    },
    {
      label: '加成率',
      dataIndex: 'blendingRate',
      key: 'blendingRate',
    },
    {
      label: '工作单号(WORK NO)',
      dataIndex: 'workNumber',
      key: 'workNumber',
    },

    {
      label: '加成后金额',
      dataIndex: 'blendingAmount',
      key: 'blendingAmount',
    },

    {
      label: '是否需要发票',
      dataIndex: 'billNeed',
      key: 'billNeed',
      render: value => {
        return value ? (
          '是'
        ) : (
          <>
            <span style={{ marginRight: '10px' }}>否</span>
            <Button size="small">凑票</Button>
          </>
        );
      },
    },
    {
      label: '总保险金额',
      dataIndex: 'totalInsureAmount',
      key: 'totalInsureAmount',
    },
    {
      label: '',
      dataIndex: '',
      key: 'empty1',
    },
    {
      label: '费用',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, data) => {
        return `${value} 费率：${data.costRate} 结算费率：${data.settlementRate}`;
      },
    },
  ],
};

export const insureInfo = {
  underwritingCompany: {
    companyName: '平安保险',
    companyBranch: '平安深圳分公司',
  },
  productName: '其它货物国内运输保险-综合险',
  insureNumber: '205111111122323',
  policyNumber: '22',
  insuredName: '王五',
  insuredType: '企业',
  submitDate: '2020-05-19',
  payDate: '2020-05-20',
};

export const goodsInfo = {
  goodsType: '其它类',
  goodsMark: '标记1',
  description: '描述1',
  packagingAndQuantity: '已包装好，3个总共',
  waybillNumber: '123456789',
  packingType: '托盘',
  invoiceNumber: '1112',
  invoiceAmount: '123435 RMB',
  exchangeRate: 5,
  contractNumber: '123456789',
  blendingRate: '10%',
  workNumber: '123456789',
  blendingAmount: '157435 RMB',
  billNeed: true,
  totalInsureAmount: '1574354443 RMB',
  amount: '15743 RMB',
  costRate: 0.0003,
  settlementRate: 0.0001,
};