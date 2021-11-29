import React, { useEffect, useCallback } from 'react';
import QuillEditor from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { quillEmptyReg } from '@/utils/validator';
import style from '@/pages/index.less';
import { debounce } from '@/utils/utils';

const editorModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean'],
  ],
};

const Editor = React.memo(props => {
  console.log('Editor Render');
  return (
    <QuillEditor
      {...{
        ...props,
        value: props.value.current || '',
        onChange: value => {
          props.onChange.current(value);
        },
      }}
    />
  );
});

export default function index(props) {
  const { disabled, name, ...others } = props;

  // 使用不可变对象同步 Editor.onChange 的正确指向
  const editorRef = React.useRef();
  // 使用不可变对象同步去抖函数内 onChange 的正确指向
  const fnRef = React.useRef();
  // 使用不可变对象不会触发编辑器组件的重复渲染
  const valueRef = React.useRef(props.value);

  // 去抖函数用于快速输入字符时造成编辑器组件重渲染的卡顿优化
  const debounceChange = useCallback(debounce((...args) => {
    fnRef.current(...args);
  }, 300), []);

  // 用于传入的编辑器文本变化时更新内部独立状态
  useEffect(() => {
    if (props.value && (props.value !== valueRef.current)) {
      valueRef.current = props.value;
    }
  }, [props.value]);

  // 每次渲染时更新各个不可变对象的正确指向
  fnRef.current = props.onChange;
  editorRef.current = value => {
    const data = quillEmptyReg.test(value) ? '' : value;
    valueRef.current = data;
    if (props.onChange) {
      debounceChange(data, name)
    }
  };

  return (
    <Editor
      {...others}
      theme="snow"
      modules={editorModules}
      value={valueRef}
      className={style['editor__minheight__200']}
      {...(disabled ? { readOnly: true } : { readOnly: false })}
      onChange={editorRef}
    />
  );
}
