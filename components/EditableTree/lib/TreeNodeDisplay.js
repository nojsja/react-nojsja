"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TreeNodeDisplay;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function TreeNodeDisplay(_ref) {
  var editNameInputVisible = _ref.editNameInputVisible,
      isColonVisible = _ref.isColonVisible,
      treeData = _ref.treeData,
      enableEdit = _ref.enableEdit,
      getInToEditable = _ref.getInToEditable,
      editValueInputVisible = _ref.editValueInputVisible,
      lang = _ref.lang;
  return !treeData.isInEdit ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, editNameInputVisible && /*#__PURE__*/_react["default"].createElement("span", {
    "attr-key": treeData.key
  }, /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    placement: "bottom",
    title: (treeData.nodeName || '').length > 50 ? treeData.nodeName : ''
  }, /*#__PURE__*/_react["default"].createElement("span", {
    onClick: enableEdit && treeData.nameEditable && getInToEditable,
    className: "editable-tree-label normal-text"
  }, (0, _utils.longNameFormatterNoTail)(treeData.nodeName || '')))), isColonVisible && /*#__PURE__*/_react["default"].createElement("span", null, "\uFF1A"), editValueInputVisible && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    placement: "bottom",
    title: (treeData.nodeValue || '').length > 50 ? treeData.nodeValue : ''
  }, /*#__PURE__*/_react["default"].createElement("span", {
    onClick: enableEdit && getInToEditable,
    className: "editable-tree-label normal-text"
  }, (0, _utils.longNameFormatterNoTail)(treeData.nodeValue || ''))))) : null;
}