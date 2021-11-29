import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Divider, Form } from 'antd';
import { connect } from 'dva';

import getColumns, { keys } from './components/columns';
import style from '@/pages/index.less';

export const editValues = {
  value: null,
};

// 计算值
export const computeValues = {
  value: null,
};

const getComputeValues = values => {
  if (values && values.length) {
    computeValues.value = values.reduce((pre, cur) => {
      pre[cur.id] = cur;
      return pre;
    }, {});
  } else {
    computeValues.value = null;
  }
};

// 格式化公司和分支机构数据
const formatCompany = companys => {
  return companys.reduce((pre, cur) => {
    cur.simpleBranchDTOs.forEach(branch => {
      if (branch.cooperationState === 1) {
        pre.push({
          ...branch,
          psCompanyName: cur.psCompanyName,
          company: `${cur.psCompanyName}-${branch.psBranchName}`,
          id: `${branch.psCompanyId}-${branch.psBranchId}`,
          acceptInsurance: false,
          insureFeeRate: '',
          settlementFeeRate: '',
          cost: '',
          insureType: '',
          payFree: '',
          specialAgreement: '',
        });
      }
    });
    return pre;
  }, []);
};

// 多模式keys配置
const fullKeys = [
  'company',
  'acceptInsurance',
  'insureFeeRate',
  'settlementFeeRate',
  'cost',
  'insureType',
  'payFree',
  'specialAgreement',
];

const mapStateToProps = state => ({
  companys: state.common.selectInfo.insuranceCompany,
});

export default connect(mapStateToProps)(function(props) {
  let { form } = props;
  const {
    value,
    dispatch,
    templateData = [],
    mode = 'full',
    disabled,
    companys: companysData,
  } = props;

  form = form || Form.useForm()[0];
  const [tableData, setTableData] = useState(value);
  const [columns, setColumns] = useState([]);
  const [template, setTemplate] = useState(formatCompany(companysData));
  const [status, setStatus] = useState('view');
  const [allChecked, setAllChecked] = useState(false);

  // 编辑模式
  const isEdit = status === 'edit';
  const isView = status === 'view';

  /* hooks */

  // 回调设置Form.Item数据
  const onChange = value => {
    console.log('onChange', value);
    setTableData(value);
    if (props.onChange) {
      props.onChange(value);
    }
  };

  // 组件挂载后获取初始模板数据
  useEffect(() => {
    if (value && value.length) {
      onChange(value);
    }
    // 支持传入模板数据
    if (templateData && templateData.length) {
      setTemplate(templateData);
    } else {
      if (template.length) {
        setTableData(getTableData(value && value.length ? value : [], template));
      }
    }
  }, []);

  // 更新模板公司
  useEffect(() => {
    setTemplate(formatCompany(companysData));
  }, [companysData]);

  // 编辑状态改变时重新渲染表格列表
  useEffect(() => {
    setColumns(
      getColumns({
        rows: fullKeys,
        onTableChange,
        setAllChecked: setAllCheckedAction,
        allChecked,
        disabled: isView,
      }),
    );
  }, [disabled, isView, allChecked]);

  useEffect(() => {
    const datas = value && value.length ? value : [];
    if (template.length) {
      setTableData(getTableData(datas, template));
    }
  }, [value, template]);

  /* handlers */

  // 选择所有承保项
  const setAllCheckedAction = status => {
    editValues.value = editValues.value
      ? editValues.value.map(item => {
          item.acceptInsurance = status;
          return item;
        })
      : null;
    setAllChecked(status);
    getComputeValues(editValues.value);
    if (editValues.value) {
      form.resetFields(editValues.value.map(item => `acceptInsurance_${item.id}`));
    }
  };

  // 根据模板数据和当前数据生成表格数据
  const getTableData = (datas, costRate) => {
    datas.forEach(pr => {
      costRate.forEach(co => {
        if (co.id === `${pr.psCompanyId}-${pr.psBranchId}`) {
          co.specialAgreement = pr.specialAgreement;
          co.cost = pr.cost;
          co.payFree = pr.payFree;
          co.insureFeeRate = pr.insureFeeRate;
          co.settlementFeeRate = pr.settlementFeeRate;
          co.insureType = pr.insureType;
          co.acceptInsurance = pr.acceptInsurance;
        }
      });
    });

    return costRate;
  };

  // 保存编辑
  const saveEdit = () => {
    console.time('saveEdit');
    form
      .validateFields()
      .then(values => {
        console.timeEnd('saveEdit');
        setStatus('view');
        onChange(editValues.value || tableData);
        editValues.value = null;
        getComputeValues(editValues.value);
      })
      .catch(error => {
        console.timeEnd('saveEdit');
        console.log(error);
      });
  };

  // 进入编辑模式
  const setEdit = () => {
    setStatus('edit');
    editValues.value = tableData;
    getComputeValues(editValues.value);
  };

  // 取消编辑
  const cancelEdit = id => {
    setStatus('view');
    editValues.value = null;
    getComputeValues(editValues.value);
    form.resetFields();
  };

  // 表格字段同步更新
  const onTableChange = (attr, value, data) => {
    editValues.value = editValues.value || tableData;
    const modifiedData = editValues.value.map(table => {
      if (table.id === data.id) {
        return {
          ...table,
          ...{
            [attr]: value,
          },
        };
      }
      return table;
    });

    editValues.value = modifiedData;
    getComputeValues(editValues.value);
  };

  console.log(tableData);

  return (
    <div className={props.className}>
      <div>
        {!disabled && (
          <>
            {status === 'view' && (
              <Button disabled={disabled} onClick={setEdit} type="primary">
                编辑
              </Button>
            )}
            {status === 'edit' && (
              <>
                <Button
                  className={style['margin__right__12']}
                  disabled={disabled}
                  onClick={saveEdit}
                  type="primary"
                >
                  保存
                </Button>
                <Button disabled={disabled} onClick={cancelEdit}>
                  取消
                </Button>
              </>
            )}
          </>
        )}
      </div>
      <Form form={form}>
        <Table columns={columns} dataSource={tableData} pagination={false} />
      </Form>
    </div>
  );
});
