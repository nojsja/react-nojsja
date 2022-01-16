### EditableTree
--------------
An editable tree component based on antd tree and powered by react.

#### Preview
![EditableTree](https://raw.githubusercontent.com/nojsja/react-nojsja/master/components/EditableTree/resources/EditableTree.jpg)

#### Features 

- Add sub nodes
- Add sister nodes
- Parse and insert yaml nodes
- Edit node name and node value
- Load nodes asynchronously
- Supported languages: en_US / zh_CN

#### Env
Working with `React^16.13.0` and `Antd^4.6.3`, please confirm to install them first.

#### Install
```sh
$: npm install editable-tree-antd
# or
$: yarn add editable-tree-antd
```
#### Options

* __data__ [Array]  
The data to build an editable antd tree, Check data instruction from `Usage` below.

* maxLevel [Number]  
The max tree level depth, default 50.

* enableYaml [Boolean]  
Enable input yaml string, default false.

* defaultExpandAll [Boolean]  
Expand all nodes, default true.

* onDataChange [Function]  
Get treeData when data changed.

* lang [String]  
lang env: `zh_CN` | `en_US`, default `zh_CN`.

* loadData [Function]  
Set option - `defaultExpandAll` to false and Load the children of node element asynchronously.
```javascript
function loadData(node) {
  console.log(node); // the parent node you clicked to expand
  const data = [ // the child nodes array
    {
      nodeName: 'x', // child node name
      nodeValue: 'x-value', // child node value
      id: '[unique id]', // child node unique id
    },
    {
      nodeName: 'x2',
      nodeValue: 'x2-value', // child node value
      id: '[unique id]',
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}
```

#### Usage
A full [demo](https://github.com/nojsja/react-nojsja)

```js
// ----- import antd depends
import 'antd/dist/antd.css';
// ----- import editable-tree depends
import 'editable-tree/lib/styles/icon-font/iconfont.css';
import 'editable-tree/lib/styles/editable-tree.css';
// ----- import component
import EditableTree from 'editable-tree-antd';

/* demo data */
[
  {
    nodeName: '出版者',
    id: '出版者', // unique id, required
    nameEditable: true, // is level editable (name), default true
    valueEditable: true, // is level editable (value), default true
    nodeDeletable: false, // is level deletable, default true
    nodeValue: [
      {
        nodeName: '出版者描述',
        isInEdit: true, // is level in edit status
        id: '出版者描述',
        nodeValue: [
          {
            nodeName: '出版者名称',
            id: '出版者名称',
            nodeValue: '出版者A',
          },
          {
            nodeName: '出版者地',
            id: '出版者地',
            valueEditable: false,
            nodeValue: '出版地B1',
          },
        ],
      }
    ],
  },
  ...
];

/* render function */
<EditableTree
  data={treeData} // see demo data above
  maxLevel={10} // tree max level limitation, default 50
  enableYaml={true} // enable parse yaml string, default false
  enableEdit={true} // enable tree edit, default true
  defaultExpandAll={true} // expand all nodes, default true
  // loadData={this.loadData} // load the children of node element asynchronously.
  lang="en_US" // default zh_CN
  onDataChange={this.onDataChange} // data change listener
/>
```