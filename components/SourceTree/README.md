#### SourceTree
_________________
>可单选多选、可右键选择、可自定义icon和color 资源树组件 (基于Semantic库)

##### How To Use ?
```js
// import
import SourceTree from 'SourceTree/'

// instantiation
<EaglesIndexTree
  setActiveItem={this.setActiveItem}
  baseIcon={null}
  baseColor={null}
  menuItems={menuItems}
  menuHandler={this.menuHandler}
  rightClickMenu={false}
  checkable={false}
  singleChecked={false}
  treeData={treeData}
  getChecked={this.getChecked}
/>

```

##### Instruction

```js

                                      /**
                                       * 01. 必要说明
                                       */
/* -----------------------------------------------------------------------------
  数据属性说明:
    name[String]: 节点名 - 可以存在重名，组件在初始化时会做 重名标识处理
    flag[String]：标示节点类型 - file(文件) | table(表) | base(默认显示文件夹)
    children[Array]: 标示所有子节点 - 所有节点的数据格式相同

  注意:
    组件会根据treeData(数组)的第一层数据划分为多个根节点，每个根节点管理各自子节点的统一状态，
    子节点只负责数据呈现和响应DOM事件，在根节点的state中所有层次的子节点状态数据都在一个层次，
    没有嵌套数据，根节点在组件初始化、组件treeData更新、响应回调函数时会做数据预处理(重名处理
    、获取真实节点处理、格式化数据处理)。
    组件使用递归生成，每个根节点下的子节点的 mount 和 unmount操作 比较频繁，暂时不能解决。
----------------------------------------------------------------------------- */
                                      /**
                                       * 02. 模拟数据
                                       */
/* -----------------------------------------------------------------------------
  模拟数据treeData示例:
    treeData: [
      {
        name: 'index',
        flag: 'base',
        children: [
          {name: '别名'},
          {
            name: '索引表',
            children: [
              {name: 'exits', children: [{name: 'lalal', flag: 'table'}]},
              {name: '_default_', flag: 'file'},
              {name: 'exits2', children: [{name: 'lalal2', flag: 'table'}]},
            ]
          }
        ]
      },

      {
        name: '23qe2jewrjsdf-sdfjksdfsjdf-sdfkjsdfjsd',
        flag: 'base',
        children: [
          {name: '别名'},
          {
            name: '索引表',
            children: [
              {name: 'cayman-sdfjksdfjkdk-sdfsdfkdkd-dk',flag: 'table'},
              {name: '_default_', flag: 'table'}
            ]
          }
        ]
      }
    ]
----------------------------------------------------------------------------- */
                                      /**
                                       * 03. 组件属性说明
                                       */
/* -----------------------------------------------------------------------------
  资源树传入属性说明:
  SourceTree.propTypes = {
    treeData: PropTypes.array.isRequired,  // 见顶部数据格式 - 必要参数
    menuItems: PropTypes.arrayOf(  // 右键菜单的所有菜单项目 - 非必要参数
      PropTypes.shape({
        name: PropTypes.string,  // 菜单名 - 必要参数
        title: PropTypes.string  // 鼠标hover显示信息 - 非必要参数
      })
    ),
    baseIcon: PropTypes.string,  // base元素自定义图标名 - 参照semantic - 非必要参数
    baseColor: PropTypes.string,  // base元素自定义图标颜色 - 非必要参数
    checkable: PropTypes.bool,  // 资源树是否支持状态选中 - 非必要参数
    singleChecked: PropTypes.bool,  // 使用单选状态 - 默认是多选状态 - 非必要参数
    rightClickMenu: PropTypes.bool,  // 资源树是否支持显示右键菜单 - 非必要参数


    / ---------------------------------------------------
      回调函数说明:
      在 回调函数 里可以取得资源树返回的数据，比如切换选中状态时，
      我们传入的getChecked函数就会 被调用 并携带上所有被选中元素的
      数组数据。
    ---------------------------------------------------- /

    getChecked: PropTypes.func,  //  获取所有选中元素的函数 - [回调函数] - 非必要参数
                                 //  getChecked函数中 返回的数据依次是：
                                 //  checkedArray(当前选中元素数组), rootItem(当前元素所属根对象)

    setActiveItem: PropTypes.func,  // 点击列表时显示点击对象 - [回调函数] - 非必要参数
                                    //  setActiveItem函数中 返回的数据依次是: item(当前元素对象),
                                    //  flag(当前元素标志), root(当前元素所属根对象)

    menuHandler: PropTypes.func,  // 右键菜单点击菜单项的事件处理 - [回调函数] - 非必要参数
  };

  资源树默认属性说明:
  SourceTree.defaultProps = {
    checkable: false,  // 默认不支持选中功能
    singleChecked: false,  // 选中状态下默认是单选
    rightClickMenu: false  // 默认不支持右键菜单
  }
```

#### Attention
1. 组件依赖semantic-ui-react库，需要npm安装
