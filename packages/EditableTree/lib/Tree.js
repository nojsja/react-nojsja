"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

var _antd = require("antd");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tree = /*#__PURE__*/function () {
  function Tree(data, treeKey, _ref) {
    var maxLevel = _ref.maxLevel,
        _ref$overLevelTips = _ref.overLevelTips,
        overLevelTips = _ref$overLevelTips === void 0 ? '已经限制模板树的最大深度为：' : _ref$overLevelTips,
        _ref$addSameLevelTips = _ref.addSameLevelTips,
        addSameLevelTips = _ref$addSameLevelTips === void 0 ? '同层级已经有同名节点被添加！' : _ref$addSameLevelTips,
        _ref$completeEditingN = _ref.completeEditingNodeTips,
        completeEditingNodeTips = _ref$completeEditingN === void 0 ? '请完善当前正在编辑的节点数据！' : _ref$completeEditingN;

    _classCallCheck(this, Tree);

    this.treeData = data;
    this.treeKey = treeKey;
    this.maxLevel = maxLevel;
    this.overLevelTips = overLevelTips;
    this.completeEditingNodeTips = completeEditingNodeTips;
    this.addSameLevelTips = addSameLevelTips;
  }
  /**
    * [check if data is valid nude data ]
    * @param  {[Array]} data [data object]
    * @return {[Boolean]} [valid]
    */


  _createClass(Tree, [{
    key: "getInToEditableOne",
    value: function getInToEditableOne(nodeArray, _ref2) {
      var nodeName = _ref2.nodeName,
          nodeValue = _ref2.nodeValue,
          id = _ref2.id,
          key = _ref2.key,
          isInEdit = _ref2.isInEdit;
      var node;

      for (var i = 0; i < nodeArray.length; i++) {
        node = nodeArray[i];

        if (node.key === key) {
          var nodeIsExitsInSameLevel = Tree.checkNodeIsExitsInSameLevel({
            id: id,
            nodeName: nodeName,
            nodeValue: nodeValue,
            key: key
          }, nodeArray);

          if (nodeIsExitsInSameLevel) {
            return _antd.message.warning({
              content: this.addSameLevelTips,
              top: 24,
              container: function container() {
                return document.body;
              }
            });
          }

          node.isInEdit = isInEdit;
        } else {
          node.isInEdit = false;
        }

        if (node.nodeValue && node.nodeValue instanceof Array) {
          this.getInToEditableOne(node.nodeValue, {
            isInEdit: isInEdit,
            nodeName: nodeName,
            nodeValue: nodeValue,
            id: id,
            key: key
          });
        }
      }
    }
    /* enter edit mode */

  }, {
    key: "getInToEditable",
    value: function getInToEditable(key) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          nodeName = _ref3.nodeName,
          nodeValue = _ref3.nodeValue,
          id = _ref3.id,
          isInEdit = _ref3.isInEdit;

      if (Tree.checkNodeIsBeEditable(key, this.treeData)) {
        this.getInToEditableOne(this.treeData, {
          nodeName: nodeName,
          nodeValue: nodeValue,
          isInEdit: isInEdit,
          key: key,
          id: id
        });
      } else {
        _antd.message.warning({
          content: this.completeEditingNodeTips,
          top: 24,
          container: function container() {
            return document.body;
          }
        });
      }

      return this.getTreeData();
    }
  }, {
    key: "modifyOneNode",
    value: function modifyOneNode(nodeArray, _ref4) {
      var nodeName = _ref4.nodeName,
          nodeValue = _ref4.nodeValue,
          nameEditable = _ref4.nameEditable,
          valueEditable = _ref4.valueEditable,
          nodeDeletable = _ref4.nodeDeletable,
          isInEdit = _ref4.isInEdit,
          key = _ref4.key;
      var isValid = true;

      for (var i = 0; i < nodeArray.length; i++) {
        var node = nodeArray[i];

        if (node.key === key) {
          var nodeIsExitsInSameLevel = Tree.checkNodeIsExitsInSameLevel({
            nodeName: nodeName,
            nodeValue: nodeValue,
            key: key
          }, nodeArray);

          if (nodeIsExitsInSameLevel) {
            _antd.message.warning({
              content: this.addSameLevelTips,
              top: 24,
              container: function container() {
                return document.body;
              }
            });

            isValid = false;
            break;
          }

          node.nameEditable = nameEditable;
          node.valueEditable = valueEditable;
          node.nodeName = nodeName;
          node.nodeValue = nodeValue;
          node.nodeDeletable = nodeDeletable;
          node.isInEdit = nodeIsExitsInSameLevel ? node.isInEdit : isInEdit; // break;
        } else {
          node.isInEdit = false;
        }

        if (node.nodeValue && node.nodeValue instanceof Array) {
          isValid = this.modifyOneNode(node.nodeValue, {
            nodeName: nodeName,
            nodeValue: nodeValue,
            nameEditable: nameEditable,
            valueEditable: valueEditable,
            nodeDeletable: nodeDeletable,
            isInEdit: isInEdit,
            key: key
          });
        }
      }

      return isValid;
    }
    /* modify node data */

  }, {
    key: "modifyNode",
    value: function modifyNode(key) {
      var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref5$nodeName = _ref5.nodeName,
          nodeName = _ref5$nodeName === void 0 ? '' : _ref5$nodeName,
          _ref5$nodeValue = _ref5.nodeValue,
          nodeValue = _ref5$nodeValue === void 0 ? '' : _ref5$nodeValue,
          _ref5$nameEditable = _ref5.nameEditable,
          nameEditable = _ref5$nameEditable === void 0 ? true : _ref5$nameEditable,
          _ref5$valueEditable = _ref5.valueEditable,
          valueEditable = _ref5$valueEditable === void 0 ? true : _ref5$valueEditable,
          _ref5$nodeDeletable = _ref5.nodeDeletable,
          nodeDeletable = _ref5$nodeDeletable === void 0 ? true : _ref5$nodeDeletable,
          _ref5$isInEdit = _ref5.isInEdit,
          isInEdit = _ref5$isInEdit === void 0 ? false : _ref5$isInEdit;

      var isValid = this.modifyOneNode(this.treeData, {
        nodeName: nodeName,
        nodeValue: nodeValue,
        nameEditable: nameEditable,
        valueEditable: valueEditable,
        nodeDeletable: nodeDeletable,
        isInEdit: isInEdit,
        key: key
      });
      return isValid ? this.getTreeData() : null;
    }
  }, {
    key: "addOneSisterNode",
    value: function addOneSisterNode(nodeArray, _ref6) {
      var nodeName = _ref6.nodeName,
          nameEditable = _ref6.nameEditable,
          valueEditable = _ref6.valueEditable,
          nodeDeletable = _ref6.nodeDeletable,
          isInEdit = _ref6.isInEdit,
          nodeValue = _ref6.nodeValue,
          key = _ref6.key;
      var node;
      var id;

      for (var i = nodeArray.length - 1; i >= 0; i--) {
        node = nodeArray[i];

        if (node.key === key) {
          id = (0, _utils.getRandomString)();
          nodeArray.push({
            nodeName: nodeName,
            id: id,
            nameEditable: nameEditable,
            valueEditable: valueEditable,
            nodeDeletable: nodeDeletable,
            isInEdit: isInEdit,
            nodeValue: nodeValue,
            key: "".concat(this.treeKey, "_").concat(id)
          });
          break;
        }

        if (node.nodeValue && node.nodeValue instanceof Array) {
          this.addOneSisterNode(node.nodeValue, {
            nodeName: nodeName,
            nameEditable: nameEditable,
            valueEditable: valueEditable,
            nodeDeletable: nodeDeletable,
            isInEdit: isInEdit,
            nodeValue: nodeValue,
            key: key
          });
        }
      }
    }
    /* add a sister node for key level */

  }, {
    key: "addSisterNode",
    value: function addSisterNode(key) {
      var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref7$nodeName = _ref7.nodeName,
          nodeName = _ref7$nodeName === void 0 ? '' : _ref7$nodeName,
          _ref7$nameEditable = _ref7.nameEditable,
          nameEditable = _ref7$nameEditable === void 0 ? true : _ref7$nameEditable,
          _ref7$valueEditable = _ref7.valueEditable,
          valueEditable = _ref7$valueEditable === void 0 ? true : _ref7$valueEditable,
          _ref7$nodeDeletable = _ref7.nodeDeletable,
          nodeDeletable = _ref7$nodeDeletable === void 0 ? true : _ref7$nodeDeletable,
          _ref7$isInEdit = _ref7.isInEdit,
          isInEdit = _ref7$isInEdit === void 0 ? true : _ref7$isInEdit,
          _ref7$nodeValue = _ref7.nodeValue,
          nodeValue = _ref7$nodeValue === void 0 ? '' : _ref7$nodeValue;

      if (Tree.findInEdit(this.treeData)) {
        _antd.message.warning({
          content: this.completeEditingNodeTips,
          top: 24,
          container: function container() {
            return document.body;
          }
        });

        return this.getTreeData();
      }

      this.addOneSisterNode(this.treeData, {
        nodeName: nodeName,
        nameEditable: nameEditable,
        valueEditable: valueEditable,
        nodeDeletable: nodeDeletable,
        isInEdit: isInEdit,
        nodeValue: nodeValue,
        key: key
      });
      return this.getTreeData();
    }
  }, {
    key: "addOneSubNode",
    value: function addOneSubNode(nodeArray, _ref8) {
      var nodeName = _ref8.nodeName,
          nameEditable = _ref8.nameEditable,
          valueEditable = _ref8.valueEditable,
          nodeDeletable = _ref8.nodeDeletable,
          isInEdit = _ref8.isInEdit,
          nodeValue = _ref8.nodeValue,
          key = _ref8.key,
          yaml = _ref8.yaml;
      var node;
      var id;

      for (var i = nodeArray.length - 1; i >= 0; i--) {
        node = nodeArray[i];

        if (node.key === key) {
          id = (0, _utils.getRandomString)();
          if (node.nodeValue && !(node.nodeValue instanceof Array)) break;
          node.nodeValue = node.nodeValue || [];
          node.nodeValue.push({
            nodeName: nodeName,
            id: id,
            nameEditable: nameEditable,
            valueEditable: valueEditable,
            nodeDeletable: nodeDeletable,
            isInEdit: isInEdit,
            nodeValue: nodeValue,
            key: "".concat(this.treeKey, "_").concat(id),
            yaml: yaml
          });
          break;
        }

        if (node.nodeValue && node.nodeValue instanceof Array) {
          this.addOneSubNode(node.nodeValue, {
            nodeName: nodeName,
            nameEditable: nameEditable,
            valueEditable: valueEditable,
            nodeDeletable: nodeDeletable,
            isInEdit: isInEdit,
            nodeValue: nodeValue,
            key: key,
            yaml: yaml
          });
        }
      }
    }
    /* add a sub node for key level */

  }, {
    key: "addSubNode",
    value: function addSubNode(key) {
      var _ref9 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref9$nodeName = _ref9.nodeName,
          nodeName = _ref9$nodeName === void 0 ? '' : _ref9$nodeName,
          _ref9$nameEditable = _ref9.nameEditable,
          nameEditable = _ref9$nameEditable === void 0 ? true : _ref9$nameEditable,
          _ref9$valueEditable = _ref9.valueEditable,
          valueEditable = _ref9$valueEditable === void 0 ? true : _ref9$valueEditable,
          _ref9$nodeDeletable = _ref9.nodeDeletable,
          nodeDeletable = _ref9$nodeDeletable === void 0 ? true : _ref9$nodeDeletable,
          _ref9$isInEdit = _ref9.isInEdit,
          isInEdit = _ref9$isInEdit === void 0 ? true : _ref9$isInEdit,
          _ref9$nodeValue = _ref9.nodeValue,
          nodeValue = _ref9$nodeValue === void 0 ? '' : _ref9$nodeValue,
          _ref9$yaml = _ref9.yaml,
          yaml = _ref9$yaml === void 0 ? false : _ref9$yaml;

      var level = Tree.getTargetLevel(this.treeData, key);

      if (level + 1 > this.maxLevel) {
        _antd.message.warning({
          content: this.overLevelTips + this.maxLevel,
          top: 24,
          container: function container() {
            return document.body;
          }
        });

        return this.getTreeData();
      }

      if (Tree.findInEdit(this.treeData)) {
        _antd.message.warning({
          content: this.completeEditingNodeTips,
          top: 24,
          container: function container() {
            return document.body;
          }
        });

        return this.getTreeData();
      }

      this.addOneSubNode(this.treeData, {
        nodeName: nodeName,
        nameEditable: nameEditable,
        valueEditable: valueEditable,
        nodeDeletable: nodeDeletable,
        isInEdit: isInEdit,
        nodeValue: nodeValue,
        key: key,
        yaml: yaml
      });
      return this.getTreeData();
    }
  }, {
    key: "addOneNodeFragment",
    value: function addOneNodeFragment(nodeArray, _ref10) {
      var nameEditable = _ref10.nameEditable,
          valueEditable = _ref10.valueEditable,
          nodeDeletable = _ref10.nodeDeletable,
          isInEdit = _ref10.isInEdit,
          fragment = _ref10.fragment,
          key = _ref10.key;
      var node;
      var isValid = false;
      var targetLevelKeys;

      for (var i = nodeArray.length - 1; i >= 0; i--) {
        node = nodeArray[i];

        if (node.key === key) {
          targetLevelKeys = nodeArray.map(function (item) {
            return item.nodeName;
          });

          if (fragment.some(function (item) {
            return targetLevelKeys.includes(item.nodeName);
          })) {
            _antd.message.warning({
              content: this.addSameLevelTips,
              top: 24,
              container: function container() {
                return document.body;
              }
            });

            isValid = false;
            break;
          }

          isValid = true;
          nodeArray.splice(i, 1);
          nodeArray.push.apply(nodeArray, _toConsumableArray(fragment));
          break;
        }

        if (node.nodeValue && node.nodeValue instanceof Array && !isValid) {
          isValid = this.addOneNodeFragment(node.nodeValue, {
            nameEditable: nameEditable,
            valueEditable: valueEditable,
            nodeDeletable: nodeDeletable,
            isInEdit: isInEdit,
            fragment: fragment,
            key: key
          });
        }
      }

      return isValid;
    }
    /* add a node fragment */

  }, {
    key: "addNodeFragment",
    value: function addNodeFragment(key) {
      var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref11$nameEditable = _ref11.nameEditable,
          nameEditable = _ref11$nameEditable === void 0 ? true : _ref11$nameEditable,
          _ref11$valueEditable = _ref11.valueEditable,
          valueEditable = _ref11$valueEditable === void 0 ? true : _ref11$valueEditable,
          _ref11$nodeDeletable = _ref11.nodeDeletable,
          nodeDeletable = _ref11$nodeDeletable === void 0 ? true : _ref11$nodeDeletable,
          _ref11$isInEdit = _ref11.isInEdit,
          isInEdit = _ref11$isInEdit === void 0 ? true : _ref11$isInEdit,
          _ref11$fragment = _ref11.fragment,
          fragment = _ref11$fragment === void 0 ? {
        nodeName: '',
        nodeValue: '',
        id: ''
      } : _ref11$fragment;

      if (Tree.hasSameKeyInOneLevelForFragment(fragment)) {
        _antd.message.warning({
          content: this.addSameLevelTips,
          top: 24,
          container: function container() {
            return document.body;
          }
        });

        return null;
      }

      fragment = Tree.defaultTreeValueWrapper(fragment);
      var level = Tree.getTargetLevel(this.treeData, key);
      var fragmentLevel = Tree.getTargetLevel(fragment, '');

      if (level + fragmentLevel > this.maxLevel) {
        _antd.message.warning({
          content: this.overLevelTips + this.maxLevel,
          top: 24,
          container: function container() {
            return document.body;
          }
        });

        return null;
      }

      var isValid = this.addOneNodeFragment(this.treeData, {
        nameEditable: nameEditable,
        valueEditable: valueEditable,
        nodeDeletable: nodeDeletable,
        isInEdit: isInEdit,
        fragment: fragment,
        key: key
      });
      return isValid ? this.getTreeData() : null;
    }
  }, {
    key: "removeOneNode",
    value: function removeOneNode(key, nodeArray) {
      var node;
      var j;

      for (var i = nodeArray.length - 1; i >= 0; i--) {
        node = nodeArray[i];

        if (node.key === key) {
          nodeArray.splice(i, 1);
          break;
        }

        if (node.nodeValue && node.nodeValue instanceof Array) {
          j = node.nodeValue.findIndex(function (item) {
            return item.key === key;
          });

          if (j !== -1) {
            node.nodeValue.splice(j, 1);
            node.nodeValue = !node.nodeValue.length ? '' : node.nodeValue;
            break;
          }

          this.removeOneNode(key, node.nodeValue);
        }
      }
    }
    /* remote a node */

  }, {
    key: "removeNode",
    value: function removeNode(key) {
      this.removeOneNode(key, this.treeData);
      return this.getTreeData();
    }
    /* get tree data */

  }, {
    key: "getTreeData",
    value: function getTreeData() {
      return (0, _utils.deepClone)(this.treeData);
    }
    /* update tree data */

  }, {
    key: "update",
    value: function update(_ref12) {
      var data = _ref12.data,
          key = _ref12.key;
      data && (this.treeData = data);
      key && (this.treeKey = key);
    }
  }], [{
    key: "defaultTreeValueWrapper",
    value:
    /* fill default value */
    function defaultTreeValueWrapper(treeData) {
      if (!treeData || !(treeData instanceof Array)) return treeData;
      var emptyData;
      treeData.forEach(function (node) {
        emptyData = _objectSpread({
          nodeName: '',
          nodeValue: '',
          nameEditable: true,
          valueEditable: true,
          isInEdit: false,
          nodeDeletable: true
        }, node);
        Object.keys(emptyData).forEach(function (k) {
          node[k] = emptyData[k];
        });
        if (node.nodeValue instanceof Array) Tree.defaultTreeValueWrapper(node.nodeValue);
      });
      return treeData;
    }
    /* get whole tree nodes keys */

  }, {
    key: "getTreeKeys",
    value: function getTreeKeys(treeData) {
      var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (!treeData || !(treeData instanceof Array)) return keys;
      treeData.forEach(function (node) {
        keys.push(node.key);
        if (node.nodeValue instanceof Array) Tree.getTreeKeys(node.nodeValue, keys);
      });
      return keys;
    }
    /* find whether there is a node being edited */

  }, {
    key: "findInEdit",
    value: function findInEdit(items) {
      var isEdit = false;
      if (!(0, _utils.typeCheck)(items, 'array')) return isEdit;

      for (var i = 0; i < items.length; i++) {
        if (items[i].isInEdit) {
          isEdit = items[i];
        }

        if (!isEdit && (0, _utils.typeCheck)(items[i].nodeValue, 'array')) {
          isEdit = Tree.findInEdit(items[i].nodeValue);
        }

        if (isEdit) break;
      }

      return isEdit;
    }
  }]);

  return Tree;
}();

exports["default"] = Tree;

Tree.isNudeTemplateData = function (dataObject) {
  var pass = true;

  if (!(0, _utils.typeCheck)(dataObject, 'object')) {
    pass = false;
    return pass;
  }

  Object.keys(dataObject).forEach(function (key) {
    if (!pass) return pass;
    pass = (0, _utils.typeCheck)(dataObject[key], 'object') ? Tree.isNudeTemplateData(dataObject[key]) : true;
  });
  return pass;
};

Tree.formatFragmentData = function (dataObject) {
  var nodeData = (0, _utils.typeCheck)(dataObject, 'object') ? dataObject : {};
  var tmp;
  nodeData = Object.keys(nodeData).map(function (key) {
    tmp = {};
    tmp.nodeName = key;
    tmp.id = "".concat(key, "_").concat((0, _utils.getRandomString)());
    tmp.key = tmp.id;
    tmp.nodeValue = (0, _utils.typeCheck)(nodeData[key], 'object') ? Tree.formatFragmentData(nodeData[key]) : String(nodeData[key]);
    return tmp;
  });
  return nodeData;
};

Tree.hasSameKeyInOneLevelForFragment = function (treeData) {
  var hasSame = false;
  var i;
  if (!(0, _utils.typeCheck)(treeData, 'array')) return false;
  if (new Set(treeData.map(function (item) {
    return item.nodeName;
  })).size < treeData.length) return true;

  for (i = 0; i < treeData.length; i++) {
    hasSame = (0, _utils.typeCheck)(treeData[i].nodeValue, 'array') ? Tree.hasSameKeyInOneLevelForFragment(treeData[i].nodeValue) : hasSame;
    if (hasSame) break;
  }

  return hasSame;
};

Tree.getTargetLevel = function (treeData, key) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var nextLevels = [];
  var breaked = false;
  if (!treeData || !(treeData instanceof Array)) return 0;
  level += 1;

  for (var i = 0; i < treeData.length; i++) {
    if (treeData[i].key === key) {
      breaked = true;
      break;
    }

    nextLevels.push.apply(nextLevels, _toConsumableArray(treeData[i].nodeValue instanceof Array ? treeData[i].nodeValue : []));
  }

  if (nextLevels.length && !breaked) {
    level = Tree.getTargetLevel(nextLevels, key, level);
  }

  return level;
};

Tree.levelDepthWrapper = function (treeData) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var nextLevels = [];
  if (!treeData || !(treeData instanceof Array)) return 0;
  level += 1;

  for (var i = 0; i < treeData.length; i++) {
    treeData[i].depth = level;
    nextLevels.push.apply(nextLevels, _toConsumableArray(treeData[i].nodeValue instanceof Array ? treeData[i].nodeValue : []));
  }

  if (nextLevels.length) {
    level = Tree.levelDepthWrapper(nextLevels, level);
  }

  return level;
};

Tree.getNudeTreeData = function (dataArray) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    nameEditable: true,
    valueEditable: true,
    nodeDeletable: true,
    isInEdit: false
  };
  var level;

  for (var i = 0; i < dataArray.length; i++) {
    level = {
      nodeName: dataArray[i].nodeName,
      nameEditable: dataArray[i].nameEditable === undefined ? defaultValue.nameEditable : dataArray[i].nameEditable,
      valueEditable: dataArray[i].valueEditable === undefined ? defaultValue.valueEditable : dataArray[i].valueEditable,
      nodeDeletable: dataArray[i].nodeDeletable === undefined ? defaultValue.nodeDeletable : dataArray[i].nodeDeletable,
      nodeValue: (0, _utils.typeCheck)(dataArray[i].nodeValue, 'array') ? Tree.getNudeTreeData(dataArray[i].nodeValue, defaultValue) : dataArray[i].nodeValue
    };
    dataArray[i] = level;
  }

  return dataArray;
};

Tree.checkNodeIsExitsInSameLevel = function (node) {
  var nodeArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var checkLable = 'nodeName';
  if (!node.nodeName && !node.nodeValue) return false;

  if (!node.nodeName && node.nodeValue) {
    checkLable = 'nodeValue';
  }

  return !!nodeArray.find(function (item) {
    return item[checkLable] === node[checkLable] && node.key !== item.key;
  });
};

Tree.checkNodeIsBeEditable = function (key) {
  var nodeArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var isEditable = true;
  nodeArray.forEach(function (nodeItem) {
    if (isEditable) {
      if (nodeItem.key !== key && nodeItem.nodeName === '' && nodeItem.nodeValue === '') {
        isEditable = false;
      } else {
        isEditable = (0, _utils.typeCheck)(nodeItem.nodeValue, 'array') ? Tree.checkNodeIsBeEditable(key, nodeItem.nodeValue) : true;
      }
    }
  });
  return isEditable;
};