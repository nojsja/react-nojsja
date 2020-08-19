import { getRandomString } from '../utils';
import openNotification from 'utils/noticeFilter';

// @inject('lang')
// @observer
export default class Tree {
  constructor(data, treeKey, { maxLevel, overLevelTips = '' }) {
    this.treeData = data;
    this.treeKey = treeKey;
    this.maxLevel = maxLevel;
    this.overLevelTips = overLevelTips;
  }

  /* 默认值填充 */
  static defaultTreeValueWrapper(treeData) {
    if (!treeData || !(treeData instanceof Array)) return treeData;
    let emptyData;
    treeData.forEach((node) => {
      emptyData = {
        nodeName: '',
        nodeValue: '',
        nameEditable: true,
        valueEditable: true,
        isInEdit: false,
        nodeDeletable: true,
        ...node,
      };
      Object.keys(emptyData).forEach((k) => {
        node[k] = emptyData[k];
      });
      if (node.nodeValue instanceof Array) Tree.defaultTreeValueWrapper(node.nodeValue);
    });

    return treeData;
  }

  /* 获取各个层级的key */
  static getTreeKeys(treeData, keys = []) {
    if (!treeData || !(treeData instanceof Array)) return keys;
    treeData.forEach((node) => {
      keys.push(node.key);
      if (node.nodeValue instanceof Array) Tree.getTreeKeys(node.nodeValue, keys);
    });

    return keys;
  }

  /* 检查最大层级 */
  static getTreeMaxLevel(treeData, level = 0) {
    if (!treeData || !(treeData instanceof Array)) return 0;
    level += 1;
    treeData.forEach((node) => {
      if (node.nodeValue instanceof Array) level = Tree.getTreeMaxLevel(node.nodeValue, level);
    });

    return level;
  }

  modifyOneNode(nodeArray, {
    nodeName,
    nodeValue,
    nameEditable,
    valueEditable,
    nodeDeletable,
    isInEdit,
    key,
  }) {
    for (let i = 0; i < nodeArray.length; i++) {
      const node = nodeArray[i];
      if (node.key === key) {
        node.nameEditable = nameEditable;
        node.valueEditable = valueEditable;
        node.nodeName = nodeName;
        node.nodeValue = nodeValue;
        node.nodeDeletable = nodeDeletable;
        node.isInEdit = isInEdit;
        // break;
      } else {
        node.isInEdit = false;
      }
      if (node.nodeValue && (node.nodeValue instanceof Array)) {
        this.modifyOneNode(node.nodeValue, {
          nodeName,
          nodeValue,
          nameEditable,
          valueEditable,
          nodeDeletable,
          isInEdit,
          key,
        });
      }
    }
  }

  /* 修改一个节点数据 */
  modifyNode(key, {
    nodeName = '',
    nodeValue = '',
    nameEditable = true,
    valueEditable = true,
    nodeDeletable = true,
    isInEdit = false,
  } = {}) {
    this.modifyOneNode(this.treeData, {
      nodeName,
      nodeValue,
      nameEditable,
      valueEditable,
      nodeDeletable,
      isInEdit,
      key,
    });

    return this.getTreeData();
  }

  addOneSisterNode(nodeArray, {
    nodeName,
    nameEditable,
    valueEditable,
    nodeDeletable,
    isInEdit,
    nodeValue,
    key,
  }) {
    let node;
    let id;
    for (let i = nodeArray.length - 1; i >= 0; i--) {
      node = nodeArray[i];
      if (node.key === key) {
        id = getRandomString();
        nodeArray.push({
          nodeName,
          id,
          nameEditable,
          valueEditable,
          nodeDeletable,
          isInEdit,
          nodeValue,
          key: `${this.treeKey}_${id}`,
        });
        break;
      }
      if (node.nodeValue && (node.nodeValue instanceof Array)) {
        this.addOneSisterNode(node.nodeValue, {
          nodeName,
          nameEditable,
          valueEditable,
          nodeDeletable,
          isInEdit,
          nodeValue,
          key,
        });
      }
    }
  }

  /* 添加一个目标节点的兄弟结点 */
  addSisterNode(key, {
    nodeName = '',
    nameEditable = '',
    valueEditable = true,
    nodeDeletable = true,
    isInEdit = true,
    nodeValue = '',
  } = {}) {
    this.addOneSisterNode(this.treeData, {
      nodeName,
      nameEditable,
      valueEditable,
      nodeDeletable,
      isInEdit,
      nodeValue,
      key,
    });
    return this.getTreeData();
  }

  addOneSubNode(nodeArray, {
    nodeName,
    nameEditable,
    valueEditable,
    nodeDeletable,
    isInEdit,
    nodeValue,
    key,
  }) {
    let node;
    let id;
    for (let i = nodeArray.length - 1; i >= 0; i--) {
      node = nodeArray[i];
      if (node.key === key) {
        id = getRandomString();
        if (node.nodeValue && (!(node.nodeValue instanceof Array))) break;
        node.nodeValue = node.nodeValue || [];
        node.nodeValue.push({
          nodeName,
          id,
          nameEditable,
          valueEditable,
          nodeDeletable,
          isInEdit,
          nodeValue,
          key: `${this.treeKey}_${id}`,
        });
        break;
      }
      if (node.nodeValue && node.nodeValue instanceof Array) {
        this.addOneSubNode(node.nodeValue, {
          nodeName,
          nameEditable,
          valueEditable,
          nodeDeletable,
          isInEdit,
          nodeValue,
          key,
        });
      }
    }
  }

  /* 添加一个目标节点的子结点 */
  addSubNode(key, {
    nodeName = '',
    nameEditable = '',
    valueEditable = true,
    nodeDeletable = true,
    isInEdit = true,
    nodeValue = '',
  } = {}) {
    if (Tree.getTreeMaxLevel(this.treeData) > this.maxLevel) {
      openNotification('warning', null, this.overLevelTips + this.maxLevel);
    } else {
      this.addOneSubNode(this.treeData, {
        nodeName,
        nameEditable,
        valueEditable,
        nodeDeletable,
        isInEdit,
        nodeValue,
        key,
      });
    }
    return this.getTreeData();
  }

  /* 移除节点递归 */
  removeOneNode(key, nodeArray) {
    let node;
    let j;
    for (let i = nodeArray.length - 1; i >= 0; i--) {
      node = nodeArray[i];
      if (node.key === key) {
        nodeArray.splice(i, 1);
        break;
      }
      if (node.nodeValue && (node.nodeValue instanceof Array)) {
        j = node.nodeValue.findIndex(item => item.key === key);
        if (j !== -1) {
          node.nodeValue.splice(j, 1);
          node.nodeValue = (!node.nodeValue.length) ? '' : node.nodeValue;
          break;
        }
        this.removeOneNode(key, node.nodeValue);
      }
    }
  }

  /* 移除节点 */
  removeNode(key) {
    this.removeOneNode(key, this.treeData);
    return this.getTreeData();
  }

  getTreeData() {
    return JSON.parse(JSON.stringify(this.treeData));
  }
}
