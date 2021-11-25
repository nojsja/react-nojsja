/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Input, DatePicker } from 'antd';

export default props => {
  const {
    onChange,
    onInnerChange,
    name,
    defaultValue = [],
    value = [],
    width = 'auto',
    picker,
  } = props;

  let formattedValue;
  let formattedDefault;

  try {
    formattedValue = value.map(date => moment(date));
  } catch (error) {
    formattedValue = '';
  }
  try {
    formattedDefault = defaultValue.map(date => moment(date));
  } catch (error) {
    formattedDefault = '';
  }

  // const formattedValue = value ? value.map(date => moment(date)) : [];
  // const formattedDefault = defaultValue ? defaultValue.map(date => moment(date)) : [];

  useEffect(() => {
    onChange && onChange(formattedDefault);
  }, []);

  const onValueChange = (date, datestring) => {
    onChange && onChange(date);
    onInnerChange &&
      onInnerChange({
        name: name,
        value: date,
      });
  };

  return (
    <DatePicker.RangePicker
      {...props}
      picker={picker}
      allowClear
      value={formattedValue}
      defaultValue={formattedDefault}
      onChange={onValueChange}
      style={{ width: width }}
    />
  );
};
