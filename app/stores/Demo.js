import { observable, action } from 'mobx';

class Demo {

  @observable editableTree = {
    treeData: [
      {
        nodeName: 'publisher',
        id: 'publisher',
        nameEditable: true,
        valueEditable: true,
        nodeValue: [
          {
            nodeName: 'publisher description',
            isInEdit: true,
            nameEditable: true,
            valueEditable: true,
            id: 'publisher description',
            nodeValue: [
              {
                nodeName: 'publisher name',
                id: 'publisher name',
                nameEditable: true,
                valueEditable: true,
                nodeValue: 'publisherA',
              },
              {
                nodeName: 'publisher place',
                id: 'publisher place',
                nameEditable: true,
                valueEditable: true,
                nodeValue: 'publisher placeB1',
              },
            ],
          }
        ],
      },
      {
        nodeName: 'publisherB',
        id: 'publisherB',
        nameEditable: true,
        valueEditable: false,
        nodeValue: 'disabled',
      }
    ]
  }

  @observable sourceTree = {
    treeData: [
      {
        name: 'level1',
        flag: 'base',
        children: [
          { name: 'level2-1' },
          {
            name: 'level2-2',
            children: [
              { name: 'level3-1', children: [{ name: 'level4-1', flag: 'table'}] },
              { name: 'level3-2', flag: 'file' },
              { name: 'level3-3', children: [{ name: 'level4-2', flag: 'table' }] },
            ]
          }
        ]
      },
    
      {
        name: 'long-name-long-name-long-name-long-name-long-name-',
        flag: 'base',
        children: [
          { name: 'level2-1' },
          {
            name: 'level2-2',
            children: [
              { name: 'level3-1',flag: 'file' },
              { name: 'level3-2', flag: 'file' }
            ]
          }
        ]
      }
    ]
  }
}
export default Demo;
