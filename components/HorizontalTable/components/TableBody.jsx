import React from 'react';
import { Col, Row, Form } from 'antd';

import TableBodyWraper from './TableBodyWrapper';

export default function TableBody(props) {
  const { template, rowCol, labelCol, wrapperCol, data } = props;

  return (
    <TableBodyWraper>
      <Row>
        {template.map(column => {
          return (
            <Col
              span={column.rowCol || rowCol}
              key={column.key}
              className={"horizontal-table__body__row"}
            >
              <Row className={"horizontal-table__body__row-fill"}>
                <Col
                  span={column.labelCol || labelCol}
                  className={"horizontal-table__body__row-label"}
                >
                  {column.label}
                  {column.label ? '：' : ''}
                </Col>
                <Col
                  span={column.wrapperCol || wrapperCol}
                  className={"horizontal-table__body__row-wrapper"}
                >
                  {column.render
                    ? column.render(data[column.dataIndex], data)
                    : data[column.dataIndex]}
                </Col>
              </Row>
            </Col>
          );
        })}
      </Row>
    </TableBodyWraper>
  );
}
