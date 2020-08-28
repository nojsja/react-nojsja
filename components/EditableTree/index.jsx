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
    maxLevel: 50,
  };
  dataOrigin = []
  treeModel = null
  key=getRandomString()

  componentDidMount() {
    const { data, maxLevel = 50 } = this.props;
    if (data) {
      this.dataOrigin = toJS(data);
      // 生成默认值
      TreeClass.defaultTreeValueWrapper(this.dataOrigin);
      const formattedData = this.formatTreeData(this.dataOrigin);
      const keys = TreeClass.getTreeKeys(this.dataOrigin);
      this.setState({
        treeData: formattedData,
        maxLevel,
        expandedKeys: keys,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { data, maxLevel = 50 } = nextProps;
    data = toJS(data);
    if (!deepComparison(this.dataOrigin, data)) {
      this.dataOrigin = data;
      // 生成默认值
      TreeClass.defaultTreeValueWrapper(this.dataOrigin);
      const formattedData = this.formatTreeData(this.dataOrigin);
      const keys = TreeClass.getTreeKeys(this.dataOrigin);
      this.onDataChange(this.dataOrigin);
      this.setState({
        treeData: formattedData,
        maxLevel,
        expandedKeys: keys,
      });
    }
  }

  /* 修改节点 */
  modifyNode = (key, treeNode) => {
    const modifiedData = this.treeModel.modifyNode(key, treeNode);
    console.log('modifyNode: ', key, modifiedData);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, () => this.onDataChange(this.dataOrigin));
  }

  /* 进入编辑模式 */
  getInToEditable = (key, treeNode) => {
    const modifiedData = this.treeModel.getInToEditable(key, treeNode);
    console.log('get in edit Node: ', key, modifiedData);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, () => this.onDataChange(this.dataOrigin));
  }

  /* 添加一个兄弟节点 */
  addSisterNode = (key) => {
    const modifiedData = this.treeModel.addSisterNode(key);
    console.log('sister: ', key, modifiedData);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, () => this.onDataChange(this.dataOrigin));
  }

  /* 添加一个子结点 */
  addSubNode = (key) => {
    const modifiedData = this.treeModel.addSubNode(key);
    console.log('subNode: ', key, modifiedData);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, this.onDataChange(this.dataOrigin));
  }

  /* 移除一个节点 */
  removeNode = (key) => {
    const modifiedData = this.treeModel.removeNode(key);
    console.log('remove: ', key, modifiedData);
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
    this.treeModel = new TreeClass(
      this.dataOrigin,
      this.key,
      {
        maxLevel: this.state.maxLevel,
        overLevelTips: this.props.lang.lang.template_tree_max_level_tips,
        completeEditingNodeTips: this.props.lang.lang.pleaseCompleteTheNodeBeingEdited,
        addSameLevelTips: this.props.lang.extendedMetadata_same_level_name_cannot_be_added,
      }
    );
    return tree;
  }

  /* expand/unexpand */
  onExpand = (expandedKeys, { expanded: bool, node }) => {
    this.setState({
      expandedKeys,
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