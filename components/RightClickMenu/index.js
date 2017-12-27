/**
 * @author NoJsJa
 */

import React, { Component, PropTypes } from 'react';
import {Menu} from 'semantic-ui-react';
import './index.scss';

/* -----------------------------------------------------------------------------
  右键菜单实现原理:
  右键菜单组件是一个高阶组件，可以包裹一个或多个其它子组件，利用浏览器事件冒泡机制实现事件委托，
  将所有资源树子节点的rightClick事件注册到资源树父节点上，父节点上的事件处理函数根据事件触发
  目标所携带的属性数据判断是否要进行右键菜单显示或是隐藏，子节点上的属性数据来自创建资源树的传入
  数据，所以可能组件使用者接收到后台数据后可能要对数据做一下预处理。预处理主要包括对数据的格式化，
  让数据格式符合资源树生成格式，以及添加额外的属性以支持右键菜单。
----------------------------------------------------------------------------- */

class RightClickMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAvailable: false,   // 控制菜单是否可见
      children: null,   // 需要重构的子元素
      activeItem: null,   // 被点击触发菜单的宿主元素
      presentName: null,    // 菜单点击后选择的元素
      position: {     // 控制菜单位置
        top: '0px',
        left: '0px'
      }
    }
  }

  /* ------------------- 创建右键菜单子项目 ------------------- */
  buildMenuItem = (items, handler) => {

    if (Array.isArray(items)) {

      const { presentName } = this.state;
      return items.map((item, index) => {
        return (
          <Menu.Item
            key={item.name + index}
            name={item.name}
            title={item.title}
            active={presentName === item.name}
            onClick={() => this.handleItemClick(item.name, item.title, handler)}
          />
        )
      });
    }else {
      return null;
    }
  }

  /* ------------------- 切换显示 ------------------- */
  show = () => {
    this.setState({
      isAvailable: true
    });
  }
  close = () => {
    this.setState({
      isAvailable: false
    });
  }

  // 获取鼠标的位置
  getMousePosition = (event) => {
    const e = event || window.event;

    const x = (e.pageX || e.clientX);
    const y = (e.pageY || e.clientY);

    return { left: x, top: y };
  }

  /* ------------------- 右键菜单的点击事件处理 ------------------- */

  // 右键点击激活右键菜单事件处理
  handleRightClick = (e) => {
    e.preventDefault();

    const target = e.target;
    const isAvailable = target.getAttribute('data-rightClickMenu');
    const position = this.getMousePosition(e);

    if (eval(isAvailable)) {
      this.setState({
        activeItem: target.innerText,
        isAvailable: true,
        position
      });
    }
    return false;
  }

  // 点击菜单项事件处理
  handleItemClick = (name, title, handler) => {
    this.setState({
      presentName: name
    });
    // 触发回调函数
    if (handler) {
      handler(title);
    }
  }

  /* ------------------- 右键菜单的初始化处理 ------------------- */

  // 包裹子组件,通过克隆组件为组件添加右键点击事件
  buildChildrenWrapper = (children) => {
    if (Array.isArray(children)) {
      const childElements =
        children.map((child, index) => {
          return React.cloneElement(child, {
            onContextMenu: this.handleRightClick
          });
      });
      this.setState({
        children: childElements
      });

    }else {
      const child =  React.cloneElement(children, {
          onContextMenu: this.handleRightClick
      });

      this.setState({
        children: child
      });
    }

    // 注册菜单取消事件
    document.addEventListener('click', this.close);
  }

  /* ------------------- 检查是否需要重构子组件 ------------------- */
  componentDidMount() {
    const { menuItems, children } = this.props;
    if (menuItems && menuItems.length) {
      this.buildChildrenWrapper(children);
    }else {
      this.setState({
        children: children
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.close);
  }

  render() {

    const { presentItem, isAvailable, position } = this.state || {};
    const { menuItems, menuHandler } = this.props;

    // 控制右键菜单样式和隐藏
    const isMenuAvailable = !isAvailable ?
      {
        display: 'none',
        position: 'fixed'
      } :
      {
        display: 'block',
        position: 'fixed',
        'zIndex': 99,
        left: position.left,
        top: position.top,
        borderRadius: '0px',
        boxShadow: '0 0 5px black'
      };

    return (
      <div className='right-click-menu' style={{cursor: 'pointer'}}>
        <div style={isMenuAvailable}>
          <Menu vertical size='tiny'>

          <Menu.Item>
            <Menu.Menu>
              {
                this.buildMenuItem(menuItems, menuHandler)
              }
            </Menu.Menu>
          </Menu.Item>

          </Menu>
        </div>

        {this.state.children}

      </div>
    )
  }

};

RightClickMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string
    })
  ).isRequired,
  handler: PropTypes.func
};


export default RightClickMenu;
