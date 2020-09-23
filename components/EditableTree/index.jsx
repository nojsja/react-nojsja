import React, { Component } from 'react';
import { Spin, Tree, Input, Row, Col, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';
import TreeClass from './Tree';
import './index.less';

import { getRandomString, deepComparison } from '../utils';


@inject('lang')
@observer
class EditableTree extends Component {
  state = {
    treeData: [],
    expandedKeys: [],
    focusKey: '',
  };
  maxLevel= 50
  dataOrigin = []
  treeModel = null
  key=getRandomString()

  componentDidMount() {
    const { data, maxLevel = 50 } = this.props;
    this.maxLevel = maxLevel;
    if (data) {
      this.dataOrigin = toJS(data);
      // 生成默认值
      TreeClass.defaultTreeValueWrapper(this.dataOrigin);
      const formattedData = this.formatTreeData(this.dataOrigin);
      this.updateTreeModel();
      const keys = TreeClass.getTreeKeys(this.dataOrigin);
      this.onDataChange(this.dataOrigin);
      this.setState({
        treeData: formattedData,
        expandedKeys: keys,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { data, maxLevel = 50 } = nextProps;
    this.maxLevel = maxLevel;
    data = toJS(data);
    try {
      if (
        !deepComparison(
          TreeClass.getNudeTreeData(JSON.parse(JSON.stringify(this.dataOrigin))),
          TreeClass.getNudeTreeData(JSON.parse(JSON.stringify(data)))
        )) {
        this.dataOrigin = data;
        // 生成默认值
        TreeClass.defaultTreeValueWrapper(this.dataOrigin);
        const formattedData = this.formatTreeData(this.dataOrigin);
        this.updateTreeModel();
        const keys = TreeClass.getTreeKeys(this.dataOrigin);
        this.onDataChange(this.dataOrigin);
        this.setState({
          treeData: formattedData,
          expandedKeys: keys,
        });
      }
    } catch (error) {
      console.log(error, '----');
    }
  }

  /* 修改节点 */
  modifyNode = (key, treeNode) => {
    const modifiedData = this.treeModel.modifyNode(key, treeNode);
    console.log('modify node: ', this.dataOrigin);
    if (modifiedData) {
      this.setState({
        treeData: this.formatTreeData(modifiedData),
      }, () => this.onDataChange(this.dataOrigin));
    }
    return modifiedData;
  }

  /* 进入编辑模式 */
  getInToEditable = (key, treeNode) => {
    const modifiedData = this.treeModel.getInToEditable(key, treeNode);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    });
  }

  /* 添加一个兄弟节点 */
  addSisterNode = (key) => {
    const modifiedData = this.treeModel.addSisterNode(key);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, () => this.onDataChange(this.dataOrigin));
  }

  /* 添加一个子结点 */
  addSubNode = (key) => {
    const modifiedData = this.treeModel.addSubNode(key);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, this.onDataChange(this.dataOrigin));
  }

  /* 移除一个节点 */
  removeNode = (key) => {
    const modifiedData = this.treeModel.removeNode(key);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, this.onDataChange(this.dataOrigin));
  }

  /* 生成树节点数据 */
  formatNodeData = (treeData) => {
    let tree = {};
    const key = `${this.key}_${treeData.id}`;
    if (treeData.toString() === '[object Object]' && tree !== null) {
      tree.key = key;
      treeData.key = key;
      tree.title =
        (<TreeNode
          setParent={this.setAttr}
          focusKey={this.state.focusKey}
          treeData={treeData}
          modifyNode={this.modifyNode}
          addSisterNode={this.addSisterNode}
          addExpandedKey={this.addExpandedKey}
          getInToEditable={this.getInToEditable}
          addSubNode={this.addSubNode}
          removeNode={this.removeNode}
          setFocus={this.setFocus}
        />);
      if (treeData.nodeValue instanceof Array) tree.children = treeData.nodeValue.map(d => this.formatNodeData(d));
    } else {
      tree = '';
    }
    return tree;
  }

  /* 生成树数据 */
  formatTreeData = (treeData) => {
    let tree = [];
    if (treeData instanceof Array) {
      tree = treeData.map(treeNode => this.formatNodeData(treeNode));
    }
    return tree;
  }

  /* 更新TreeModel */
  updateTreeModel = () => {
    this.treeModel = new TreeClass(
      this.dataOrigin,
      this.key,
      {
        maxLevel: this.maxLevel,
        overLevelTips: this.props.lang.lang.template_tree_max_level_tips,
        completeEditingNodeTips: this.props.lang.lang.pleaseCompleteTheNodeBeingEdited,
        addSameLevelTips: this.props.lang.extendedMetadata_same_level_name_cannot_be_added,
      }
    );
  }

  /* expand/unexpand */
  onExpand = (expandedKeys, { expanded: bool, node }) => {
    this.setState({
      expandedKeys,
    });
  }

  addExpandedKey = (key) => {
    this.setState({
      expandedKeys: [...this.state.expandedKeys, key],
    });
  }

  /* 设置焦点 */
  setAttr = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  /* data change hook */
  onDataChange = (modifiedData) => {
    const { onDataChange = () => {} } = this.props;
    onDataChange(modifiedData);
  }


  render() {
    const { treeData } = this.state;
    return (
      <div
        className="editable-tree-wrapper"
      >{
        (treeData && treeData.length) ?
          <Tree
            showLine
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            // defaultExpandedKeys={this.state.expandedKeys}
            defaultExpandAll
            treeData={treeData}
          />
        : null
      }
      </div>
    );
  }
}

EditableTree.propTypes = {
  data: PropTypes.array, // tree data
  onDataChange: PropTypes.func, // data change callback
};

export default EditableTree;