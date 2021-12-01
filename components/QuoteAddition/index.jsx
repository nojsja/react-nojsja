import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Message, Form } from 'antd';
import { connect } from 'dva';

import getColumns, { keys } from './components/columns';
import style from '@/pages/index.less';
import { getRandomString } from '@/utils/utils';

// 编辑值
export const editValues = new Map();

// 计算值
export const computeValues = new Map();

const getComputeValues = (values, id) => {
  if (values.get(id) && values.get(id).length) {
    computeValues.set(
      id,
      values.get(id).reduce((pre, cur) => {
        pre[cur.id] = cur;
        return pre;
      }, {}),
    );
  } else {
    computeValues.delete(id);
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
          settlementRate: '',
          assessAmount: '',
          policyType: '',
          freeCompe: '',
          convention: '',
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
  'settlementRate',
  'assessAmount',
  'policyType',
  'freeCompe',
  'convention',
];

const mapStateToProps = state => ({
  companys: state.common.selectInfo.insuranceCompany,
  userInfo: state.employee.userInfo,
});

export default connect(mapStateToProps)(function(props) {
  let { form, addState } = props;
  const {
    value,
    userInfo,
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
  // 唯一id
  const id = useRef(getRandomString()).current;

  // 编辑模式
  const isEdit = status === 'edit';
  const isView = status === 'view';

  /* hooks */

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

    return () => {
      editValues.delete(id);
      getComputeValues(editValues, id);
    };
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
        id,
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

  // 回调设置Form.Item数据
  const onChange = value => {
    console.log('onChange', value);
    setTableData(value);
    if (props.onChange) {
      props.onChange(value);
    }
  };

  // 选择所有承保项
  const setAllCheckedAction = status => {
    if (editValues.has(id)) {
      editValues.set(
        id,
        editValues.get(id).map(item => {
          item.acceptInsurance = status;
          return item;
        }),
      );
    }
    setAllChecked(status);
    getComputeValues(editValues, id);
    if (editValues.has(id)) {
      form.resetFields(editValues.get(id).map(item => `acceptInsurance_${item.id}`));
    }
  };

  // 根据模板数据和当前数据生成表格数据
  const getTableData = (datas, assessAmountRate) => {
    datas.forEach(pr => {
      assessAmountRate.forEach(co => {
        if (co.id === `${pr.psCompanyId}-${pr.psBranchId}`) {
          co.convention = pr.convention;
          co.assessAmount = pr.assessAmount;
          co.freeCompe = pr.freeCompe;
          co.insureFeeRate = pr.insureFeeRate;
          co.settlementRate = pr.settlementRate;
          co.policyType = pr.policyType;
          co.acceptInsurance = pr.acceptInsurance;
        }
      });
    });

    return assessAmountRate;
  };

  // 保存编辑
  const saveEdit = () => {
    form
      .validateFields()
      .then(values => {
        setStatus('view');
        onChange(editValues.has(id) ? editValues.get(id) : tableData);
        props.onSubmit();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // 进入编辑模式
  const setEdit = () => {
    setStatus('edit');
    editValues.set(id, tableData);
    getComputeValues(editValues, id);
  };

  // 取消编辑
  const cancelEdit = id => {
    setStatus('view');
    editValues.delete(id);
    getComputeValues(editValues, id);
    form.resetFields();
  };

  // 表格字段同步更新
  const onTableChange = (attr, value, data) => {
    console.log(attr, value, id);
    if (!editValues.has(id)) {
      editValues.set(id, tableData);
    }
    const modifiedData = editValues.get(id).map(table => {
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

    editValues.set(id, modifiedData);
    getComputeValues(editValues, id);
  };

  return (
    <div className={props.className}>
      <div className={style['margin__bottom__12']}>
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
