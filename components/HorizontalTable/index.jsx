import React from 'react';
import PropTypes from 'prop-types';

import TableHeader from './components/TableHeader';
import TableBody from './components/TableBody';
import TableBodyWrapper from './components/TableBodyWrapper';

import './index.less';

export const HorizontalTableBodyWrapper = TableBodyWrapper;
export const HorizontalTableBody = TableBody;
export const HorizontalTableHeader = TableHeader;

export default function HorizontalTable(props) {
  const { title, defaultLabelCol, defaultWrapperCol, defaultRowCol, columns, dataSource } = props;

  return (
    <div className={"horizontal-table__wrapper"}>
      <TableHeader title={title} />
      <TableBody
        template={columns}
        data={dataSource}
        labelCol={defaultLabelCol}
        wrapperCol={defaultWrapperCol}
        rowCol={defaultRowCol}
      />
    </div>
  );
}

HorizontalTable.defaultProps = {
  title: '',
  defaultLabelCol: 8,
  defaultWrapperCol: 16,
  defaultRowCol: 12,
  columns: [],
  dataSource: {},
};

HorizontalTable.propTypes = {
  // 表格标题
  title: PropTypes.oneOfType(PropTypes.string, PropTypes.element),
  // 默认标题列数
  defaultLabelCol: PropTypes.number,
  // 默认内容列数
  defaultWrapperCol: PropTypes.number,
  // 默认行宽
  defaultRowCol: PropTypes.number,
  // 表格列
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      render: PropTypes.func,
      labelCol: PropTypes.number,
      wrapperCol: PropTypes.number,
    }),
  ),
  // 表格数据
  dataSource: PropTypes.shape({
    [PropTypes.string]: PropTypes.any,
  }),
};
