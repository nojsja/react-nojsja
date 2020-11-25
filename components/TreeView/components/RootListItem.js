import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {List, Icon, Input, Menu, Checkbox} from 'semantic-ui-react';
import ListItem from './ListItem';

/* ------------------- 资源树第一层根节点 ------------------- */
export class RootListItem extends Component {
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
    if (typeof setActiveItem === 'function') {
      setActiveItem(item, flag, this.state.name);
    }
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
          children.map((child, index) => {
            return (
              <ListItem
                key={child.name + index + child.fName}
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
              title={data.name}
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
