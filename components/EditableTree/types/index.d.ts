import React from 'react';

interface ReturnTreeData {
  depth: number
  id: boolean
  isInEdit: boolean
  key: string
  nameEditable: boolean
  nodeDeletable: boolean
  nodeName: string
  nodeValue: ReturnTreeData[]
  valueEditable: boolean
}

interface TreeStateTypes {
  treeData: ReturnTreeData[];
  expandedKeys: string[];
  enableYaml: boolean;
  maxLevel: number;
  lang: 'zh_CN' | 'en_US';
}

interface TreePropsDataTypes {
  nodeName: string;
  id: string; // unique id, required
  nameEditable ?: boolean; // is level editable (name), default true
  valueEditable ?: boolean; // is level editable (value), default true
  nodeDeletable ?: boolean; // is level deletable, default true
  nodeValue : TreePropsDataTypes[] | string;
}

interface TreePropsTypes {
  data: TreePropsDataTypes[];
  maxLevel: number;
  enableYaml: boolean;
  lang: 'en_US' | 'zh_CN';
  onDataChange: (params: ReturnTreeData[]) => void
};

declare module 'editable-tree-antd' {
  export default class EditableTree extends React.Component<TreePropsTypes, TreeStateTypes> {}
}