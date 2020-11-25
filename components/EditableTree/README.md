### EditableTree
--------------
A editable tree component based on antd tree and power by react.

#### Usage
```js
import EdiableTree from 'EditableTree/index.jsx';

/* demo data */
[
  {
    nodeName: '出版者',
    id: '出版者', // unique id
    nameEditable: true, // is level editable (name), default true
    valueEditable: true, // is level editable (value), default true
    nodeDeletable: false, // is level deletable, default true
    nodeValue: [
      {
        nodeName: '出版者描述',
        isInEdit: true,
        nameEditable: true,
        valueEditable: true,
        id: '出版者描述',
        nodeValue: [
          {
            nodeName: '出版者名称',
            id: '出版者名称',
            nameEditable: true,
            valueEditable: true,
            nodeValue: '出版者A',
          },
          {
            nodeName: '出版者地',
            id: '出版者地',
            nameEditable: true,
            valueEditable: true,
            nodeValue: '出版地B1',
          },
        ],
      }
    ],
  },
];

/* render function */
<EditableTree
  data={treeData} // see demo data above
  maxLevel={10} // tree max level limitation
  pub={this.props.pub} // lang injection, please see full demo code
  onDataChange={this.onDataChange} // data change listener
/>
```