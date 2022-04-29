import moment from 'moment';
const now = moment().format('YYYY-MM-DD');
let preDay = moment(new Date().getTime() - 30 * 24 * 3600 * 1000).format('YYYY-MM-DD');

export default options => {
  return [
    {
      type: 'dateRangePicker',
      defaultValue: [],
      symbol: 'search_by_creating_time_without_default_value',
      width: '100%',
      picker: 'date', // date | week | month | quarter | year
      disabled: false,
      placeholder: ['开始时间', '结束时间'],
      label: '按创建时间搜索',
      name: 'createTime',
      key: 'createTime',
      col: 8,
      sort: 1,
    },
    {
      type: 'dateRangePicker',
      symbol: 'search_by_creating_time_with_default_value',
      defaultValue: [preDay, now],
      width: '100%',
      picker: 'date', // date | week | month | quarter | year
      disabled: false,
      placeholder: ['开始时间', '结束时间'],
      label: '按创建时间搜索',
      name: 'createTime',
      key: 'createTime',
      col: 8,
      sort: 1,
    },
    {
      type: 'dateRangePicker',
      defaultValue: [
        /* '2021-11-10', '2021-12-10' */
      ],
      width: '100%',
      picker: 'date', // date | week | month | quarter | year
      disabled: false,
      placeholder: ['开始时间', '结束时间'],
      label: '支付时间',
      name: 'payTime',
      key: 'payTime',
      col: 8,
      sort: 1,
    },
    {
      type: 'dateRangePicker',
      width: '100%',
      defaultValue: [
        /* '2021-11-10', '2021-12-10' */
      ],
      picker: 'date', // date | week | month | quarter | year
      disabled: false,
      placeholder: ['开始时间', '结束时间'],
      label: '移入时间',
      name: 'exceptionTime',
      key: 'exceptionTime',
      col: 8,
      sort: 1,
    },
    {
      type: 'input',
      key: 'partnerId',
      name: 'partnerId',
      placeholder: '会员ID',
      disabled: false,
      col: 8,
      sort: 2,
    },
    {
      type: 'input',
      key: 'productName',
      name: 'productName',
      placeholder: '产品名称',
      disabled: false,
      col: 8,
      sort: 3,
    },
    {
      type: 'input',
      key: 'insureNum',
      name: 'insureNum',
      placeholder: '投保单号',
      disabled: false,
      col: 8,
      sort: 4,
    },
    {
      type: 'input',
      key: 'userName',
      name: 'userName',
      placeholder: '会员名称',
      disabled: false,
      col: 8,
      sort: 5,
    },
    {
      type: 'select',
      name: 'transportType',
      key: 'transportType',
      placeholder: '运输类型',
      sort: 6,
      col: 8,
      options: options.transportionCategoryList,
    },
    {
      type: 'input',
      key: 'companyPolicyNum1',
      name: 'companyPolicyNum',
      placeholder: '保单号',
      disabled: false,
      col: 8,
      sort: 4,
    },
    {
      type: 'typedInput',
      defaultValue: '',
      defaultType: 'goodsName',
      selectorWidth: '30%',
      inputWidth: '70%',
      name: 'keyword',
      key: 'keyword',
      disabled: false,
      sort: 7,
      col: 8,
      placeholder: '关键字',
      options: [
        { value: 'goodsInvoiceNo', label: '发票号' },
        { value: 'goodsContractNo', label: '合同号' },
        { value: 'goodsWorkNo', label: '工作单号' },
        { value: 'goodsName', label: '货物名称' },
      ],
    },
    {
      type: 'areaSelect',
      key: 'shipmentFromLocation',
      name: 'shipmentFromLocation',
      placeholder: '起运地',
      width: '100%',
      col: 8,
      sort: 8,
    },
    {
      type: 'areaSelect',
      key: 'shipmentToLocation',
      name: 'shipmentToLocation',
      placeholder: '目的地',
      width: '100%',
      col: 8,
      sort: 8,
    },
    {
      type: 'areaSelect',
      key: 'shipmentPassLocation',
      name: 'shipmentPassLocation',
      width: '100%',
      placeholder: '中转地',
      col: 8,
      sort: 8,
    },
    {
      type: 'select',
      name: 'recordNotUploadReason',
      key: 'recordNotUploadReason',
      placeholder: '未上传原因',
      sort: 6,
      col: 8,
      options: options.recordNotUploadReasonList,
    },
    {
      type: 'input',
      key: 'insurantName',
      name: 'insurantName',
      placeholder: '被保险人',
      disabled: false,
      col: 8,
      sort: 8,
    },

    {
      type: 'select',
      name: 'psCompanyId',
      key: 'psCompanyId',
      placeholder: '保险公司',
      sort: 9,
      col: 8,
      options: options.companyNameList,
    },
    {
      type: 'select',
      name: 'psBranchId',
      key: 'psBranchId',
      placeholder: '分支机构',
      sort: 10,
      col: 8,
      options: options.companyBranchList,
    },
    {
      type: 'typedInput',
      defaultValue: '',
      defaultType: 'licensePlateNumber',
      selectorWidth: '30%',
      inputWidth: '70%',
      name: 'transportation',
      key: 'transportation',
      disabled: false,
      sort: 11,
      col: 8,
      placeholder: '车牌/船名/航班/车次',
      options: [
        { value: 'licensePlateNumber', label: '车牌' },
        { value: 'vesselAndVoyage', label: '船名' },
        { value: 'flightNumber', label: '航班' },
        { value: 'trainNumber', label: '车次' },
      ],
    },
    {
      type: 'input',
      key: 'goodsBillNo',
      name: 'goodsBillNo',
      placeholder: '提单运单号',
      disabled: false,
      col: 8,
      sort: 12,
    },
    {
      type: 'select',
      name: 'goodsType',
      key: 'goodsType',
      placeholder: '货物种类',
      sort: 6,
      col: 8,
      options: options.cargoCategoryList,
    },
    {
      type: 'input',
      key: 'companyPolicyNum2',
      name: 'companyPolicyNum',
      placeholder: '保险公司号码',
      disabled: false,
      col: 8,
      sort: 13,
    },
    {
      type: 'input',
      key: 'operateDesc',
      name: 'operateDesc',
      placeholder: '订单日志',
      disabled: false,
      col: 8,
      sort: 13,
    },
    {
      type: 'select',
      name: 'companyProcessState',
      key: 'companyProcessState',
      placeholder: '对接状态',
      sort: 6,
      col: 8,
      options: options.companyProcessStateList,
    },

    {
      type: 'button',
      col: 'disabled',
      key: 'search',
      label: '搜索',
      buttonType: 'primary',
      name: 'search',
      onClick: options.clickEvent.search,
    },
    {
      type: 'button',
      label: '清除',
      col: 'disabled',
      key: 'clear',
      buttonType: 'primary',
      name: 'clear',
      onClick: options.clickEvent.clear,
    },
    {
      type: 'button',
      label: '导出',
      key: 'export',
      name: 'export',
      col: 'disabled',
      buttonType: 'primary',
      onClick: options.clickEvent.export,
    },
  ];
};