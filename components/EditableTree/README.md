### EditableTree
--------------
A editable tree component based on antd tree and powered by react.

#### Preview
![EditableTree](https://raw.githubusercontent.com/nojsja/react-nojsja/master/components/EditableTree/resources/EditableTree.png)

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
The data to build a editable antd tree, Check data instruction from `Usage` below.

* maxLevel [Number]  
The max tree level depth, default 50.

* enableYaml [Boolean]  
Enable input yaml string, default false.

* onDataChange [Function]  
Get treeData when data changed.

* lang [String]  
lang env: `zh_CN` | `en_US`, default `zh_CN`


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
  enableYaml={true} // enable to parse yaml string, default false
  lang="en_US" // default zh_CN
  onDataChange={this.onDataChange} // data change listener
/>
```