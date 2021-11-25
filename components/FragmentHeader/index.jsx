import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'antd';

import Fragment from './components';

const defaultData = {
  // col: 6,
};

const ParsedOptions = (options = {}) => {
  if (Fragment.keys.includes(options.type)) {
    const Component = Fragment[options.type];
    return <Component {...options} />;
  }
  return <span>(未定义的组件)</span>;
};

const labelOptions = (params, formItemProps) => {
  if (params.type === 'button') {
    return {};
  }
  return {
    label: params.label || formItemProps.label || params.placeholder || params.name,
    wrapperCol: { span: 17 },
    labelCol: { span: 7 },
  };
};

/* 属性包裹 */
const optionsWrapper = (options = {}, onChange) => {
  return {
    ...defaultData,
    ...options,
    onChange: (...props) => {
      if (options.onChange) {
        options.onChange(...props);
      }
      onChange(...props);
    },
  };
};

/* col包裹 */
const ColWrapper = props => {
  if (props.col === 'disable') {
    return <>{props.children}</>;
  } else {
    return <Col span={props.col}>{props.children}</Col>;
  }
};

/* 多字段生成 */
const FormattedTemplate = ({ fragments, onChange }) => {
  return fragments
    .sort(item => item.sort)
    .map(temp => {
      const params = optionsWrapper(temp, onChange);
      const rules = params.rules || [];
      const validateFirst = params.validateFirst || false;
      const formItemProps = params._formItemProps || {};
      params.onInnerChange = params.onChange;
      delete params.onChange;
      delete params.rules;
      delete params.validateFirst;
      delete params._formItemProps;
      return (
        <ColWrapper col={params.col} key={params.key}>
          <Form.Item
            rules={rules}
            name={params.name}
            {...labelOptions(params, formItemProps)}
            validateFirst={validateFirst}
            {...formItemProps}
          >
            <ParsedOptions {...params} />
          </Form.Item>
        </ColWrapper>
      );
    });
};

/* 获取默认值 */
const getDefaultValues = (fragments = []) => {
  return fragments.reduce((result, item) => {
    result[item.name] = item.defaultValue;
    return result;
  }, {});
};

export default props => {
  const { fragments = [], onChange } = props;

  const form = props.form || Form.useForm()[0];

  // useEffect(() => {
  //   form.resetFields();
  // }, [fragments]);

  return (
    <Form form={form} initialValues={getDefaultValues(fragments)}>
      <Row gutter={24}>
        <FormattedTemplate onChange={onChange} fragments={fragments} />
      </Row>
    </Form>
  );
};
