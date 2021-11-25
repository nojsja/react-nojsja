/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

export default props => {
  const { onClick = () => {}, label, buttonType, size, ghost = false } = props;

  return (
    <Button type={buttonType} ghost={ghost} size={size} onClick={onClick}>
      {label}
    </Button>
  );
};
