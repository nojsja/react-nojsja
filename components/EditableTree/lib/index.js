"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _TreeNode = _interopRequireDefault(require("./TreeNode"));

var _Tree = _interopRequireDefault(require("./Tree"));

require("./styles/editable-tree.css");

var _lang2 = _interopRequireDefault(require("./lang"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var lang = (0, _lang2["default"])();

var EditableTree = /*#__PURE__*/function (_Component) {
  _inherits(EditableTree, _Component);

  var _super = _createSuper(EditableTree);

  function EditableTree() {
    var _this;

    _classCallCheck(this, EditableTree);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      treeData: [],
      expandedKeys: [],
      enableYaml: false,
      maxLevel: 50,
      lang: 'zh_CN'
    };
    _this.dataOrigin = [];
    _this.treeModel = null;
    _this.key = (0, _utils.getRandomString)();

    _this.modifyNode = function (key, treeNode) {
      var modifiedData = _this.treeModel.modifyNode(key, treeNode);

      if (modifiedData) {
        _this.setState({
          treeData: _this.formatTreeData(modifiedData)
        }, function () {
          return _this.onDataChange(_this.dataOrigin);
        });
      }

      return modifiedData;
    };

    _this.getInToEditable = function (key, treeNode) {
      var modifiedData = _this.treeModel.getInToEditable(key, treeNode);

      _this.setState({
        treeData: _this.formatTreeData(modifiedData)
      });
    };

    _this.addSisterNode = function (key) {
      var modifiedData = _this.treeModel.addSisterNode(key);

      _Tree["default"].levelDepthWrapper(_this.dataOrigin);

      _this.setState({
        treeData: _this.formatTreeData(modifiedData)
      }, function () {
        return _this.onDataChange(_this.dataOrigin);
      });
    };

    _this.addSubNode = function (key, props) {
      var modifiedData = _this.treeModel.addSubNode(key, props);

      _Tree["default"].levelDepthWrapper(_this.dataOrigin);

      _this.setState({
        treeData: _this.formatTreeData(modifiedData)
      }, _this.onDataChange(_this.dataOrigin));
    };

    _this.addNodeFragment = function (key, props) {
      var modifiedData = _this.treeModel.addNodeFragment(key, props);

      console.log(modifiedData);

      if (modifiedData) {
        _Tree["default"].levelDepthWrapper(_this.dataOrigin);

        _this.setState({
          treeData: _this.formatTreeData(modifiedData)
        }, _this.onDataChange(_this.dataOrigin));
      }

      return modifiedData;
    };

    _this.removeNode = function (key) {
      var modifiedData = _this.treeModel.removeNode(key);

      _Tree["default"].levelDepthWrapper(_this.dataOrigin);

      _this.setState({
        treeData: _this.formatTreeData(modifiedData)
      }, _this.onDataChange(_this.dataOrigin));
    };

    _this.formatNodeData = function (treeData) {
      var tree = {};
      var key = treeData.key || "".concat(_this.key, "_").concat(treeData.id);

      if (treeData.toString() === '[object Object]' && tree !== null) {
        tree.key = key;
        treeData.key = key;
        tree.title = /*#__PURE__*/_react["default"].createElement(_TreeNode["default"], {
          maxLevel: _this.state.maxLevel,
          treeData: treeData,
          enableYaml: _this.state.enableYaml,
          modifyNode: _this.modifyNode,
          addSisterNode: _this.addSisterNode,
          addExpandedKey: _this.addExpandedKey,
          getInToEditable: _this.getInToEditable,
          addSubNode: _this.addSubNode,
          addNodeFragment: _this.addNodeFragment,
          removeNode: _this.removeNode,
          lang: lang(_this.state.lang)
        });
        if (treeData.nodeValue instanceof Array) tree.children = treeData.nodeValue.map(function (d) {
          return _this.formatNodeData(d);
        });
      } else {
        tree = '';
      }

      return tree;
    };

    _this.formatTreeData = function (treeData) {
      var tree = [];

      if (treeData instanceof Array) {
        tree = treeData.map(function (treeNode) {
          return _this.formatNodeData(treeNode);
        });
      }

      return tree;
    };

    _this.updateTreeModel = function (props) {
      if (_this.treeModel) {
        _this.treeModel.update(props);
      } else {
        var _lang = lang(_this.state.lang);

        _this.treeModel = new _Tree["default"](props.data, props.key, {
          maxLevel: _this.state.maxLevel,
          overLevelTips: _lang.template_tree_max_level_tips,
          completeEditingNodeTips: _lang.pleaseCompleteTheNodeBeingEdited,
          addSameLevelTips: _lang.extendedMetadata_same_level_name_cannot_be_added
        });
      }
    };

    _this.onExpand = function (expandedKeys, _ref) {
      var bool = _ref.expanded,
          node = _ref.node;

      _this.setState({
        expandedKeys: expandedKeys
      });
    };

    _this.addExpandedKey = function (key) {
      key = key instanceof Array ? key : [key];

      _this.setState({
        expandedKeys: Array.from(new Set([].concat(_toConsumableArray(_this.state.expandedKeys), _toConsumableArray(key))))
      });
    };

    _this.onDataChange = function (modifiedData) {
      var _this$props$onDataCha = _this.props.onDataChange,
          onDataChange = _this$props$onDataCha === void 0 ? function () {} : _this$props$onDataCha;
      onDataChange(modifiedData);
    };

    return _this;
  }

  _createClass(EditableTree, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          data = _this$props.data,
          _this$props$maxLevel = _this$props.maxLevel,
          maxLevel = _this$props$maxLevel === void 0 ? 50 : _this$props$maxLevel,
          enableYaml = _this$props.enableYaml,
          _this$props$lang = _this$props.lang,
          lang = _this$props$lang === void 0 ? "zh_CN" : _this$props$lang;

      if (data) {
        this.dataOrigin = data; // default value wrapper

        _Tree["default"].defaultTreeValueWrapper(this.dataOrigin);

        _Tree["default"].levelDepthWrapper(this.dataOrigin);

        var formattedData = this.formatTreeData(this.dataOrigin);
        this.updateTreeModel({
          data: this.dataOrigin,
          key: this.key
        });

        var keys = _Tree["default"].getTreeKeys(this.dataOrigin);

        this.onDataChange(this.dataOrigin);
        this.setState({
          treeData: formattedData,
          expandedKeys: keys,
          enableYaml: !!enableYaml,
          maxLevel: maxLevel,
          lang: lang
        });
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var data = nextProps.data,
          _nextProps$maxLevel = nextProps.maxLevel,
          maxLevel = _nextProps$maxLevel === void 0 ? 50 : _nextProps$maxLevel,
          enableYaml = nextProps.enableYaml,
          _nextProps$lang = nextProps.lang,
          lang = _nextProps$lang === void 0 ? "zh_CN" : _nextProps$lang;
      this.setState({
        enableYaml: !!enableYaml,
        lang: lang,
        maxLevel: maxLevel
      });

      try {
        if (!(0, _utils.deepComparison)(_Tree["default"].getNudeTreeData((0, _utils.deepClone)(this.dataOrigin)), _Tree["default"].getNudeTreeData((0, _utils.deepClone)(data)))) {
          this.dataOrigin = data; // default value wrapper

          _Tree["default"].defaultTreeValueWrapper(this.dataOrigin);

          _Tree["default"].levelDepthWrapper(this.dataOrigin); // render tree node


          var formattedData = this.formatTreeData(this.dataOrigin);
          this.updateTreeModel({
            data: this.dataOrigin,
            key: this.key
          });

          var keys = _Tree["default"].getTreeKeys(this.dataOrigin);

          this.onDataChange(this.dataOrigin);
          this.setState({
            treeData: formattedData,
            expandedKeys: keys
          });
        }
      } catch (error) {
        console.log(error, '----');
      }
    }
    /* modify a tree node */

  }, {
    key: "render",
    value: function render() {
      var treeData = this.state.treeData;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "editable-tree-wrapper"
      }, treeData && treeData.length ? /*#__PURE__*/_react["default"].createElement(_antd.Tree, {
        showLine: true,
        onExpand: this.onExpand,
        expandedKeys: this.state.expandedKeys // defaultExpandedKeys={this.state.expandedKeys}
        ,
        defaultExpandAll: true,
        treeData: treeData
      }) : null);
    }
  }]);

  return EditableTree;
}(_react.Component);

EditableTree.propTypes = {
  data: _propTypes["default"].array.isRequired,
  // tree data, required
  onDataChange: _propTypes["default"].func,
  // data change callback, default none
  maxLevel: _propTypes["default"].number,
  // tree max level, default 50
  lang: _propTypes["default"].string,
  // lang - zh_CN/en_US, default zh_CN
  enableYaml: _propTypes["default"].bool // enable it if you want to parse yaml string when adding a new node, default false

};
var _default = EditableTree;
exports["default"] = _default;