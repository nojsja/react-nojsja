import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';
import TreeClass from './Tree';
import './styles/editable-tree.css';

import Lang from './lang';
import { getRandomString, deepComparison, deepClone } from './utils';

const lang = Lang();

class EditableTree extends Component {
  state = {
    treeData: [],
    expandedKeys: [],
    enableYaml: false,
    maxLevel: 50,
    lang: 'zh_CN'
  };
  dataOrigin = []
  treeModel = null
  key=getRandomString()

  componentDidMount() {
    const { data, maxLevel = 50, enableYaml, lang="zh_CN" } = this.props;
    if (data) {
      this.dataOrigin = data;
      // default value wrapper
      TreeClass.defaultTreeValueWrapper(this.dataOrigin);
      TreeClass.levelDepthWrapper(this.dataOrigin);
      const formattedData = this.formatTreeData(this.dataOrigin);
      this.updateTreeModel({ data: this.dataOrigin, key: this.key });
      const keys = TreeClass.getTreeKeys(this.dataOrigin);
      this.onDataChange(this.dataOrigin);
      this.setState({
        treeData: formattedData,
        expandedKeys: keys,
        enableYaml: !!enableYaml,
        maxLevel: maxLevel,
        lang
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data, maxLevel = 50, enableYaml, lang="zh_CN" } = nextProps;

    this.setState({ enableYaml: !!enableYaml, lang, maxLevel });

    try {
      if (
        !deepComparison(
          TreeClass.getNudeTreeData(deepClone(this.dataOrigin)),
          TreeClass.getNudeTreeData(deepClone(data))
        )) {
        this.dataOrigin = data;
        // default value wrapper
        TreeClass.defaultTreeValueWrapper(this.dataOrigin);
        TreeClass.levelDepthWrapper(this.dataOrigin);
        // render tree node
        const formattedData = this.formatTreeData(this.dataOrigin);
        this.updateTreeModel({ data: this.dataOrigin, key: this.key });
        const keys = TreeClass.getTreeKeys(this.dataOrigin);
        this.onDataChange(this.dataOrigin);
        this.setState({
          treeData: formattedData,
          expandedKeys: keys
        });
      }
    } catch (error) {
      console.log(error, '----');
    }
  }

  /* modify a tree node */
  modifyNode = (key, treeNode) => {
    const modifiedData = this.treeModel.modifyNode(key, treeNode);
    if (modifiedData) {
      this.setState({
        treeData: this.formatTreeData(modifiedData),
      }, () => this.onDataChange(this.dataOrigin));
    }
    return modifiedData;
  }

  /* edit a tree node */
  getInToEditable = (key, treeNode) => {
    const modifiedData = this.treeModel.getInToEditable(key, treeNode);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    });
  }

  /* add a sister node for now level */
  addSisterNode = (key) => {
    const modifiedData = this.treeModel.addSisterNode(key);
    TreeClass.levelDepthWrapper(this.dataOrigin);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, () => this.onDataChange(this.dataOrigin));
  }

  /* add a sub node for now level */
  addSubNode = (key, props) => {
    const modifiedData = this.treeModel.addSubNode(key, props);
    TreeClass.levelDepthWrapper(this.dataOrigin);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, this.onDataChange(this.dataOrigin));
  }

  /* add a node fragment */
  addNodeFragment = (key, props) => {
    const modifiedData = this.treeModel.addNodeFragment(key, props);
    console.log(modifiedData);
    if (modifiedData) {
      TreeClass.levelDepthWrapper(this.dataOrigin);
      this.setState({
        treeData: this.formatTreeData(modifiedData),
      }, this.onDataChange(this.dataOrigin));
    }
    return modifiedData;
  }

  /* remove a node */
  removeNode = (key) => {
    const modifiedData = this.treeModel.removeNode(key);
    TreeClass.levelDepthWrapper(this.dataOrigin);
    this.setState({
      treeData: this.formatTreeData(modifiedData),
    }, this.onDataChange(this.dataOrigin));
  }

  /* render tree node */
  formatNodeData = (treeData) => {
    let tree = {};
    const key = treeData.key || `${this.key}_${treeData.id}`;
    if (treeData.toString() === '[object Object]' && tree !== null) {
      tree.key = key;
      treeData.key = key;
      tree.title =
        (<TreeNode
          maxLevel={this.state.maxLevel}
          treeData={treeData}
          enableYaml={this.state.enableYaml}
          modifyNode={this.modifyNode}
          addSisterNode={this.addSisterNode}
          addExpandedKey={this.addExpandedKey}
          getInToEditable={this.getInToEditable}
          addSubNode={this.addSubNode}
          addNodeFragment={this.addNodeFragment}
          removeNode={this.removeNode}
          lang={lang(this.state.lang)}
        />);
      if (treeData.nodeValue instanceof Array) tree.children = treeData.nodeValue.map(d => this.formatNodeData(d));
    } else {
      tree = '';
    }
    return tree;
  }

  /* format tree data */
  formatTreeData = (treeData) => {
    let tree = [];
    if (treeData instanceof Array) {
      tree = treeData.map(treeNode => this.formatNodeData(treeNode));
    }
    return tree;
  }

  /* update tree model */
  updateTreeModel = (props) => {
    if (this.treeModel) {
      this.treeModel.update(props);
    } else {
      const _lang = lang(this.state.lang);
      this.treeModel = new TreeClass(
        props.data,
        props.key,
        {
          maxLevel: this.state.maxLevel,
          overLevelTips: _lang.template_tree_max_level_tips,
          completeEditingNodeTips: _lang.pleaseCompleteTheNodeBeingEdited,
          addSameLevelTips: _lang.extendedMetadata_same_level_name_cannot_be_added,
        }
      );
    }
  }

  /* expand/unexpand */
  onExpand = (expandedKeys, { expanded: bool, node }) => {
    this.setState({
      expandedKeys,
    });
  }

  /* save keys of expanded nodes */
  addExpandedKey = (key) => {
    key = key instanceof Array ? key : [key];
    this.setState({
      expandedKeys: Array.from(new Set([...this.state.expandedKeys, ...key])),
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
  data: PropTypes.array.isRequired, // tree data, required
  onDataChange: PropTypes.func, // data change callback, default none
  maxLevel: PropTypes.number, // tree max level, default 50
  lang: PropTypes.string, // lang - zh_CN/en_US, default zh_CN
  enableYaml: PropTypes.bool, // enable it if you want to parse yaml string when adding a new node, default false
};

export default EditableTree;
