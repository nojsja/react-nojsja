/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

export default props => {
  const { options = [], width, name, onChange, onInnerChange, defaultValue, value } = props;

  useEffect(() => {
    if (onChange && defaultValue !== '' && defaultValue !== undefined) {
      onChange(defaultValue);
    }
  }, []);

  const onTypeChange = typeValue => {
    onChange && onChange(typeValue);
    onInnerChange &&
      onInnerChange({
        name: name,
        value: typeValue,
      });
  };

  return (
    <Select
      {...props}
      style={{ width: width }}
      defaultValue={defaultValue}
      onChange={onTypeChange}
      value={value}
    >
      {options.map(option => {
        return (
          <Option key={option.key || option.value} value={option.value}>
            {option.label}
          </Option>
        );
      })}
    </Select>
  );
};
