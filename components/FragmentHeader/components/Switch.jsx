import React, { useEffect, useState } from 'react';
import { Input, Switch } from 'antd';

import style from '../index.less';

export default props => {
  const { label, name, onChange, onInnerChange, defaultValue, value } = props;

  useEffect(() => {
    if (onChange && defaultValue !== '' && defaultValue !== undefined) {
      onChange(defaultValue);
    }
  }, []);

  const onValueChange = checked => {
    onChange && onChange(checked);
    onInnerChange &&
      onInnerChange({
        name: name,
        value: checked,
      });
  };

  return (
    <Input.Group>
      <Switch {...props} onChange={onValueChange} defaultChecked={defaultValue} value={value} />
      <label className={style['margin__left-12']}>{label}</label>
    </Input.Group>
  );
};
