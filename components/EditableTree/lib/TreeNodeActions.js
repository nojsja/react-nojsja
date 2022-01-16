"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TreeNodeActions;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function TreeNodeActions(_ref) {
  var actionVisible = _ref.actionVisible,
      actionAddNodeVisible = _ref.actionAddNodeVisible,
      addSisterNode = _ref.addSisterNode,
      addSubNode = _ref.addSubNode,
      addYamlNode = _ref.addYamlNode,
      removeNode = _ref.removeNode,
      nodeDeletable = _ref.nodeDeletable,
      depthOverflow = _ref.depthOverflow,
      enableYaml = _ref.enableYaml,
      enableEdit = _ref.enableEdit,
      isInEdit = _ref.isInEdit,
      lang = _ref.lang;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, actionVisible ? /*#__PURE__*/_react["default"].createElement("span", {
    className: "editable-tree-node-action"
  }, enableEdit && !isInEdit && actionAddNodeVisible && /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.addSisterNode
  }, " ", /*#__PURE__*/_react["default"].createElement("i", {
    className: "iconfont icon-sisternode",
    onClick: addSisterNode
  })), enableEdit && !isInEdit && actionAddNodeVisible && !depthOverflow && /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.addSubNode
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "iconfont icon-subnode",
    onClick: addSubNode
  })), enableEdit && !isInEdit && actionAddNodeVisible && enableYaml && /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.addYamlNode
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "iconfont icon-node_multiple",
    onClick: addYamlNode
  })), enableEdit && nodeDeletable && /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.deleteLevel
  }, " ", /*#__PURE__*/_react["default"].createElement("i", {
    className: "iconfont icon-delete",
    onClick: removeNode
  }), " ")) : /*#__PURE__*/_react["default"].createElement("span", {
    className: "editable-tree-node-action"
  }));
}