import React from 'react';
import { getInsureStateName, formatMoney, getOrderStatus } from '@/utils/utils';
import pageTableColumns from './columns.conf';
import getPageTableColumnAction from './actions.conf';

export default props => {
  const { setcurrentDataIndex, pageType, uploudPageType, selectInfo, random } = props;
  const columns = {
    insureNum: {
      title: '投保单号',
      key: 'insureNum',
      dataIndex: 'insureNum',
      render: (value, data) => {
        return (
          <a
            onClick={() => {
              setcurrentDataIndex({
                id: data.insureNum,
                action: 'detail',
                isOrdered: data.issueState === 3,
              });
            }}
          >
            {value}
          </a>
        );
      },
    },
    companyPolicyNum1: {
      title: '保单号',
      key: 'companyPolicyNum1',
      dataIndex: 'companyPolicyNum',
    },
    partnerId: {
      title: '会员ID',
      key: 'partnerId',
      dataIndex: 'partnerId',
    },
    insurantName: {
      title: '被保险人',
      key: 'insurantName',
      dataIndex: 'insurantName',
    },
    psCompanyName: {
      title: '承保公司',
      key: 'psCompanyName',
      dataIndex: 'psCompanyName',
      render: (value, data) => {
        let arr = [value, data.psBranchName];
        return arr.join('-');
      },
    },
    companyPolicyNum2: {
      title: '保险公司号码',
      key: 'companyPolicyNum2',
      dataIndex: 'companyPolicyNum',
    },
    transportType: {
      title: '运输类型',
      key: 'transportType',
      dataIndex: 'transportType',
      render: value => {
        let item = selectInfo.transportType.find(el => el.code == value);
        if (item) {
          return item.name;
        }
        return value;
      },
    },
    invoiceMoney: {
      title: '保险金额',
      key: 'invoiceMoney',
      render: data => {
        let item = selectInfo.currencyTypeListOfAll.find(el => el.code == data.currencyType);
        if (item) {
          return formatMoney({ number: data.invoiceMoney, symbol: item.symbol });
        }
        return formatMoney({ number: data.invoiceMoney, symbol: '' });
      },
    },
    insureAmount: {
      title: '总保险金额',
      key: 'insureAmountRmb',
      dataIndex: 'insureAmountRmb',
      render: value => {
        return formatMoney({ number: value });
      },
    },
    exceptionComment: {
      title: '异常原因',
      key: 'exceptionComment',
      dataIndex: 'exceptionComment',
    },
    exceptionOperatorName: {
      title: '移入人员',
      key: 'exceptionOperatorName',
      dataIndex: 'exceptionOperatorName',
    },
    exceptionTime: {
      title: '移入时间',
      key: 'exceptionTime',
      dataIndex: 'exceptionTime',
    },

    insureFee: {
      title: '费用',
      key: 'insureFee',
      dataIndex: 'insureFee',
      render: value => {
        return formatMoney({ number: value });
      },
    },
    goodsBillNo: {
      title: '运单提单号',
      key: 'goodsBillNo',
      dataIndex: 'goodsBillNo',
    },
    withdrawOperatorName: {
      title: '撤销人员',
      key: 'withdrawOperatorName',
      dataIndex: 'withdrawOperatorName',
    },
    withdrawTime: {
      title: '撤销时间',
      key: 'withdrawTime',
      dataIndex: 'withdrawTime',
    },
    withdrawComment: {
      title: '撤销原因',
      key: 'withdrawComment',
      dataIndex: 'withdrawComment',
    },
    goodsType: {
      title: '货物种类',
      key: 'goodsType',
      dataIndex: 'goodsType',
      render: value => {
        let item = selectInfo.cargoCategory.find(el => el.code == value);
        if (item) {
          return item.name;
        }
        return value;
      },
    },
    recordNotUploadReason: {
      title: '未上传原因',
      key: 'recordNotUploadReason',
      dataIndex: 'recordNotUploadReason',
      render: value => {
        let item = selectInfo.notUploadReason.find(el => el.code == value);
        if (item) {
          return item.name;
        }
        return value;
      },
    },
    recordComment: {
      title: '备注',
      key: 'recordComment',
      dataIndex: 'recordComment',
    },
    operateDesc: {
      title: '订单日志',
      key: 'operateDesc',
      dataIndex: 'operateDesc',
    },
    lockOperateName: {
      title: '出单人员',
      key: 'lockOperateName',
      dataIndex: 'lockOperateName',
    },

    createTime: {
      title: '投保时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    issueState1: {
      title: '支付状态',
      key: 'issueState1',
      dataIndex: 'issueState',
      render: value => {
        return value ? '已支付' : '待支付';
      },
    },
    orderStatus: {
      title: '保单状态',
      key: 'orderStatus',
      render: data => {
        return getOrderStatus(data, pageType);
      },
    },

    issueType: {
      title: '保单类型',
      key: 'issueType',
      dataIndex: 'adjustState',
      render: value => {
        return value ? '变更单' : '投保单';
      },
    },
    companyProcessState: {
      title: '对接状态',
      key: 'companyProcessState',
      dataIndex: 'companyProcessState',
      render: value => {
        let item = selectInfo.companyProcessState.find(el => el.code == value);
        if (item) {
          return item.name;
        }
        return value;
      },
    },
    // operation: {
    //   title: '操作',
    //   width: 200,
    //   fixed: 'right',
    //   key: 'operation',
    //   render: data => {
    //     return (
    //       <>
    //         {data.operation.map((item, i) => (
    //           <span key={item.id}>
    //             <a
    //               onClick={() =>
    //                 setcurrentDataIndex({
    //                   id: data.id,
    //                   action: item.name,
    //                 })
    //               }
    //             >
    //               {item.lable}
    //             </a>
    //             {i !== data.operation.length - 1 && <Divider type="vertical" />}
    //           </span>
    //         ))}
    //       </>
    //     );
    //   },
    // },
  };
  const columnsConf = Object.keys(columns).map(item => columns[item]);
  const newColumnsConf = [];
  let pageColumnsConf = pageTableColumns[pageType];
  pageColumnsConf.forEach(th => {
    let el = columnsConf.find(sub => th === sub.title);
    newColumnsConf.push(el);
  });
  let operation = getPageTableColumnAction(pageType, uploudPageType, setcurrentDataIndex, random);
  if (operation) {
    newColumnsConf.push(operation);
  }

  return newColumnsConf;
};
