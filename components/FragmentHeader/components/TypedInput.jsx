/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

export default props => {
  const {
    options = [],
    selectorWidth = '20%',
    inputWidth = '80%',
    name,
    onChange,
    onInnerChange,
    defaultValue,
    defaultType,
    value,
  } = props;

  useEffect(() => {
    if (onChange && defaultValue !== '' && defaultValue !== undefined) {
      onChange(defaultValue);
    }
  }, []);

  const [v, setValue] = useState(defaultValue);
  const [t, setType] = useState(defaultType);

  const onTypeChange = typeValue => {
    setType(typeValue);
    onChange &&
      onChange({
        name: name,
        type: typeValue,
        value: v,
      });
    onInnerChange &&
      onInnerChange({
        name: name,
        type: typeValue,
        value: v,
      });
  };

  const onValueChange = e => {
    setValue(e.target.value);
    onChange &&
      onChange({
        name: name,
        type: t,
        value: e.target.value,
      });
    onInnerChange &&
      onInnerChange({
        name: name,
        type: t,
        value: e.target.value,
      });
  };

  return (
    <Input.Group compact>
      <Select
        style={{ width: selectorWidth }}
        defaultValue={defaultType}
        onChange={onTypeChange}
        value={value.type}
      >
        {options.map(option => {
          return (
            <Option key={option.key || option.value} value={option.value}>
              {option.label}
            </Option>
          );
        })}
      </Select>
      <Input
        {...props}
        allowClear
        style={{ width: inputWidth }}
        onChange={onValueChange}
        defaultValue={defaultValue}
        value={value.value}
      />
    </Input.Group>
  );
};
