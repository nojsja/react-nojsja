import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Spin, Message, Form, Modal, Tabs } from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import request from 'umi-request';
import { apiUrl } from '@/services/apiUrl';

import EventEmitter from '@/utils/event-emitter';
import AllOrdersTable from './components/AllOrdersTable';
import FragmentHeader from '@/components/FragmentHeader';

// 注册各类型保单actions
import Pay from './components/pageActions/Pay';
import Out from './components/pageActions/Out';
import Upload from './components/pageActions/Upload';
import Ordered from './components/pageActions/Ordered';
import Correct from './components/pageActions/Correct';
import Revoke from './components/pageActions/Revoke';
import Abnormal from './components/pageActions/Abnormal';

const { confirm } = Modal;
const { TabPane } = Tabs;
/* 头部搜索表单配置 */
import getSearchHeaders from './form.config';
import pageFormConfOption from './pageFormOption.conf';
import { getRandomString } from '@/utils/utils';

const mapStateToProps = state => ({
  myCustomerAuth: state.auth.conf.myCustomerAuth,
  orderList: state.order.orderList,
  selectInfo: state.common.selectInfo,
});
export default connect(mapStateToProps)(props => {
  const { dispatch, location, myCustomerAuth, selectInfo, orderList } = props;
  // 当前页面类型
  const pageType = location.pathname.split('/').pop();
  const tableData = orderList[pageType];

  const [random] = useState(getRandomString());

  // 加载动画
  const [loading, setLoading] = useState(false);
  // 表格分页器
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: total => `共 ${total} 条`,
    pageSizeOptions: [10, 20, 30, 40, 50, 100],
    showQuickJumper: true,
  });
  // 当前Tab页序号
  const [currentDataIndex, setcurrentDataIndex] = useState({ action: '', id: '' });
  // 搜索头部ref
  const [formRef] = Form.useForm();
  // 目前选中的保司
  const [company, setCompany] = useState('');
  // 待上传页tab切换状态
  const uploudPageType = useRef('1');

  const formConfOptins = {
    companyNameList: [], // 保险公司
    companyBranchList: [], // 分支机构
    transportionCategoryList: [], // 运输类型
    recordNotUploadReasonList: [], // 未上传原因
    cargoCategoryList: [], //货物种类
    companyProcessStateList: [], // 对接状态
    clickEvent: {
      search: () => {
        // 搜索条件改变分页重置为1
        setPagination(pagination => ({
          ...pagination,
          current: 1,
          isSetTheTotal: false,
        }));
      },
      clear: () => {
        formRef.resetFields();
        setCompany('');
        // 搜索条件改变分页重置为1
        setPagination(pagination => ({
          ...pagination,
          current: 1,
          isSetTheTotal: false,
        }));
      },
      export: () => {
        console.log('导出');
        // 只有全部订单和已出单有导出功能，通过pageType来区分
        exportExlFun();
      },
    },
  };
  // 搜索头部表单配置
  const [formConf, setFormConf] = useState([]);

  /* -------------- hooks -------------- */
  // 权限检测
  useEffect(() => {
    if (!myCustomerAuth) {
      router.push('/welcome');
      setTimeout(() => {
        EventEmitter.emit(`${location.pathname}close`);
      }, 500);
    }
  }, [myCustomerAuth]);
  // 监听数据字典数据发生变化给头部搜索条件赋值
  useEffect(() => {
    setSearchHeaderData();
  }, [selectInfo]);
  // 监听保险公司的值变化联动分支机构的值进行变化
  useEffect(() => {
    // 如果分支机构有值这里清空
    if (formRef.getFieldValue('psBranchId')) {
      // 下面两种方式清空值都可
      // formRef.resetFields(['psBranchId']);
      formRef.setFieldsValue({
        psBranchId: undefined,
      });
    }
    setSearchHeaderData();
  }, [company]);
  // mounted
  useEffect(() => {
    getDataList();
    EventEmitter.on('orderListEmitter', () => {
      // 通知刷新数据
      getDataList();
    });
    return () => {
      EventEmitter.remove('orderListEmitter');
    };
  }, []);

  /* -------------- functions -------------- */
  // 获取列表数据
  const getDataList = () => {
    let params = getTheQueryParams();
    selectTableData({
      data: {
        ...params,
      },
      page: pagination.current,
      size: pagination.pageSize,
    });
  };
  const getTheQueryParams = () => {
    let search = formRef.getFieldsValue(true);
    // 处理传参
    let keyword = search.keyword
      ? {
          keyword: undefined,
          [search.keyword.type]: search.keyword.value || undefined,
        }
      : { keyword: undefined };
    let transportation = search.transportation
      ? {
          transportation: undefined,
          [search.transportation.type]: search.transportation.value || undefined,
        }
      : { transportation: undefined };
    let createTime = setTheTimeArr(search, 'createTime');
    let exceptionTime = setTheTimeArr(search, 'exceptionTime');
    let payTime = setTheTimeArr(search, 'payTime');
    let params = {
      ...search,
      ...keyword,
      ...transportation,
      ...createTime,
      ...exceptionTime,
      ...payTime,
      // issueState：0-待支付 1-待出单 2-待上传 3-已出单 4-退保单 5-批改单 6-撤销单 7-异常单 ,
      issueState: getIssueState(),
    };
    // 处理审核超时tab
    if (pageType === 'upload' && uploudPageType.current == 2) {
      params.overTime = true;
    }
    // 当按照投保单号、提单运单号、保单号码查询时忽略日期条件
    if (params.companyPolicyNum || params.insureNum || params.goodsBillNo) {
      params.createTimeStart = undefined;
      params.createTimeEnd = undefined;
      params.exceptionTimeStart = undefined;
      params.exceptionTimeEnd = undefined;
      params.payTimeStart = undefined;
      params.payTimeEnd = undefined;
    }
    if (search.shipmentFromLocation) params.shipmentFromLocation = search.shipmentFromLocation[1];
    if (search.shipmentToLocation) params.shipmentToLocation = search.shipmentToLocation[1];
    if (search.shipmentPassLocation) params.shipmentPassLocation = search.shipmentPassLocation[1];
    // 处理传参完毕
    console.log('处理传参完毕-----', params);
    return params;
  };

  // 导出方法
  const exportExlFun = () => {
    let params = getTheQueryParams();
    setLoading(true);

    request
      .post(`${apiUrl}/insure/export`, {
        data: {
          ...params,
        },
        responseType: 'blob',
        getResponse: true,
      })
      .then(res => {
        setLoading(false);
        let blob = res.data;
        let response = res.response;
        let fileName = '保单列表.xlsx';
        // 获取服务端下发的文件名称
        let disposition = response.headers.get('content-disposition');
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        let matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          fileName = decodeURI(matches[1].replace(/['"]/g, ''));
          // 处理特殊情况文件名称中包含utf-8
          fileName = fileName.replace('utf-8', '');
        }
        // 开始下载
        // 组装a标签
        let elink = document.createElement('a');
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(new Blob([blob], { type: blob.type }));
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
        Message.success('导出成功');
      })
      .catch(err => {
        setLoading(false);
        Message.error('导出失败');
      });
  };

  // 保单页面状态
  const getIssueState = () => {
    let pageTypeObj = {
      pay: 0, // 待支付
      out: 1, // 待出单
      upload: 2, // 待上传
      ordered: 3, // 已出单
      surrender: 4, // 退保单
      correct: 5, // 批改单
      revoke: 6, // 撤销单
      abnormal: 7, // 异常单
    };
    return pageTypeObj[pageType];
  };
  // 处理时间参数
  const setTheTimeArr = (data, key) => {
    if (data[key] && data[key].length) {
      // 说明时间有值
      return {
        [key]: undefined,
        [key + 'Start']: setTimeValue(data[key][0]) + ' 00:00:00',
        [key + 'End']: setTimeValue(data[key][1]) + ' 23:59:59',
      };
    } else {
      return {
        [key]: undefined,
        [key + 'Start']: undefined,
        [key + 'End']: undefined,
      };
    }
  };
  // 处理时间参数
  const setTimeValue = moment => {
    if (moment) {
      return moment.format('YYYY-MM-DD');
    } else {
      return undefined;
    }
  };

  // 配置头部表单数据方法
  const setSearchHeaderData = () => {
    let companyBranchList = selectInfo.insuranceCompany || [];
    const companyBranchOption =
      (companyBranchList.find(item => item.psCompanyId === company) || {}).simpleBranchDTOs || [];
    // 重新设置头部表单的配置，这里主要是设置分支机构的下拉
    let optionsArr = getSearchHeaders({
      ...formConfOptins,
      companyNameList: selectInfo.insuranceCompany.map(el => {
        return {
          name: el.psCompanyName,
          label: el.psCompanyName,
          value: el.psCompanyId,
        };
      }),
      companyBranchList: companyBranchOption.map(el => {
        return {
          name: el.psBranchName,
          label: el.psBranchName,
          value: el.psBranchId,
        };
      }),
      transportionCategoryList: selectInfo.transportType.map(el => {
        return {
          name: el.name,
          label: el.name,
          value: el.code,
        };
      }),
      recordNotUploadReasonList: selectInfo.notUploadReason.map(el => {
        return {
          name: el.name,
          label: el.name,
          value: el.code,
        };
      }),
      cargoCategoryList: selectInfo.cargoCategory.map(el => {
        return {
          name: el.name,
          label: el.name,
          value: el.code,
        };
      }),
      companyProcessStateList: selectInfo.companyProcessState.map(el => {
        return {
          name: el.name,
          label: el.name,
          value: el.code,
        };
      }),
    });
    let newOptinsArr = [];
    pageFormConfOption[pageType].forEach(name => {
      let item = optionsArr.find(el => name === (el.symbol || el.label || el.placeholder));
      newOptinsArr.push(item);
    });
    newOptinsArr.push(...optionsArr.filter(el => el.type === 'button'));
    if (pageType !== 'all' && pageType !== 'ordered') {
      // 删除导出按钮
      newOptinsArr.splice(newOptinsArr.length - 1, 1);
    }
    setFormConf(newOptinsArr);
  };
  // 点击表格行中操作时触发
  const setCurrentDataAction = data => {
    setcurrentDataIndex(data);
    if (data.action === 'detail') {
      // 跳转到详情页
      let row = tableData.find(el => el.insureNum === data.id);

      if (data.isOrdered) {
        router.push(
          `/order/order-mgm/ordered/details/${row.traceId}/${row.partnerId}/${row.insureNum}`,
        );
      } else {
        router.push(`/order/order-mgm/details/${row.traceId}/${row.partnerId}/${row.insureNum}`);
      }
      // queryEnum ====>  ['INSURE_BASE', 'INSURE', 'SETTLEMENT', 'ALL']
    }
  };
  // 表单值发生变化时触发
  const onSearchHeaderChange = data => {
    if (data.name === 'psCompanyId') {
      setCompany(data.value);
    }
  };
  // 查找表格数据
  const selectTableData = payload => {
    let type = (type = 'order/listOrder');
    if (dispatch) {
      setLoading(true);
      dispatch({
        type,
        payload,
        callback: response => {
          setLoading(false);
          if (response.code === 200 && response.data) {
            setPagination(pagination => ({
              ...pagination,
              total: response.data.total,
              isSetTheTotal: true,
            }));
          } else {
            Message.error(response.msg);
          }
        },
      });
    }
  };
  const uploadPageTypeChange = key => {
    uploudPageType.current = key;
    getDataList();
  };
  // 回收数据
  const recycleData = (arr, fn) => {
    let param = { insures: arr };
    if (!arr.length) {
      Message.error('勾选内容没有锁单状态');
      return;
    }
    confirm({
      title: '确认要回收数据吗?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk() {
        if (dispatch) {
          setLoading(true);
          dispatch({
            type: 'order/inureLockUnlock',
            payload: {
              ...param,
            },
            callback: response => {
              setLoading(false);
              if (response.code === 200) {
                Message.success('操作成功');
                getDataList();
                if (fn) {
                  fn();
                }
              } else {
                Message.error(response.msg);
              }
            },
          });
        }
      },
    });
  };
  return (
    <Spin spinning={loading} size="large">
      <FragmentHeader form={formRef} fragments={formConf} onChange={onSearchHeaderChange} />
      {pageType === 'upload' ? (
        <Tabs defaultActiveKey="1" onChange={uploadPageTypeChange}>
          <TabPane tab="所有未上传" key="1" />
          <TabPane tab="审核超时" key="2" />
        </Tabs>
      ) : (
        ''
      )}
      <AllOrdersTable
        recycleData={recycleData}
        currentDataIndex={currentDataIndex}
        setcurrentDataIndex={setCurrentDataAction}
        tableData={tableData}
        pagination={pagination}
        setPagination={setPagination}
        pageType={pageType}
        uploudPageType={uploudPageType}
        getDataList={getDataList}
        random={random}
      />
      {/* 初始化各类型保单actions */}

      <Pay getDataList={getDataList} random={random} />
      <Out getDataList={getDataList} random={random} />
      <Upload getDataList={getDataList} random={random} />
      <Ordered getDataList={getDataList} random={random} />
      <Correct getDataList={getDataList} random={random} />
      <Revoke getDataList={getDataList} random={random} />
      <Abnormal getDataList={getDataList} random={random} />
    </Spin>
  );
});
