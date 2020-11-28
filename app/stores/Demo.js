import { observable, action } from 'mobx';

class Demo {

  @observable editableTree = {
    treeData: {
      'zh_CN': [
        {
          nodeName: '出版者',
          id: 'publisher',
          nameEditable: true, // default true
          valueEditable: true, // default true
          nodeValue: [
            {
              nodeName: '出版者描述',
              isInEdit: true, // default false
              id: 'publisher description',
              nodeValue: [
                {
                  nodeName: '出版者名',
                  id: 'publisher name',
                  nodeValue: '出版者A',
                },
                {
                  nodeName: '出版地',
                  id: 'publisher place',
                  nodeDeletable: false,
                  nodeValue: '该层级不能删除!',
                },
              ],
            }
          ],
        },
        {
          nodeName: '出版者B',
          id: 'publisherB',
          valueEditable: false, // default true
          nodeValue: '该值不能被编辑!',
        }
      ],
      'en_US': [
        {
          nodeName: 'publisher',
          id: 'publisher',
          nameEditable: true, // default true
          valueEditable: true, // default true
          nodeValue: [
            {
              nodeName: 'publisher description',
              isInEdit: true, // default false
              id: 'publisher description',
              nodeValue: [
                {
                  nodeName: 'publisher name',
                  id: 'publisher name',
                  nodeValue: 'publisherA',
                },
                {
                  nodeName: 'publisher place',
                  id: 'publisher place',
                  nodeDeletable: false,
                  nodeValue: 'the node can not be deleted!',
                },
              ],
            }
          ],
        },
        {
          nodeName: 'publisherB',
          id: 'publisherB',
          valueEditable: false, // default true
          nodeValue: 'the value can not be edited!',
        }
      ]
    }
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

  @observable audioPlayer = {
    src: 'http://nojsja.gitee.io/static-resources/audio/life-signal.mp3',
  }

  @observable infiniteScroll = {
    hasMore: true,
    max: 60,
    data: new Array(10).fill('item'),
    loading: false,
  }

  @action infiniteScroll_loadMore = () => {
    this.infiniteScroll.loading = true;
    setTimeout(() => {
      this.infiniteScroll.loading = false;
      this.infiniteScroll.data.push('----- loading point -----', ...new Array(9).fill('item'));
      if (this.infiniteScroll.data.length >= this.infiniteScroll.max) {
        this.infiniteScroll.hasMore = false;
        this.infiniteScroll.data.push('----- bottom -----');
      }
    }, 1.5e3);
  }
}
export default Demo;
