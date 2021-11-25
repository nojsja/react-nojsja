export default options => {
  return [
    {
      type: 'date',
      defaultValue: '2021-11-11',
      width: '100%',
      placeholder: '按时间搜索',
      name: 'date',
      key: 'date',
      disabled: false,
      col: 6,
      sort: 1,
    },

    {
      type: 'input',
      key: 'billNum',
      name: 'billNum',
      placeholder: '投保单号',
      disabled: false,
      col: 6,
      sort: 2,
    },
    {
      type: 'input',
      key: 'userName',
      name: 'userName',
      placeholder: '员工姓名',
      disabled: false,
      col: 6,
      sort: 4,
    },
    {
      type: 'select',
      name: 'companyName',
      key: 'companyName',
      placeholder: '保险公司',
      sort: 5,
      col: 6,
      options: [
        {
          name: 'company1',
          value: '1',
          label: 'company1',
        },
        {
          name: 'select1',
          value: '2',
          label: '保险公司2',
        },
      ],
    },
    {
      type: 'select',
      name: 'companyBranch',
      key: 'companyBranch',
      placeholder: '分支机构',
      sort: 6,
      col: 6,
      options: [
        {
          name: 'branch1',
          value: '1',
          label: '分支机构1',
        },
        {
          name: 'branch1',
          value: '2',
          label: '分支机构2',
        },
      ],
    },

    {
      type: 'button',
      col: 'disabled',
      key: 'search',
      label: '搜索',
      buttonType: 'primary',
      name: 'search',
      onClick: options.search,
    },
    {
      type: 'button',
      label: '清除',
      col: 'disabled',
      key: 'clear',
      buttonType: 'primary',
      name: 'clear',
      onClick: options.clear,
    },
  ];
};
