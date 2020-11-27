"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TreeNodeNormalEditing;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _icons = require("@ant-design/icons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function TreeNodeNormalEditing(_ref) {
  var onNodeNameChange = _ref.onNodeNameChange,
      editValueInputVisible = _ref.editValueInputVisible,
      treeData = _ref.treeData,
      onNodeValueChange = _ref.onNodeValueChange,
      editConfirm = _ref.editConfirm,
      editCancel = _ref.editCancel,
      show = _ref.show,
      lang = _ref.lang;
  return show ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_antd.Input, {
    className: "normal-text",
    disabled: !treeData.nameEditable,
    size: "small",
    onChange: onNodeNameChange,
    defaultValue: treeData.nodeName
  })), "\uFF1A", editValueInputVisible && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_antd.Input, {
    className: "normal-text",
    size: "small",
    disabled: !treeData.valueEditable,
    onChange: onNodeValueChange,
    defaultValue: treeData.nodeValue
  })), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "editable-tree-edit-confirm successColor"
  }, /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.confirm
  }, /*#__PURE__*/_react["default"].createElement(_icons.CheckOutlined, {
    onClick: editConfirm
  }))), /*#__PURE__*/_react["default"].createElement("span", {
    className: "editable-tree-edit-cancel warningColor"
  }, /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.cancel
  }, /*#__PURE__*/_react["default"].createElement(_icons.CloseOutlined, {
    onClick: editCancel
  }))))) : null;
}