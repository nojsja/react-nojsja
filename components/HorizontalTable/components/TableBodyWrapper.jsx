import React from 'react';
import style from '../index.less';

export default function BodyWrapper(props) {
  return <div className={"horizontal-table__body"}>{props.children}</div>;
}
