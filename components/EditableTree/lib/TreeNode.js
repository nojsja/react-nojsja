"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _yaml = require("yaml");

var _utils = require("utils/utils");

var _Tree = _interopRequireDefault(require("./Tree"));

var _TreeNodeActions = _interopRequireDefault(require("./TreeNodeActions"));

var _TreeNodeDisplay = _interopRequireDefault(require("./TreeNodeDisplay"));

var _TreeNodeNormalEditing = _interopRequireDefault(require("./TreeNodeNormalEditing"));

var _TreeNodeYamlEditing = _interopRequireDefault(require("./TreeNodeYamlEditing"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var TreeNode = /*#__PURE__*/function (_Component) {
  _inherits(TreeNode, _Component);

  var _super = _createSuper(TreeNode);

  function TreeNode() {
    var _this;

    _classCallCheck(this, TreeNode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      actionVisible: false
    };
    _this.nodeName = '';
    _this.nodeValue = '';

    _this.setAttr = function (_ref) {
      var key = _ref.key,
          value = _ref.value;

      _this.setState(_defineProperty({}, key, value));
    };

    _this.setActionVisibleTrue = function (e) {
      e && e.stopPropagation();

      _this.setState({
        actionVisible: true
      });
    };

    _this.setActionVisibleFalse = function (e) {
      e && e.stopPropagation();

      _this.setState({
        actionVisible: false
      });
    };

    _this.onNodeNameChange = function (e) {
      _this.nodeName = e.target.value;
    };

    _this.onNodeValueChange = function (e) {
      _this.nodeValue = e.target.value;
    };

    _this.editConfirm = function () {
      var _this$props = _this.props,
          treeData = _this$props.treeData,
          modifyNode = _this$props.modifyNode,
          lang = _this$props.lang;
      if (!_this.nodeName && !_this.nodeValue) return _antd.message.warning(lang.pleaseInputKeyOrValue);
      if (!_this.nodeName && _this.nodeValue instanceof Array) return _antd.message.warning(lang.pleaseInputKey);
      var isValid = modifyNode(treeData.key, _objectSpread(_objectSpread({}, treeData), {}, {
        nodeName: _this.nodeName,
        nodeValue: _this.nodeValue,
        isInEdit: false
      }));

      if (isValid) {
        _this.nodeName = '';
        _this.nodeValue = '';

        _this.setActionVisibleFalse();
      }
    };

    _this.checkYamlTreeHadNullValue = function (object) {
      var isValid = true;

      for (var key in object) {
        if (!isValid) break;

        if ((0, _utils.typeCheck)(object[key], 'object')) {
          isValid = _this.checkYamlTreeHadNullValue(object[key]);
        } else {
          isValid = !(object[key] === null);
        }
      }

      return isValid;
    };

    _this.editYamlConfirm = function () {
      var _this$props2 = _this.props,
          treeData = _this$props2.treeData,
          addNodeFragment = _this$props2.addNodeFragment,
          addExpandedKey = _this$props2.addExpandedKey,
          lang = _this$props2.lang;
      var yamlData;
      if (!_this.nodeValue) return _antd.message.warning(lang.pleaseInputKeyOrValue);
      if (/^([\w\W]+:((\s)*-[\w\W]+)+([\w\W])*)+$/.test(_this.nodeValue)) return _antd.message.warning(lang.json_format_invalid);

      try {
        yamlData = (0, _yaml.parse)(_this.nodeValue);

        if (((0, _utils.typeCheck)(yamlData, 'array') ? yamlData : [yamlData]).some(function (item) {
          return !_this.checkYamlTreeHadNullValue(item);
        })) {
          return _antd.message.warning(lang.json_format_invalid);
        }

        console.log('parsed: ', yamlData);
        yamlData = (0, _utils.typeCheck)(yamlData, 'array') ? yamlData.reduce(function (item, nowItem) {
          return _objectSpread(_objectSpread({}, item), nowItem);
        }, {}) : yamlData;
      } catch (error) {
        return _antd.message.warning(lang.json_format_invalid);
      }

      if (!_Tree["default"].isNudeTemplateData(yamlData)) {
        return _antd.message.warning(lang.json_format_invalid);
      }

      var fragment = _Tree["default"].formatFragmentData(yamlData);

      var isValid = addNodeFragment(treeData.key, _objectSpread(_objectSpread({}, treeData), {}, {
        fragment: fragment,
        isInEdit: false
      }));

      if (isValid) {
        addExpandedKey(_Tree["default"].getTreeKeys(fragment));
        console.log('valid： ', _Tree["default"].getTreeKeys(fragment));
        _this.nodeName = '';
        _this.nodeValue = '';

        _this.setActionVisibleFalse();
      }
    };

    _this.editCancel = function () {
      var _this$props3 = _this.props,
          treeData = _this$props3.treeData,
          getInToEditable = _this$props3.getInToEditable,
          lang = _this$props3.lang;
      if (!treeData.nodeName && !treeData.nodeValue) return _this.removeNode();
      if (!treeData.nodeName && !treeData.nodeValue) return _antd.message.warning(lang.KeyAndValueIsNotAllEmpty);
      getInToEditable(treeData.key, _objectSpread(_objectSpread({}, treeData), {}, {
        isInEdit: false
      }));

      _this.setActionVisibleFalse();
    };

    _this.getInToEditable = function () {
      var _this$props4 = _this.props,
          treeData = _this$props4.treeData,
          getInToEditable = _this$props4.getInToEditable;

      if (treeData.nameEditable || treeData.valueEditable) {
        getInToEditable(treeData.key, _objectSpread(_objectSpread({}, treeData), {}, {
          isInEdit: true
        }));
      }
    };

    _this.addSisterNode = function () {
      var _this$props5 = _this.props,
          treeData = _this$props5.treeData,
          addSisterNode = _this$props5.addSisterNode;
      addSisterNode(treeData.key);
    };

    _this.addSubNode = function () {
      var _this$props6 = _this.props,
          treeData = _this$props6.treeData,
          addSubNode = _this$props6.addSubNode,
          addExpandedKey = _this$props6.addExpandedKey;
      addSubNode(treeData.key);
      addExpandedKey(treeData.key);
    };

    _this.addYamlNode = function () {
      var _this$props7 = _this.props,
          treeData = _this$props7.treeData,
          addSubNode = _this$props7.addSubNode,
          addExpandedKey = _this$props7.addExpandedKey;
      addSubNode(treeData.key, {
        yaml: true
      });
    };

    _this.removeNode = function () {
      var _this$props8 = _this.props,
          treeData = _this$props8.treeData,
          removeNode = _this$props8.removeNode;
      console.log(treeData.key);
      removeNode(treeData.key);
    };

    return _this;
  }

  _createClass(TreeNode, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props$treeData = this.props.treeData,
          nodeName = _this$props$treeData.nodeName,
          nodeValue = _this$props$treeData.nodeValue;
      this.nodeName = nodeName;
      this.nodeValue = nodeValue;
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _nextProps$treeData = nextProps.treeData,
          nodeName = _nextProps$treeData.nodeName,
          nodeValue = _nextProps$treeData.nodeValue;
      this.nodeName = this.nodeName || nodeName;
      this.nodeValue = this.nodeValue || nodeValue;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          treeData = _this$props9.treeData,
          maxLevel = _this$props9.maxLevel,
          enableYaml = _this$props9.enableYaml,
          lang = _this$props9.lang;
      var editValueInputVisible = !(treeData.nodeValue instanceof Array);
      var editNameInputVisible = !treeData.nodeName && !treeData.nodeValue || treeData.nodeName || treeData.nodeValue && (0, _utils.typeCheck)(treeData.nodeValue, 'array');
      var actionAddNodeVisible = (treeData.nodeValue || treeData.nodeName) && (!treeData.nodeValue || treeData.nodeValue instanceof Array);
      var depthOverflow = treeData.depth >= maxLevel;
      return /*#__PURE__*/_react["default"].createElement(_antd.Row, {
        key: treeData.key,
        onMouseEnter: this.setActionVisibleTrue,
        onMouseLeave: this.setActionVisibleFalse
      }, /*#__PURE__*/_react["default"].createElement(_TreeNodeYamlEditing["default"], {
        show: treeData.yaml && treeData.isInEdit && enableYaml,
        onNodeValueChange: this.onNodeValueChange,
        editYamlConfirm: this.editYamlConfirm,
        editCancel: this.editCancel,
        lang: lang
      }), /*#__PURE__*/_react["default"].createElement(_TreeNodeNormalEditing["default"], {
        show: !treeData.yaml && treeData.isInEdit,
        editValueInputVisible: editValueInputVisible,
        onNodeNameChange: this.onNodeNameChange,
        treeData: treeData,
        onNodeValueChange: this.onNodeValueChange,
        editConfirm: this.editConfirm,
        editCancel: this.editCancel,
        lang: lang
      }), /*#__PURE__*/_react["default"].createElement(_TreeNodeDisplay["default"], {
        editNameInputVisible: editNameInputVisible,
        treeData: treeData,
        getInToEditable: this.getInToEditable,
        editValueInputVisible: editValueInputVisible,
        lang: lang
      }), /*#__PURE__*/_react["default"].createElement(_TreeNodeActions["default"], {
        actionVisible: this.state.actionVisible,
        actionAddNodeVisible: actionAddNodeVisible,
        addSisterNode: this.addSisterNode,
        addSubNode: this.addSubNode,
        addYamlNode: this.addYamlNode,
        removeNode: this.removeNode,
        nodeDeletable: treeData.nodeDeletable,
        depthOverflow: depthOverflow,
        enableYaml: enableYaml,
        isInEdit: treeData.isInEdit,
        lang: lang
      }));
    }
  }]);

  return TreeNode;
}(_react.Component);

exports["default"] = TreeNode;