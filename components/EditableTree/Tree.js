import { getRandomString, typeCheck } from '../utils';
import openNotification from '../noticeFilter';

// @inject('lang')
// @observer
export default class Tree {
  constructor(data, treeKey, {
    maxLevel,
    overLevelTips = '已经限制模板树的最大深度为：',
    addSameLevelTips = '同层级已经有同名节点被添加！',
    completeEditingNodeTips = '请完善当前正在编辑的节点数据！',
  }) {
    this.treeData = data;
    this.treeKey = treeKey;
    this.maxLevel = maxLevel;
    this.overLevelTips = overLevelTips;
    this.completeEditingNodeTips = completeEditingNodeTips;
    this.addSameLevelTips = addSameLevelTips;
  }

  static getTargetLevel = (treeData, key, level = 0) => {
    const nextLevels = [];
    let breaked = false;
    if (!treeData || !(treeData instanceof Array)) return 0;
    level += 1;
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].key === key) {
        breaked = true;
        break;
      }
      nextLevels.push(...(treeData[i].nodeValue instanceof Array ? (treeData[i].nodeValue) : []));
    }
    if (nextLevels.length && !breaked) { level = Tree.getTargetLevel(nextLevels, key, level); }

    return level;
  }

  /* 获取用于比较的name/value裸数据 */
  static getNudeTreeData = (dataArray) => {
    let level;
    for (let i = 0; i < dataArray.length; i++) {
      level = {
        nodeName: dataArray[i].nodeName,
        nodeValue: typeCheck(dataArray[i].nodeValue, 'array') ?
          Tree.getNudeTreeData(dataArray[i].nodeValue) :
          dataArray[i].nodeValue,
      };
      dataArray[i] = level;
    }
    return dataArray;
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

  /* 编辑/添加节点的时候检测同一层级是否有同名/同value节点 */
  static checkNodeIsBeEditable = (key, nodeArray = []) => {
    let isEditable = true;
    nodeArray.forEach((nodeItem) => {
      if (isEditable) {
        if (nodeItem.key !== key && nodeItem.nodeName === '' && nodeItem.nodeValue === '') {
          isEditable = false;
        } else {
          isEditable = typeCheck(nodeItem.nodeValue, 'array') ? Tree.checkNodeIsBeEditable(key, nodeItem.nodeValue) : true;
        }
      }
    });
    return isEditable;
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

  /* 查询是否有节点正在编辑 */
  static findInEdit(items) {
    let isEdit = false;
    if (!typeCheck(items, 'array')) return isEdit;

    for (let i = 0; i < items.length; i++) {
      if (items[i].isInEdit) {
        isEdit = items[i];
      }
      if (!isEdit && typeCheck(items[i].nodeValue, 'array')) {
        isEdit = Tree.findInEdit(items[i].nodeValue);
      }
      if (isEdit) break;
    }
    return isEdit;
  }

  getInToEditableOne(nodeArray, {
    nodeName, nodeValue, id, key, isInEdit,
  }) {
    let node;
    for (let i = 0; i < nodeArray.length; i++) {
      node = nodeArray[i];
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
    if (Tree.checkNodeIsBeEditable(key, this.treeData)) {
      this.getInToEditableOne(this.treeData, {
        nodeName,
        nodeValue,
        isInEdit,
        key,
        id,
      });
    } else {
      openNotification('warning', null, this.completeEditingNodeTips);
    }

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
    let isValid = true;
    for (let i = 0; i < nodeArray.length; i++) {
      const node = nodeArray[i];
      if (node.key === key) {
        const nodeIsExitsInSameLevel =
          Tree.checkNodeIsExitsInSameLevel({
            nodeName, nodeValue, key,
          }, nodeArray);
        if (nodeIsExitsInSameLevel) {
          openNotification('warning', null, this.addSameLevelTips);
          isValid = false;
          break;
        }
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
        isValid = this.modifyOneNode(node.nodeValue, {
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
    return isValid;
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
    const isValid = this.modifyOneNode(this.treeData, {
      nodeName,
      nodeValue,
      nameEditable,
      valueEditable,
      nodeDeletable,
      isInEdit,
      key,
    });

    return isValid ? this.getTreeData() : null;
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
    isInEdit = true,
    nodeValue = '',
  } = {}) {
    if (Tree.findInEdit(this.treeData)) {
      openNotification('warning', null, this.completeEditingNodeTips);
      return this.getTreeData();
    }
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
    isInEdit = true,
    nodeValue = '',
  } = {}) {
    const level = Tree.getTargetLevel(this.treeData, key);
    if ((level + 1) > this.maxLevel) {
      openNotification('warning', null, this.overLevelTips + this.maxLevel);
      return this.getTreeData();
    }
    if (Tree.findInEdit(this.treeData)) {
      openNotification('warning', null, this.completeEditingNodeTips);
      return this.getTreeData();
    }

    this.addOneSubNode(this.treeData, {
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