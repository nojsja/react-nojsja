import React from 'react';
import { Tooltip } from 'antd';
import { longNameFormatterNoTail } from './utils';

export default function TreeNodeDisplay({
  editNameInputVisible,
  treeData,
  getInToEditable,
  editValueInputVisible,
  lang,
}) {
  return (
  !treeData.isInEdit ?
    <React.Fragment>
      {
        (editNameInputVisible) &&
        (<span attr-key={treeData.key}>
          <Tooltip placement="bottom" title={(treeData.nodeName || '').length > 50 ? treeData.nodeName : ''}>
            <span
              onClick={(treeData.nameEditable) ? getInToEditable : undefined}
              className="editable-tree-label normal-text"
            >{longNameFormatterNoTail(treeData.nodeName || '')}
            </span>
          </Tooltip>
        </span>)
      }
      { editNameInputVisible && <span>：</span> }
      {
        editValueInputVisible &&
          <span>
            <Tooltip placement="bottom" title={(treeData.nodeValue || '').length > 50 ? treeData.nodeValue : ''}>
              <span
                onClick={getInToEditable}
                className="editable-tree-label normal-text"
              >{longNameFormatterNoTail(treeData.nodeValue || '')}
              </span>
            </Tooltip>
          </span>
      }
    </React.Fragment>
    :
    null
  );
}