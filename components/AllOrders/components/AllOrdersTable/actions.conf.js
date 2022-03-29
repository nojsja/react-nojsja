import ColumnActios from './components';
/**
 * 获取操作列的配置
 * hz21117498
 * @param {string} pageType  不同页面的值
 * @param {*} uploudPageType 待上传页分了2个tab的type
 * @param {*} setcurrentDataIndex 上层表格点击行的方法
 * @returns
 */
const getPageTableColumnAction = (pageType, uploudPageType, setcurrentDataIndex, random) => {
  let actions = null;
  // 列操作配置
  if (pageType === 'all') {
    actions = data => {
      const Component = ColumnActios[data.orderStatus];
      if (Component) {
        return (
          <Component
            rowData={data}
            pageType={pageType}
            uploudPageType={uploudPageType}
            setcurrentDataIndex={setcurrentDataIndex}
            random={random}
          />
        );
      } else {
        return '';
      }
    };
  } else {
    const Component = ColumnActios[pageType];
    if (Component) {
      actions = data => {
        return (
          <Component
            rowData={data}
            pageType={pageType}
            uploudPageType={uploudPageType}
            setcurrentDataIndex={setcurrentDataIndex}
            random={random}
          />
        );
      };
    }
  }
  if (!actions) {
    return null;
  }
  return {
    title: '操作',
    width: 200,
    fixed: 'right',
    key: 'operation',
    render: actions,
  };
};

export default getPageTableColumnAction;
