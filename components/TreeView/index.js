import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {List, Icon, Input, Menu, Checkbox} from 'semantic-ui-react';

import { RootListItem } from './components/RootListItem';
import { ListItem } from './components/ListItem';

import './style/style.css';

/* ************************* TreeView ************************* */
class TreeView extends Component {
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
      checkable,
      treeData, getChecked,
      singleChecked, baseIcon, baseColor
    } = this.props;

    return (
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
              />
            )
          })
        }
      </List>
    )
  }
}

TreeView.propTypes = {
  treeData: PropTypes.array.isRequired,  // 见顶部数据格式 - 必要参数
  baseIcon: PropTypes.string,  // base元素自定义图标名 - 参照semantic - 非必要参数
  baseColor: PropTypes.string,  // base元素自定义图标颜色 - 非必要参数
  checkable: PropTypes.bool,  // 资源树是否支持状态选中 - 非必要参数
  singleChecked: PropTypes.bool,  // 使用单选状态 - 默认是多选状态 - 非必要参数

  /*   在回调函数里可以取得资源树返回的数据，比如切换选中状态时，
       我们传入的getChecked函数就会被调用并携带上所有被选中元素的数组   */
  getChecked: PropTypes.func,  //  获取所有选中元素的函数 - [回调函数] - 非必要参数
  setActiveItem: PropTypes.func,  // 设置当前激活项 - [回调函数] - 非必要参数
};

TreeView.defaultProps = {
  checkable: false,  // 默认不支持选中功能
  singleChecked: false,  // 选中状态下默认是单选
}

export default TreeView;
