import React, { Component } from 'react';
import { Row, message } from 'antd';

import { parse } from 'yaml';
import { typeCheck } from './utils';

import TreeClass from './Tree';
import TreeNodeActions from './TreeNodeActions';
import TreeNodeDisplay from './TreeNodeDisplay';
import TreeNodeNormalEditing from './TreeNodeNormalEditing';
import TreeNodeYamlEditing from './TreeNodeYamlEditing';

export default class TreeNode extends Component {
  state = {
    actionVisible: false,
  }
  nodeName=''
  nodeValue=''

  componentDidMount() {
    const {
      nodeName, nodeValue,
    } = this.props.treeData;
    this.nodeName = nodeName;
    this.nodeValue = nodeValue;
  }

  componentWillReceiveProps(nextProps) {
    const {
      nodeName, nodeValue,
    } = nextProps.treeData;
    this.nodeName = this.nodeName || nodeName;
    this.nodeValue = this.nodeValue || nodeValue;
  }

  setAttr = ({ key, value }) => {
    this.setState({
      [key]: value,
    });
  }

  /* toggle button visible */
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

  /* confirm to submit data */
  editConfirm = () => {
    const { treeData, modifyNode, lang} = this.props;
    if (!this.nodeName && !this.nodeValue) return message.warning(lang.pleaseInputKeyOrValue);
    if (!this.nodeName && (this.nodeValue instanceof Array)) return message.warning(lang.pleaseInputKey);
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

  /* check if yaml tree is valid */
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

  /* confirm to submit yaml string data */
  editYamlConfirm = () => {
    const { treeData, addNodeFragment, addExpandedKey, lang } = this.props;
    let yamlData;
    if (!this.nodeValue) return message.warning(lang.pleaseInputKeyOrValue);
    if (/^([\w\W]+:((\s)*-[\w\W]+)+([\w\W])*)+$/.test(this.nodeValue)) return message.warning(lang.json_format_invalid);

    try {
      yamlData = parse(this.nodeValue);
      if (
        (typeCheck(yamlData, 'array') ? yamlData : [yamlData])
          .some(item => !this.checkYamlTreeHadNullValue(item))
      ) {
        return message.warning(lang.json_format_invalid);
      }
      console.log('parsed: ', yamlData);
      yamlData = typeCheck(yamlData, 'array') ? yamlData.reduce((item, nowItem) => ({ ...item, ...nowItem }), {}) : yamlData;
    } catch (error) {
      return message.warning(lang.json_format_invalid);
    }
    if (!TreeClass.isNudeTemplateData(yamlData)) {
      return message.warning(lang.json_format_invalid);
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

  /* cancel submission */
  editCancel = () => {
    const { treeData, getInToEditable, lang } = this.props;
    if (!treeData.nodeName && !treeData.nodeValue) return this.removeNode();
    if (!treeData.nodeName && !treeData.nodeValue) return message.warning(lang.KeyAndValueIsNotAllEmpty);

    getInToEditable(treeData.key, {
      ...treeData,
      isInEdit: false,
    });
    this.setActionVisibleFalse();
  }

  /* enter edit mode */
  getInToEditable = () => {
    const { treeData, getInToEditable } = this.props;
    if (treeData.nameEditable || treeData.valueEditable) {
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
    const { treeData, maxLevel, enableYaml, lang } = this.props;
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
        <TreeNodeYamlEditing
          show={treeData.yaml && treeData.isInEdit && enableYaml}
          onNodeValueChange={this.onNodeValueChange}
          editYamlConfirm={this.editYamlConfirm}
          editCancel={this.editCancel}
          lang={lang}
        />
        <TreeNodeNormalEditing
          show={!treeData.yaml && treeData.isInEdit}
          editValueInputVisible={editValueInputVisible}
          onNodeNameChange={this.onNodeNameChange}
          treeData={treeData}
          onNodeValueChange={this.onNodeValueChange}
          editConfirm={this.editConfirm}
          editCancel={this.editCancel}
          lang={lang}
        />
        <TreeNodeDisplay
          editNameInputVisible={editNameInputVisible}
          treeData={treeData}
          getInToEditable={this.getInToEditable}
          editValueInputVisible={editValueInputVisible}
          lang={lang}
        />
        <TreeNodeActions
          actionVisible={this.state.actionVisible}
          actionAddNodeVisible={actionAddNodeVisible}
          addSisterNode={this.addSisterNode}
          addSubNode={this.addSubNode}
          addYamlNode={this.addYamlNode}
          removeNode={this.removeNode}
          nodeDeletable={treeData.nodeDeletable}
          depthOverflow={depthOverflow}
          enableYaml={enableYaml}
          isInEdit={treeData.isInEdit}
          lang={lang}
        />
      </Row>);
  }
}
