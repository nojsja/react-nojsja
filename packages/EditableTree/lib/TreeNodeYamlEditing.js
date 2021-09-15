"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TreeNodeYamlEditing;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _icons = require("@ant-design/icons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function TreeNodeYamlEditing(_ref) {
  var onNodeValueChange = _ref.onNodeValueChange,
      editYamlConfirm = _ref.editYamlConfirm,
      editCancel = _ref.editCancel,
      lang = _ref.lang,
      show = _ref.show;
  return show ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_antd.Input.TextArea, {
    autoSize: {
      minRows: 2,
      maxRows: 4
    },
    onChange: onNodeValueChange
  })), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "editable-tree-edit-confirm successColor"
  }, /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.confirm
  }, /*#__PURE__*/_react["default"].createElement(_icons.CheckOutlined, {
    onClick: editYamlConfirm
  }))), /*#__PURE__*/_react["default"].createElement("span", {
    className: "editable-tree-edit-cancel warningColor"
  }, /*#__PURE__*/_react["default"].createElement(_antd.Tooltip, {
    title: lang.cancel
  }, /*#__PURE__*/_react["default"].createElement(_icons.CloseOutlined, {
    onClick: editCancel
  }))))) : null;
}