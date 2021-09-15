import React from 'react';
import { Input, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default function TreeNodeYamlEditing({
  onNodeValueChange,
  editYamlConfirm,
  editCancel,
  lang,
  show
}) {
  return (
      show ?
      (<React.Fragment>
        <span>
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
            onChange={onNodeValueChange}
          />
        </span>
        <span>
          <span className="editable-tree-edit-confirm successColor">
            <Tooltip title={lang.confirm}>
              <CheckOutlined onClick={editYamlConfirm} />
            </Tooltip>
          </span>
          <span className="editable-tree-edit-cancel warningColor">
            <Tooltip title={lang.cancel}>
              <CloseOutlined onClick={editCancel} />
            </Tooltip>
          </span>
        </span>
      </React.Fragment>)
      :
      null
  )
}