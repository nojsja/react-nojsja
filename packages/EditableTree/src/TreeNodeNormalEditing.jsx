import React from 'react';
import { Input, Tooltip} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default function TreeNodeNormalEditing({
  onNodeNameChange,
  editValueInputVisible,
  treeData,
  onNodeValueChange,
  editConfirm,
  editCancel,
  show,
  lang
}) {
  return (
    show ?
      <React.Fragment>
        <span>
          <Input
            className="normal-text"
            disabled={!treeData.nameEditable}
            size="small"
            onChange={onNodeNameChange}
            defaultValue={treeData.nodeName}
          />
        </span>
        ：
        {
          (editValueInputVisible) &&
          (<span>
            <Input
              className="normal-text"
              size="small"
              disabled={!treeData.valueEditable}
              onChange={onNodeValueChange}
              defaultValue={treeData.nodeValue}
            />
          </span>)
        }
        <span>
          <span className="editable-tree-edit-confirm successColor">
            <Tooltip title={lang.confirm}>
              <CheckOutlined onClick={editConfirm} />
            </Tooltip>
          </span>
          <span className="editable-tree-edit-cancel warningColor">
            <Tooltip title={lang.cancel}>
              <CloseOutlined onClick={editCancel} />
            </Tooltip>
          </span>
        </span>
      </React.Fragment>
    :
    null
    );
}