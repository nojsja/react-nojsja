/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

export default props => {
  const { onChange, onInnerChange, placeholder, name, defaultValue, value } = props;

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
    <Input
      {...props}
      allowClear
      value={value}
      defaultValue={defaultValue}
      onChange={onValueChange}
      placeholder={placeholder}
    />
  );
};
