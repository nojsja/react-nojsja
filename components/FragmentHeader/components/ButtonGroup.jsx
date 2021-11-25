/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'antd';

export default props => {
  const { options } = props;

  return (
    <Button.Group>
      {options.map(option => (
        <Button {...option} key={option.key} onClick={option.onClick}>
          {option.label}
        </Button>
      ))}
    </Button.Group>
  );
};
