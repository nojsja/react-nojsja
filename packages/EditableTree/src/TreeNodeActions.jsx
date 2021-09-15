import React from 'react';
import { Tooltip } from 'antd';

export default function TreeNodeActions({
  actionVisible,
  actionAddNodeVisible,
  addSisterNode,
  addSubNode,
  addYamlNode,
  removeNode,
  nodeDeletable,
  depthOverflow,
  enableYaml,
  isInEdit,
  lang,
}) {
  return (
    <React.Fragment>
          {
            actionVisible ?
            <span className="editable-tree-node-action">
              {
                !isInEdit &&
                actionAddNodeVisible &&
                (<Tooltip title={lang.addSisterNode}> <i className="iconfont icon-sisternode" onClick={addSisterNode} /></Tooltip>)
              }
              {
                !isInEdit &&
                actionAddNodeVisible &&
                !depthOverflow &&
                (<Tooltip title={lang.addSubNode}><i className="iconfont icon-subnode" onClick={addSubNode} /></Tooltip>)
              }
              {
                !isInEdit &&
                actionAddNodeVisible &&
                enableYaml &&
                (<Tooltip title={lang.addYamlNode}><i className="iconfont icon-node_multiple" onClick={addYamlNode} /></Tooltip>)
              }
              { nodeDeletable && <Tooltip title={lang.deleteLevel}> <i className="iconfont icon-delete" onClick={removeNode} /> </Tooltip>}
            </span>
          :
            <span className="editable-tree-node-action" />
          }
        </React.Fragment>
  );
}