import { getRandomString, typeCheck } from 'utils/utils';
import { message } from 'antd';

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

  /**
    * [判断裸数据是否符合规范]
    * @param  {[Array]} data [自定义的扩展元数据]
    * @return {[Boolean]} [是否符合]
    */
   static isNudeTemplateData = (dataObject) => {
     let pass = true;
     if (!typeCheck(dataObject, 'object')) {
       pass = false;
       return pass;
     }
     Object.keys(dataObject).forEach((key) => {
       if (!pass) return pass;
       pass = typeCheck(dataObject[key], 'object') ? Tree.isNudeTemplateData(dataObject[key]) : true;
     });
     return pass;
   }

  /**
   * [formatFragmentData 转换json裸数据为Tree标准数据]
   * @param  {[Array]} data [自定义的扩展元数据]
   * @return {[Array]} [已经还原成额原生数据]
   */
  static formatFragmentData = (dataObject) => {
    let nodeData = typeCheck(dataObject, 'object') ? dataObject : {};
    let tmp;
    nodeData = Object.keys(nodeData).map((key) => {
      tmp = {};
      tmp.nodeName = key;
      tmp.id = `${key}_${getRandomString()}`;
      tmp.key = tmp.id;
      tmp.nodeValue = typeCheck(nodeData[key], 'object') ? Tree.formatFragmentData(nodeData[key]) : String(nodeData[key]);
      return tmp;
    });
    return nodeData;
  }

  /* 检查树是否存在同级key相同的情况 */
  static hasSameKeyInOneLevelForFragment = (treeData) => {
    let hasSame = false;
    let i;
    if (!typeCheck(treeData, 'array')) return false;
    if (new Set(treeData.map(item => item.nodeName)).size < treeData.length) return true;
    for (i = 0; i < treeData.length; i++) {
      hasSame = typeCheck(treeData[i].nodeValue, 'array') ? Tree.hasSameKeyInOneLevelForFragment(treeData[i].nodeValue) : hasSame;
      if (hasSame) break;
    }
    return hasSame;
  }

  /* 获取目标深度 */
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

  static levelDepthWrapper = (treeData, level = 0) => {
    const nextLevels = [];
    if (!treeData || !(treeData instanceof Array)) return 0;
    level += 1;
    for (let i = 0; i < treeData.length; i++) {
      treeData[i].depth = level;
      nextLevels.push(...(treeData[i].nodeValue instanceof Array ? (treeData[i].nodeValue) : []));
    }
    if (nextLevels.length) { level = Tree.levelDepthWrapper(nextLevels, level); }

    return level;
  }

  /* 获取用于比较的name/value裸数据 */
  static getNudeTreeData = (dataArray) => {
    let level;
    for (let i = 0; i < dataArray.length; i++) {
      level = {
        nodeName: dataArray[i].nodeName,
        nameEditable: dataArray[i].nameEditable,
        valueEditable: dataArray[i].valueEditable,
        nodeDeletable: dataArray[i].nodeDeletable,
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
        if (nodeIsExitsInSameLevel) {
          return message.warning({
            content: this.addSameLevelTips,
            top: 24,
            container: () => document.body,
          });
        }
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
      message.warning({ content: this.completeEditingNodeTips, top: 24, container: () => document.body });
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
          message.warning({ content: this.addSameLevelTips, top: 24, container: () => document.body });
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
      message.warning({ content: this.completeEditingNodeTips, top: 24, container: () => document.body });
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
    yaml,
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
          yaml,
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
          yaml,
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
    yaml = false,
  } = {}) {
    const level = Tree.getTargetLevel(this.treeData, key);
    if ((level + 1) > this.maxLevel) {
      message.warning({ content: this.overLevelTips + this.maxLevel, top: 24, container: () => document.body });
      return this.getTreeData();
    }
    if (Tree.findInEdit(this.treeData)) {
      message.warning({ content: this.completeEditingNodeTips, top: 24, container: () => document.body });
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
      yaml,
    });
    return this.getTreeData();
  }

  addOneNodeFragment(nodeArray, {
    nameEditable,
    valueEditable,
    nodeDeletable,
    isInEdit,
    fragment,
    key,
  }) {
    let node;
    let isValid = false;
    let targetLevelKeys;
    for (let i = nodeArray.length - 1; i >= 0; i--) {
      node = nodeArray[i];
      if (node.key === key) {
        targetLevelKeys = nodeArray.map(item => item.nodeName);
        if (fragment.some(item => targetLevelKeys.includes(item.nodeName))) {
          message.warning({ content: this.addSameLevelTips, top: 24, container: () => document.body });
          isValid = false;
          break;
        }
        isValid = true;
        nodeArray.splice(i, 1);
        nodeArray.push(...fragment);
        break;
      }
      if (node.nodeValue && node.nodeValue instanceof Array && !isValid) {
        isValid = this.addOneNodeFragment(node.nodeValue, {
          nameEditable,
          valueEditable,
          nodeDeletable,
          isInEdit,
          fragment,
          key,
        });
      }
    }
    return isValid;
  }

  /* 添加一个节点片段 */
  addNodeFragment(key, {
    nameEditable = true,
    valueEditable = true,
    nodeDeletable = true,
    isInEdit = true,
    fragment = {
      nodeName: '',
      nodeValue: '',
      id: '',
    },
  } = {}) {
    if (Tree.hasSameKeyInOneLevelForFragment(fragment)) {
      message.warning({ content: this.addSameLevelTips, top: 24, container: () => document.body });
      return null;
    }
    fragment = Tree.defaultTreeValueWrapper(fragment);
    const level = Tree.getTargetLevel(this.treeData, key);
    const fragmentLevel = Tree.getTargetLevel(fragment, '');
    if ((level + fragmentLevel) > this.maxLevel) {
      message.warning({ content: this.overLevelTips + this.maxLevel, top: 24, container: () => document.body });
      return null;
    }

    const isValid = this.addOneNodeFragment(this.treeData, {
      nameEditable,
      valueEditable,
      nodeDeletable,
      isInEdit,
      fragment,
      key,
    });
    return isValid ? this.getTreeData() : null;
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
