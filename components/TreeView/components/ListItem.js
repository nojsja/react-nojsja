import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { List, Icon, Input, Menu, Checkbox } from 'semantic-ui-react';

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
                  key={child.name + index + child.fName}
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
                title={nodeData.name}
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

export default ListItem;