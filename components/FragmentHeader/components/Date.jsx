/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Input, DatePicker } from 'antd';

export default props => {
  const { onChange, onInnerChange, name, defaultValue, value, width = 'auto' } = props;

  let formattedValue;
  let formattedDefault;

  try {
    formattedValue = moment(value);
  } catch (error) {
    formattedValue = '';
  }
  try {
    formattedDefault = moment(defaultValue);
  } catch (error) {
    formattedDefault = '';
  }

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
    <DatePicker
      {...props}
      style={{ width: width }}
      allowClear
      value={formattedValue}
      defaultValue={formattedDefault}
      onChange={onValueChange}
    />
  );
};
