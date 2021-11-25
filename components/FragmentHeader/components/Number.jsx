/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';

export default props => {
  const { onChange, onInnerChange, placeholder, name, defaultValue, value, width } = props;

  useEffect(() => {
    if (onChange && defaultValue !== '' && defaultValue !== undefined) {
      onChange(defaultValue);
    }
  }, []);

  const onValueChange = e => {
    onChange && onChange(e.target.value);
    onInnerChange &&
      onInnerChange({
        name: name,
        value: e.target.value,
      });
  };

  return (
    <InputNumber
      {...props}
      allowClear
      value={value}
      style={{ width: width }}
      defaultValue={defaultValue}
      onChange={onValueChange}
      placeholder={placeholder}
    />
  );
};
