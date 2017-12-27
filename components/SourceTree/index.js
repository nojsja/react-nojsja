/**
* @name: SourceTree
* @description: 可单选多选 可右键选择 可自定义icon和color 资源树组件 (基于Semantic库)
* @author: 杨伟(yang.wei@datatom.com)
*/

import React, { Component, PropTypes } from 'react';
import Lodash from 'lodash';
import {List, Icon, Input, Menu, Checkbox} from 'semantic-ui-react';
import RightClickMenu from '../RightClickMenu/index.js';
import './index.scss';

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

  资源树默认属性:
  SourceTree.defaultProps = {
    checkable: false,  // 默认不支持选中功能
    singleChecked: false,  // 选中状态下默认是单选
    rightClickMenu: false  // 默认不支持右键菜单
  }
----------------------------------------------------------------------------- */




/* ------------------- 资源树单个层级节点元素元素 ------------------- */
class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null
    };
  }

  flagMap = {  // 根据节点flag选择icon 和 color
    base: {
      icon: 'folder',
      color: 'yellow'
    },
    base_toggle: {
      icon: 'folder open',
      color: 'yellow'
    },
    table: {
      icon: 'table',
      color: 'blue'
    },
    file: {
      icon: 'file outline',
      color: 'blue'
    }

  }

  /*   生命周期   */

  componentWillMount() {
    const { nodeData }  = this.props;
    this.setState({
      name: nodeData.name,
      flag: nodeData.flag || null,
      fName: nodeData.fName
    })
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { nodeData }  = this.props;

    this.setState({
      name: nodeData.name,
      flag: nodeData.flag || null,
      fName: nodeData.fName
    })
  }

  /*   页面事件和用户操作   */

  /**
   * [toggleChecked 切换选中状态]
   * @param  {Object} e       [dom事件对象]
   * @param  {Bool}   checked [是否被选中]
   */
  toggleChecked = (e, { checked }) => {

    const { setChecked, getChecked, setCheckedSingle, singleChecked } = this.props;
    const { name, fName } = this.state;
    singleChecked ?
      setCheckedSingle(fName, checked) :
      setChecked(fName, checked);
  }

  /**
   * [toggleFolding 切换折叠状态]
   */
  toggleFolding = () => {

    const { setFolding } = this.props;
    const { name, fName } = this.state;
    setFolding(fName);

    this.setActiveItem();
  }

  /**
   * [setActiveItem 点击某个资源树节点触发的事件]
   */
  setActiveItem = () => {
    const { setActiveItem, childrenInfo } = this.props;
    const { name, fName, flag } = this.state;
    if (typeof setActiveItem === 'function') {
      setActiveItem( this.getRealActiveItem(childrenInfo['child_' + fName] ), flag);
    }
  }

  /**
   * [getRealActiveItem 获取节点真实数据-原始数据为了防止重名做了去重处理]
   * @param  {Object} nodeData [节点数据]
   */
  getRealActiveItem = (nodeData) => {
    const { childrenInfo } = this.props;
    let father, children;

    if (nodeData.father && childrenInfo[nodeData.father]) {
      father = childrenInfo[nodeData.father].name;
      nodeData = Object.assign({}, nodeData, {
        father: father,
      });
    }

    if (nodeData.children && nodeData.children.length) {
      nodeData = Object.assign({}, nodeData, {
        children: nodeData.children.map((child) => {
          return childrenInfo[child].name
        })
      });
    }

    return nodeData;
  }

  /*   DOM元素构造   */

  /**
   * [checkboxContent 选中状态框]
   */
  checkboxContent = () => {
    const { nodeData, childrenInfo, checkable, singleChecked } = this.props;
    const { name, fName, flag } = nodeData;

    if (checkable) {
      if (singleChecked && (flag === 'base' || !flag)) {
        return null;
      }
      const checked = childrenInfo['child_' + fName].checked || false;

      return(
        <div style={{display: 'table-cell',paddingRight: '0.5rem'}}>
          <Checkbox onChange={this.toggleChecked} checked={checked}/>
        </div>
      )

    }
    return null;
  }

  /**
   * [listContent 当前层级元素的子元素]
   * @param  {Boolean} isFolding [当前层级是否被折叠]
   */
  listContent = (isFolding) => {

    const {
      nodeData, setChecked, childrenInfo, checkable,setFolding,
      setActiveItem, getChecked, singleChecked, setCheckedSingle,
      baseIcon, baseColor
    } = this.props;
    const { children, name, fName }  = nodeData;

    if(children && children.length) {
      const listStyle = isFolding ? 'none' : 'block';
      return (
        <List.List className='List-List' style={{display: listStyle}}>
          {
            children.map((child, index) => {
              return (
                <ListItem
                  key={child.name + index + Lodash.uniqueId()}
                  baseIcon={baseIcon}
                  baseColor={baseColor}
                  nodeData={child}
                  childrenInfo={childrenInfo}
                  setChecked={setChecked}
                  setActiveItem={setActiveItem}
                  checkable={checkable}
                  getChecked={getChecked}
                  setCheckedSingle={setCheckedSingle}
                  singleChecked={singleChecked}
                  setFolding={setFolding}
                  checked={childrenInfo['child_' + child.fName]}
                />
              )
            })
          }
        </List.List>
      );
    }
    return null;
  }

  /* ------------------- render ------------------- */

  render(){

    const {
      nodeData, rightClickMenu, childrenInfo, baseIcon,
      baseColor
    } = this.props;
    const { flagMap } = this;
    const { isFolding } = childrenInfo['child_' + nodeData.fName];
    const { flag } = nodeData;

    let listIconName;  // icon 图标名
    let listIconColor;  // icon 颜色

    if (baseIcon && (flag === 'base' || !flag)) {
        listIconName = baseIcon;
    }else {
      listIconName = flag ? flagMap[flag].icon : flagMap['base'].icon;
      listIconName = (listIconName === flagMap['base'].icon && !isFolding) ?
        flagMap['base_toggle'].icon :
        listIconName;
    }

    if (baseColor && (flag === 'base' || !flag)) {
      listIconColor = baseColor;
    }else {
      listIconColor = flag ? flagMap[flag].color : flagMap['base'].color;
    }

    const listHeaderClass =
      (isFolding || flag != 'base') ?
      'List-Header' : 'List-Header List-Header-Active';

    return (

        <List.Item>
          {
            this.checkboxContent()
          }

          <List.Icon
            name={listIconName}
            onClick={this.toggleFolding}
            className='List-Icon'
            color={listIconColor}
          />
          <List.Content>
            <List.Header
              onClick={this.toggleFolding}
              className={listHeaderClass}
            >

              <div
                className='list-header-text'
                data-rightClickMenu={rightClickMenu ? true : false}
              >
                {nodeData.name}
              </div>

            </List.Header>
            {
              this.listContent(isFolding)
            }

          </List.Content>

        </List.Item>

    )
  }
};


/* ------------------- 资源树第一层根节点 ------------------- */
class RootListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,   // 节点名，显示文字
      isFolding: true,   // 是否需要折叠显示
      checkable: false,    // 节点是否支持选中状态
      checked: false,   //节点是否被选中
      flag: 'base',

      /*   会根据子节点个数创建多个child_xxx属性   */
      child_name: {   // 这个根节点下的所有层级的子节点
        father: 'name',   // 本级节点的父级节点名
        checked: false,    // 选中状态
        isFolding: true,  // 折叠状态
        children: ['child1', 'child2', 'child3'],   // 本级节点的包含的所有子节点
      }
    }
  }

  /*   克隆一份最新的状态数据(用于处理state未及时更新的情况)   */
  state_clone = {

    child_name: {   // 这个根节点下的所有层级的子节点
      father: 'name',   // 本级节点的父级节点名
      checked: false,    // 选中状态
      isFolding: true,  // 折叠状态
      children: ['child1', 'child2', 'child3'],   // 本级节点的包含的所有子节点
    }
  }

  index = 0  // 子节点索引标识，用于处理子节点重名的情况
  flagMap = {  // 根据节点flag选择icon 和 color
    base: {
      icon: 'folder',
      color: 'yellow'
    },
    base_toggle: {
      icon: 'folder open',
      color: 'yellow'
    },
    table: {
      icon: 'table',
      color: 'blue'
    },
    file: {
      icon: 'file outline',
      color: 'blue'
    }
  }

  /*   生命周期   */
  componentWillReceiveProps(nextProps) {
    this.index = 0;
    this.formattingData( this.handleRepeatName(nextProps.data) );
  }


  componentWillMount() {
    this.formattingData( this.handleRepeatName(this.props.data) );
  }


  /**
   * [handleRepeatName 处理每个根节点层的数据项名重复]
   * @param  {Object} data [根节点层数据]
   */
  handleRepeatName = (data) => {
    let formattedData = Object.assign({}, data);

    const { children } = formattedData;
    if(!children || !children.length) return formattedData;

    // 递归遍历函数
    const iteration = (iData) => {
      iData.fName = iData.name + this.index++;
      if (iData.children && iData.children.length) {
        iData.children.map((child) => {
          iteration(child);
        });
      }
    }

    // 开始递归遍历节点数据
    iteration(formattedData);

    return formattedData;
}

  /**
   * [formattedData 格式化接收到的资源树数据]
   * @param data {Object} [根组件的数据]
   */
  formattingData = (data) => {
    let formattedData = {
      name: data.name,
      flag: data.flag,
      fName: data.fName,
      ['child_' + data.fName]: {  // 根节点属性
        father: null,
        name: data.name,
        checked: (this.state['child_' + data.fName] && this.state['child_' + data.fName].checked) || false,
        isFolding: (this.state['child_' + data.fName] && this.state['child_' + data.fName].isFolding) || true,
        children: data.children && data.children.map((child) => {
          return 'child_' + child.fName;
        })
      }
    };

    const { children, name, fName } = data;
    if(!children || !children.length) return this.setState(formattedData);

    // 递归遍历函数
    const iteration = (iData, iName) => {

      if (iData.children && iData.children.length) {

        let _isFolding = true;
        if (this.state_clone['child_' + iData.fName]) {
          _isFolding = this.state_clone['child_' + iData.fName] ?
                      (this.state_clone['child_' + iData.fName].isFolding ? true : false) : true ;
        }else {
          _isFolding = this.state['child_' + iData.fName] ?
                      (this.state['child_' + iData.fName].isFolding ? true : false) : true ;
        }

        formattedData['child_' + iData.fName] = {
          father: 'child_' + iName,
          name: iData.name,
          checked: (this.state['child_' + iData.fName] &&
                    this.state['child_' + iData.fName].checked) || false,
          isFolding: _isFolding,

          children: iData.children.map((child) => {
            iteration(child, iData.fName);
            return 'child_' + child.fName
          })
        };

      }else {
        let _isFolding = true;
        if (this.state_clone['child_' + iData.fName]) {
          _isFolding = this.state_clone['child_' + iData.fName] ?
                      (this.state_clone['child_' + iData.fName].isFolding ? true : false) : true ;
        }else {
          _isFolding = this.state['child_' + iData.fName] ?
                      (this.state['child_' + iData.fName].isFolding ? true : false) : true ;
        }

        formattedData['child_' + iData.fName] = {
          father: 'child_' + iName,
          name: iData.name,
          checked: (this.state['child_' + iData.fName] &&
                   this.state['child_' + iData.fName].checked) || false,
          isFolding: _isFolding,

          children: null
        }
      }
    };


    // 开始递归遍历节点数据
    children.map((child) => {
      iteration(child, fName);
    });
    // 保存克隆数据
    this.state_clone = formattedData;
    this.setState(formattedData);
  }

  /**
   * [getRealActiveItem 获取节点真实数据-原始数据为了防止重名做了去重处理]
   * @param  {Object} nodeData [节点数据]
   */
  getRealActiveItem = (nodeData) => {
    let father, children;

    if (nodeData.father && this.state[nodeData.father]) {
      father = this.state[nodeData.father].name;
      nodeData = Object.assign({}, nodeData, {
        father: father,
      });
    }

    if (nodeData.children && nodeData.children.length) {
      nodeData = Object.assign({}, nodeData, {
        children: nodeData.children.map((child) => {
          return this.state[child].name
        })
      });
    }

    return nodeData;
  }

  /**
   * [getChecked 获取所有选中状态的节点]
   */
  getChecked = () => {
    const { getChecked } = this.props;
    if (typeof getChecked !== 'function') return;
    let checkedArray = [];

    Object.keys(this.state).map((key) => {
        if (key.indexOf('child_') == 0) {
          if (this.state[key].checked) {
            checkedArray.push(
              this.getRealActiveItem(this.state[key])
            );
          }
        }
    });

    getChecked(this.state.name, checkedArray);
  }

  /**
   * [setCheckedSingle 单选条件下设置节点选中状态]
   * @type {[type]}
   */
  setCheckedSingle = (name, status) => {
    const { getChecked } = this.props;
    let temp = {};
    let children = Object.keys(this.state).map((key) => {
      if (key === `child_${name}`) {
        temp[key] =
          Object.assign({}, this.state[key], {
            checked: status
          });
      }else if (key.indexOf('child_') === 0 && this.state[key].checked) {
        temp[key] =
          Object.assign({}, this.state[key], {
            checked: false
          })
      }
    });

    this.setState(temp, () => {

      if (typeof getChecked !== 'function') return;
      this.getChecked();

    });
  }

  /**
   * [setChecked 多选条件下设置节点选中状态]
   * @param name {String} [触发选中的节点名]
   * @param status {Boolean} [需要更改的选中状态]
   */
  setChecked = (name, status) => {
    let childName = `child_${name}`;
    const state = this.state;
    const child = this.state[childName];
    // 缓存一次更新
    let temp = {};

    /* ------------------- 根据节点所处的位置同时更新父节点 ------------------- */

    // 更新父节点
    const setFatherChecked = (node, status) => {
      temp[node] = Object.assign({}, state[node], { checked: status });

      // 选中
      if (status) {

        let _father = state[node].father;
        if (_father && state[_father]) {
            let _children = state[_father].children;

            let bb =
                _children && _children.length &&
                _children.every((_child) => {
                  if (_child == node) return status;
                  return (state[_child].checked);
                });

            // 孩子全部选中
            if (bb) {
              setFatherChecked(_father, true);
            }
        }

      // 取消选中
      }else {

        let _father = state[node].father;
        if (_father && state[_father]) {
            let _children = state[_father].children;

            let bb =
                _children && _children.length &&
                _children.every((_child) => {
                  return (state[_child].checked);
                });

            // 孩子全部选中
            if (bb) {
              setFatherChecked(_father, false);
            }
        }
      }

    };

    /* ------------------- 根据节点所处的位置同时更新子节点 ------------------- */
    const setChildrenChecked = (node, status) => {
      let children = state[node].children;
      if(!children || !children.length) return;

      // 迭代逻辑
      const _setChecked = (_node, status) => {
        temp[_node] = Object.assign({}, state[_node], { checked: status, isFolding: false });

        let _children = state[_node].children;
        if(!_children || !_children.length) return;

        _children.map(( _child) => {
          _setChecked(_child, status)
        });
      };

      // 开始迭代
      children.map((_child) => {
        _setChecked(_child, status);
      });

    };


    // 开始执行节点父级和子级 checked 状态更改
    setFatherChecked(childName, status);
    setChildrenChecked(childName, status);

    this.setState(temp, () => {
      this.getChecked();
    });
  }

  // 切换子组件折叠显示
  setFolding = (name, status) => {
    const {isFolding} = this.state['child_' + name];

    const temp = Object.assign({}, this.state['child_' + name], { isFolding: !isFolding });
    this.setState({
      ['child_' + name]: temp
    });
    // 更新克隆数据
    this.state_clone['child_'+name].isFolding = !isFolding;
  }

  // 手动触发
  toggleChecked = (e, {checked}) => {
    this.setChecked(this.state.fName, checked);
  }

  // 切换折叠显示
  toggleFolding = () => {
    this.setState({
      isFolding: !this.state.isFolding
    });
  }

  // 得到激活节点的数据
  setActiveItem = (item, flag) => {
    const { setActiveItem } = this.props;
    setActiveItem(item, flag, this.state.name);
  }


  /* ------------------- DOM构造 ------------------- */

  // checkbox
  checkboxContent = (checkable, checked, singleChecked) => {
    if (checkable) {
      if (singleChecked) {
        return null;
      }
      return(
        <div style={{display: 'table-cell',paddingRight: '0.5rem'}}>
          <Checkbox onChange={this.toggleChecked} checked={checked}/>
        </div>
      );
    }

    return null;
  }

  // 创建子级资源树
  generateItemTree = (nodeData, isFolding) => {
    const { children } = nodeData;
    const { checkable, singleChecked, baseIcon, baseColor } = this.props;
    if (!children || !children.length) return null;

    // 传递选中状态
    let childrenInfo = {};

    Object.keys(this.state).map((key) => {
        if (key.indexOf('child_') == 0) {
          childrenInfo[key] = this.state[key];
        }
    });

    const listStyle = isFolding ? 'none' : 'block';
    return (
      <List.List className='List-List' style={{display: listStyle}}>
        {
          children.map((child) => {
            return (
              <ListItem
                key={child.name + Lodash.uniqueId()}
                nodeData={child}
                baseIcon={baseIcon}
                baseColor={baseColor}
                childrenInfo={childrenInfo}
                getChecked={this.getChecked}
                setActiveItem={this.setActiveItem}
                setChecked={this.setChecked}
                setCheckedSingle={this.setCheckedSingle}
                singleChecked={singleChecked}
                setFolding={this.setFolding}
                checked={this.state['child_'+child.fName].checked}
                checkable={checkable}
              />
            );
          })
        }
      </List.List>
    )

  }


  render() {

    const {
      data, checkable, rightClickMenu,
      singleChecked, baseIcon, baseColor
    } = this.props;
    const { flagMap } = this;
    const { checked } = this.state['child_' + this.state.fName];
    const { isFolding } = this.state;
    const { flag } = data;

    let listIconName;  // icon 图标名
    let listIconColor;  // icon 颜色

    if (baseIcon && (flag === 'base' || !flag)) {
        listIconName = baseIcon;
    }else {
      listIconName = flag ? flagMap[flag].icon : flagMap['base'].icon;
      listIconName = (listIconName === flagMap['base'].icon && !isFolding) ?
        flagMap['base_toggle'].icon :
        listIconName;
    }

    if (baseColor && (flag === 'base' || !flag)) {
      listIconColor = baseColor;
    }else {
      listIconColor = flag ? flagMap[flag].color : flagMap['base'].color;
    }
    const listHeaderClass =
      (isFolding || flag != 'base') ?
      'List-Header' : 'List-Header List-Header-Active';

    return (
      <List.Item>
        {
          this.checkboxContent(checkable, checked, singleChecked)
        }

        <List.Icon
          name={listIconName}
          onClick={
            () => {
              this.toggleFolding();
              this.setActiveItem(
                this.getRealActiveItem(this.state[`child_${this.state.fName}`]),
                data.flag
              );
            }
          }
          className='List-Icon'
          color={listIconColor}
        />
        <List.Content>
          <List.Header
            onClick={
              () => {
                this.toggleFolding();
                this.setActiveItem(
                  this.getRealActiveItem(this.state[`child_${this.state.fName}`]),
                  data.flag
                );
              }
            }
            className={listHeaderClass}
          >

            <div
              className='list-header-text'
              data-rightClickMenu={rightClickMenu ? true : false}
            >
              {data.name}
            </div>

          </List.Header>
          {
            this.generateItemTree(data, isFolding)
          }

        </List.Content>

      </List.Item>

    )
  }
}


/* ************************* 资源树组件 ************************* */
class SourceTree extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeItem: null,   // 目前点击时选中的节点
      checkable: false,    // 节点是否支持选中
      rightClickMenu: false    // 是否支持右键菜单
    };
  }

  // 点击选中节点
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  // 设置节点选中状态
  setChecked = () => {

  }

  // 处理资源树的点击
  setActiveItem = (item, flag, root) => {
    const { setActiveItem } = this.props;

    if (typeof setActiveItem === 'function') {
      setActiveItem(item, flag, root);
    }
  }

  render() {
    const { activeItem } = this.state;
    const {
      menuItems, menuHandler, checkable,
      rightClickMenu, treeData, getChecked,
      singleChecked, baseIcon, baseColor
    } = this.props;

    const mainContent = (
      <List>
        {
          treeData.map((data, index) => {
            return (
              <RootListItem
                key={data.name + index}
                data={data}
                baseIcon={baseIcon}
                baseColor={baseColor}
                singleChecked={singleChecked}
                setActiveItem={this.setActiveItem}
                getChecked={getChecked}
                checkable={checkable || this.state.checkable}
                rightClickMenu={rightClickMenu}
              />
            )
          })
        }
      </List>
    );

    return (
      rightClickMenu ?
        (<RightClickMenu
          menuItems={menuItems}
          menuHandler={menuHandler}
        >
          { mainContent }
        </RightClickMenu>)
        :
        mainContent
    )
  }
}

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

  /*   在回调函数里可以取得资源树返回的数据，比如切换选中状态时，
       我们传入的getChecked函数就会被调用并携带上所有被选中元素的数组   */
  getChecked: PropTypes.func,  //  获取所有选中元素的函数 - [回调函数] - 非必要参数
  setActiveItem: PropTypes.func,  // 设置当前激活项 - [回调函数] - 非必要参数
  menuHandler: PropTypes.func,  // 右键菜单点击菜单项的事件处理 - [回调函数] - 非必要参数
};

SourceTree.defaultProps = {
  checkable: false,  // 默认不支持选中功能
  singleChecked: false,  // 选中状态下默认是单选
  rightClickMenu: false  // 默认不支持右键菜单
}

export default SourceTree;
