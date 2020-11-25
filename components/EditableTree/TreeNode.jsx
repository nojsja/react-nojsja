import React, { Component } from 'react';
import { Spin, Tree, Input, Row, Col, Tooltip, message } from 'antd';
import { observer, inject } from 'mobx-react';

import TreeClass from './Tree';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import { parse } from 'yaml';

import { fnDebounce, typeCheck, longNameFormatterNoTail } from 'utils/utils';

@inject('pub')
@observer
export default class TreeNode extends Component {
  state = {
    actionVisible: false,
  }
  nodeName=''
  nodeValue=''
  editNameInputRef = React.createRef();

  componentDidMount() {
    const {
      nodeName, nodeValue,
    } = this.props.treeData;
    this.nodeName = nodeName;
    this.nodeValue = nodeValue;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      nodeName, nodeValue,
    } = nextProps.treeData;
    this.nodeName = this.nodeName || nodeName;
    this.nodeValue = this.nodeValue || nodeValue;
    if (nextProps.focusKey === nextProps.treeData.key) {
      // this.editNameInputRef.current.focus();
    }
  }

  setAttr = ({ key, value }) => {
    this.setState({
      [key]: value,
    });
  }

  /* 设置操作按钮显示隐藏 */
  setActionVisibleTrue = (e) => {
    e && e.stopPropagation();
    this.setState({
      actionVisible: true,
    });
  }

  setActionVisibleFalse = (e) => {
    e && e.stopPropagation();
    this.setState({
      actionVisible: false,
    });
  }

  onNodeNameChange = (e) => {
    this.nodeName = e.target.value;
  }

  onNodeValueChange = (e) => {
    this.nodeValue = e.target.value;
  }

  editConfirm = () => {
    const { treeData, modifyNode } = this.props;
    if (!this.nodeName && !this.nodeValue) return message.warning(this.props.pub.lang.pleaseInputKeyOrValue);
    const isValid = modifyNode(treeData.key, {
      ...treeData,
      nodeName: this.nodeName,
      nodeValue: this.nodeValue,
      isInEdit: false,
    });
    if (isValid) {
      this.nodeName = '';
      this.nodeValue = '';
      this.setActionVisibleFalse();
    }
  }

  checkYamlTreeHadNullValue = (object) => {
    let isValid = true;
    for (const key in object) {
      if (!isValid) break;
      if (typeCheck(object[key], 'object')) {
        isValid = this.checkYamlTreeHadNullValue(object[key]);
      } else {
        isValid = !(object[key] === null);
      }
    }
    return isValid;
  }

  editYamlConfirm = () => {
    const { treeData, addNodeFragment, addExpandedKey } = this.props;
    let yamlData;
    if (!this.nodeValue) return message.warning(this.props.pub.lang.pleaseInputKeyOrValue);
    if (/^([\w\W]+:((\s)*-[\w\W]+)+([\w\W])*)+$/.test(this.nodeValue)) return message.warning(this.props.pub.lang.json_format_invalid);

    try {
      yamlData = parse(this.nodeValue);
      if (
        (typeCheck(yamlData, 'array') ? yamlData : [yamlData])
          .some(item => !this.checkYamlTreeHadNullValue(item))
      ) {
        return message.warning(this.props.pub.lang.json_format_invalid);
      }
      console.log('parsed: ', yamlData);
      yamlData = typeCheck(yamlData, 'array') ? yamlData.reduce((item, nowItem) => ({ ...item, ...nowItem }), {}) : yamlData;
    } catch (error) {
      return message.warning(this.props.pub.lang.json_format_invalid);
    }
    if (!TreeClass.isNudeTemplateData(yamlData)) {
      return message.warning(this.props.pub.lang.json_format_invalid);
    }
    const fragment = TreeClass.formatFragmentData(yamlData);

    const isValid = addNodeFragment(treeData.key, {
      ...treeData,
      fragment,
      isInEdit: false,
    });


    if (isValid) {
      addExpandedKey(TreeClass.getTreeKeys(fragment));
      console.log('valid： ', TreeClass.getTreeKeys(fragment));
      this.nodeName = '';
      this.nodeValue = '';
      this.setActionVisibleFalse();
    }
  }

  editCancel = () => {
    const { treeData, getInToEditable } = this.props;
    if (!treeData.nodeName && !treeData.nodeValue) return this.removeNode();
    if (!treeData.nodeName && !treeData.nodeValue) return message.warning(this.props.pub.lang.KeyAndValueIsNotAllEmpty);

    getInToEditable(treeData.key, {
      ...treeData,
      isInEdit: false,
    });
    this.setActionVisibleFalse();
  }

  getInToEditable = () => {
    const { treeData, getInToEditable } = this.props;
    if (treeData.nameEditable || treeData.valueEditable) {
      this.props.setParent('focusKey', treeData.key);
      getInToEditable(treeData.key, {
        ...treeData,
        isInEdit: true,
      });
    }
  }

  addSisterNode = () => {
    const { treeData, addSisterNode } = this.props;
    addSisterNode(treeData.key);
  }

  addSubNode = () => {
    const { treeData, addSubNode, addExpandedKey } = this.props;
    addSubNode(treeData.key);
    addExpandedKey(treeData.key);
  }

  addYamlNode = () => {
    const { treeData, addSubNode, addExpandedKey } = this.props;
    addSubNode(treeData.key, {
      yaml: true,
    });
  }

  removeNode = () => {
    const { treeData, removeNode } = this.props;
    console.log(treeData.key);
    removeNode(treeData.key);
  }


  render() {
    const { treeData, maxLevel } = this.props;
    const { lang } = this.props.pub;
    const editValueInputVisible = !(treeData.nodeValue instanceof Array);
    const editNameInputVisible = (!treeData.nodeName && !treeData.nodeValue) || treeData.nodeName || (treeData.nodeValue && typeCheck(treeData.nodeValue, 'array'));
    const actionAddNodeVisible = (treeData.nodeValue || treeData.nodeName) && (!treeData.nodeValue || treeData.nodeValue instanceof Array);
    const depthOverflow = treeData.depth >= maxLevel;
    return (
      <Row
        key={treeData.key}
        onMouseEnter={this.setActionVisibleTrue}
        onMouseLeave={this.setActionVisibleFalse}
      >
        {
          treeData.yaml &&
          treeData.isInEdit &&
          <React.Fragment>
            <span span={14}>
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                onChange={this.onNodeValueChange}
              />
            </span>
            <span span={10}>
              <span className="editable-tree-edit-confirm successColor">
                <Tooltip title={lang.confirm}>
                  <CheckOutlined onClick={this.editYamlConfirm} />
                </Tooltip>
              </span>
              <span className="editable-tree-edit-cancel warningColor">
                <Tooltip title={lang.cancel}>
                  <CloseOutlined onClick={this.editCancel} />
                </Tooltip>
              </span>
            </span>
          </React.Fragment>
        }
        {
          !treeData.yaml &&
          treeData.isInEdit &&
            (
              <React.Fragment>
                <span span={8}>
                  <Input
                    ref={this.editNameInputRef}
                    className="normal-text"
                    disabled={!treeData.nameEditable}
                    size="small"
                    onChange={this.onNodeNameChange}
                    defaultValue={treeData.nodeName}
                  />
                </span>
                ：
                {
                  (editValueInputVisible) &&
                  (<span span={8}>
                    <Input
                      className="normal-text"
                      size="small"
                      disabled={!treeData.valueEditable}
                      onChange={this.onNodeValueChange}
                      defaultValue={treeData.nodeValue}
                    />
                  </span>)
                }
                <span span={2}>
                  <span className="editable-tree-edit-confirm successColor">
                    <Tooltip title={lang.confirm}>
                      <CheckOutlined onClick={this.editConfirm} />
                    </Tooltip>
                  </span>
                  <span className="editable-tree-edit-cancel warningColor">
                    <Tooltip title={lang.cancel}>
                      <CloseOutlined onClick={this.editCancel} />
                    </Tooltip>
                  </span>
                </span>
              </React.Fragment>
            )
        }
        {
          !treeData.isInEdit &&
            (<React.Fragment>
              {
                (editNameInputVisible) &&
                (<span span={8} attr-key={treeData.key}>
                  {/* <Input
                    size="small"
                    className="normal-text"
                    disabled={!treeData.nameEditable}
                    onFocus={treeData.nameEditable ? this.getInToEditable : undefined}
                    defaultValue={treeData.nodeName}
                  /> */}
                  <Tooltip placement="bottom" title={(treeData.nodeName || '').length > 50 ? treeData.nodeName : ''}>
                    <span
                      onClick={(treeData.nameEditable) ? this.getInToEditable : undefined}
                      className="editable-tree-label normal-text"
                      // title={(treeData.nodeName || '').length > 50 ? treeData.nodeName : ''}
                    >{longNameFormatterNoTail(treeData.nodeName || '')}
                    </span>
                  </Tooltip>
                </span>)
              }
              {editNameInputVisible && <span>：</span>}
              {
                editValueInputVisible &&
                  <span span={8}>
                    {/* <Input
                      className="normal-text"
                      disabled={!treeData.valueEditable}
                      onFocus={treeData.valueEditable ? this.getInToEditable : undefined}
                      size="small"
                      defaultValue={treeData.nodeValue}
                    /> */}
                    <Tooltip placement="bottom" title={(treeData.nodeValue || '').length > 50 ? treeData.nodeValue : ''}>
                      <span
                        onClick={this.getInToEditable}
                        className="editable-tree-label normal-text"
                        // title={(treeData.nodeValue || '').length > 50 ? treeData.nodeValue : ''}
                      >{longNameFormatterNoTail(treeData.nodeValue || '')}
                      </span>
                    </Tooltip>
                  </span>
              }
            </React.Fragment>)
        }
        <span
          span={5}
        >
          {
          this.state.actionVisible ?
            <span className="editable-tree-node-action">
              {
                !treeData.isInEdit &&
                actionAddNodeVisible &&
                (<Tooltip title={lang.addSisterNode}> <i className="iconfont icon-sisternode" onClick={this.addSisterNode} /></Tooltip>)
              }
              {
                !treeData.isInEdit &&
                actionAddNodeVisible &&
                !depthOverflow &&
                (<Tooltip title={lang.addSubNode}><i className="iconfont icon-subnode" onClick={this.addSubNode} /></Tooltip>)
              }
              {
                !treeData.isInEdit &&
                actionAddNodeVisible &&
                (<Tooltip title={lang.addYamlNode}><i className="iconfont icon-node_multiple" onClick={this.addYamlNode} /></Tooltip>)
              }
              { treeData.nodeDeletable && <Tooltip title={lang.deleteLevel}> <i className="iconfont icon-delete" onClick={this.removeNode} /> </Tooltip>}
            </span>
          :
            <span className="editable-tree-node-action" />
          }
        </span>
      </Row>);
  }
}
