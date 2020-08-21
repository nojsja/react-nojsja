import { getRandomString, typeCheck } from '../utils';
import openNotification from '../noticeFilter';

// @inject('lang')
// @observer
export default class Tree {
  constructor(data, treeKey, {
    maxLevel,
    overLevelTips = '已经限制模板树的最大深度为：',
    addSameLevelTips = '同层级已经有同名节点被添加！',
  }) {
    this.treeData = data;
    this.treeKey = treeKey;
    this.maxLevel = maxLevel;
    this.overLevelTips = overLevelTips;
    this.addSameLevelTips = addSameLevelTips;
  }

  /* 编辑/添加节点的时候检测同一层级是否有同名/同value节点 */
  static checkNodeIsExitsInSameLevel = (node, nodeArray = []) => {
    let checkLable = 'nodeName';
    if (!node.nodeName && !node.nodeValue) return false;
    if (!node.nodeName && node.nodeValue) {
      checkLable = 'nodeValue';
    }
    return !!nodeArray.find(item => (item[checkLable] === node[checkLable] && node.key !== item.key));
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

  getInToEditableOne(nodeArray, {
    nodeName, nodeValue, id, key, isInEdit,
  }) {
    for (let i = 0; i < nodeArray.length; i++) {
      const node = nodeArray[i];
      if (node.key === key) {
        const nodeIsExitsInSameLevel =
          Tree.checkNodeIsExitsInSameLevel({
            id, nodeName, nodeValue, key,
          }, nodeArray);
        if (nodeIsExitsInSameLevel) return openNotification('warning', null, this.addSameLevelTips);
        node.isInEdit = isInEdit;
      } else {
        node.isInEdit = false;
      }
      if (node.nodeValue && (node.nodeValue instanceof Array)) {
        this.getInToEditableOne(node.nodeValue, {
          isInEdit,
          nodeName,
          nodeValue,
          id,
          key,
        });
      }
    }
  }

  /* 进入编辑模式 */
  getInToEditable(key, {
    nodeName, nodeValue, id, isInEdit,
  } = {}) {
    const findInEdit = (items) => {
      let isEdit = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].isInEdit && items[i].key !== key) {
          isEdit = items[i];
        }
        if (typeCheck(items[i].nodeValue, 'array')) {
          isEdit = findInEdit(items[i].nodeValue);
        }
        if (isEdit) break;
      }
      return isEdit;
    };
    // console.log('find in edit:', findInEdit(this.treeData));
    // if (findInEdit(this.treeData)) return this.getTreeData();

    this.getInToEditableOne(this.treeData, {
      nodeName,
      nodeValue,
      isInEdit,
      key,
      id,
    });

    return this.getTreeData();
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
        const nodeIsExitsInSameLevel =
          Tree.checkNodeIsExitsInSameLevel({
            nodeName, nodeValue, key,
          }, nodeArray);
        if (nodeIsExitsInSameLevel) openNotification('warning', null, this.addSameLevelTips);
        node.nameEditable = nameEditable;
        node.valueEditable = valueEditable;
        node.nodeName = nodeName;
        node.nodeValue = nodeValue;
        node.nodeDeletable = nodeDeletable;
        node.isInEdit = nodeIsExitsInSameLevel ? node.isInEdit : isInEdit;
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
    nameEditable = true,
    valueEditable = true,
    nodeDeletable = true,
    isInEdit = false,
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
    nameEditable = true,
    valueEditable = true,
    nodeDeletable = true,
    isInEdit = false,
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
